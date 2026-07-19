<?php

namespace App\Services;

use App\Models\OutreachJob;
use Illuminate\Support\Carbon;

final class OutreachScheduler
{
    public function __construct(
        private OutreachMailer $mailer,
        private PushNotificationService $push,
    ) {}

    /**
     * @param  array<string, mixed>  $body
     * @return array<string, mixed>
     */
    public function schedule(array $body): array
    {
        $slug = substr(trim((string) ($body['slug'] ?? '')), 0, 64);
        $businessName = trim((string) ($body['businessName'] ?? ''));
        $contactName = trim((string) ($body['contactName'] ?? ''));
        $contactEmail = trim((string) ($body['contactEmail'] ?? ''));
        $previewUrl = trim((string) ($body['previewUrl'] ?? ''));
        $packageName = trim((string) ($body['packageName'] ?? ''));
        $quotedAmount = trim((string) ($body['quotedAmount'] ?? ''));
        $timeline = trim((string) ($body['timeline'] ?? ''));
        $paymentTerms = trim((string) ($body['paymentTerms'] ?? ''));
        if ($paymentTerms === '') {
            $paymentTerms = OutreachCadence::defaultPaymentTerms();
        }
        $cadence = OutreachCadence::normalize((string) ($body['cadence'] ?? '3d1w'));
        $sendInitial = ! empty($body['sendInitial']);
        $autoFollowUp = array_key_exists('autoFollowUp', $body) ? (bool) $body['autoFollowUp'] : true;
        $maxFollowUps = max(0, min(8, (int) ($body['maxFollowUps'] ?? OutreachCadence::defaultMaxFollowups())));
        $systemLabel = trim((string) ($body['systemLabel'] ?? ''));
        $systemPain = trim((string) ($body['systemPain'] ?? ''));

        if ($slug === '' || $businessName === '' || $contactName === '' || $contactEmail === '' || $previewUrl === '') {
            throw new \InvalidArgumentException('Missing required fields');
        }
        if (! filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid contactEmail');
        }

        $now = Carbon::now();
        $initialSentAt = null;
        $nextFollowUp = null;
        $status = 'scheduled';

        $jobPayload = [
            'contact_name' => $contactName,
            'business_name' => $businessName,
            'preview_url' => $previewUrl,
            'package_name' => $packageName,
            'quoted_amount' => $quotedAmount,
            'timeline' => $timeline,
            'payment_terms' => $paymentTerms,
            'contact_email' => $contactEmail,
            'cadence' => $cadence,
            'follow_up_count' => 0,
            'system_label' => $systemLabel,
            'system_pain' => $systemPain,
        ];

        if ($sendInitial) {
            $result = $this->mailer->sendToProspect($jobPayload, 'initial');
            if (! $result['ok']) {
                throw new \RuntimeException('Initial email failed: '.($result['error'] ?? 'unknown'));
            }
            $initialSentAt = $now;
            $status = 'sent';
            $this->tryPush(
                'Outreach email sent',
                "Quotation sent to {$contactEmail} ({$businessName})",
                [
                    'type' => 'outreach_initial',
                    'slug' => $slug,
                    'url' => '/#admin',
                ]
            );
            if ($autoFollowUp && $maxFollowUps > 0) {
                $days = OutreachCadence::daysUntilNext($cadence, 0);
                $nextFollowUp = $now->copy()->addDays($days);
            }
        } elseif ($autoFollowUp && $maxFollowUps > 0) {
            $days = OutreachCadence::daysUntilNext($cadence, 0);
            $nextFollowUp = $now->copy()->addDays($days);
            $status = 'waiting_followup';
        }

        $existing = OutreachJob::query()
            ->where('slug', $slug)
            ->where('contact_email', $contactEmail)
            ->first();

        $attributes = [
            'business_name' => $businessName,
            'contact_name' => $contactName,
            'preview_url' => $previewUrl,
            'package_name' => $packageName !== '' ? $packageName : null,
            'quoted_amount' => $quotedAmount !== '' ? $quotedAmount : null,
            'timeline' => $timeline !== '' ? $timeline : null,
            'cadence' => $cadence,
            'auto_followup' => $autoFollowUp,
            'max_followups' => $maxFollowUps,
            'status' => $status,
            'next_follow_up_at' => $nextFollowUp,
            'last_error' => null,
        ];

        if ($existing !== null) {
            $existing->fill($attributes);
            if ($initialSentAt !== null) {
                $existing->initial_sent_at = $initialSentAt;
            }
            $existing->save();
        } else {
            OutreachJob::query()->create(array_merge($attributes, [
                'slug' => $slug,
                'contact_email' => $contactEmail,
                'follow_up_count' => 0,
                'initial_sent_at' => $initialSentAt,
            ]));
        }

        return [
            'slug' => $slug,
            'contactEmail' => $contactEmail,
            'sendInitial' => $sendInitial,
            'autoFollowUp' => $autoFollowUp,
            'cadence' => $cadence,
            'nextFollowUpAt' => $nextFollowUp?->format('Y-m-d H:i:s'),
            'status' => $status,
        ];
    }

    /**
     * @return array{slug:string,updated:int}
     */
    public function pause(string $slug, string $email = ''): array
    {
        if ($slug === '') {
            throw new \InvalidArgumentException('Missing slug');
        }

        $query = OutreachJob::query()->where('slug', $slug);
        if ($email !== '') {
            $query->where('contact_email', $email);
        }

        $updated = $query->update([
            'auto_followup' => false,
            'status' => 'paused',
            'next_follow_up_at' => null,
        ]);

        return ['slug' => $slug, 'updated' => $updated];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function tryPush(string $title, string $body, array $data): void
    {
        try {
            $this->push->sendToAdmins($title, $body, $data);
        } catch (\Throwable) {
            // Push must never block outreach email delivery.
        }
    }
}
