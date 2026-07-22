<?php

namespace App\Services;

use App\Models\OutreachJob;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Process due outreach follow-ups via Laravel Mail + Blade (Artisan cron).
 */
final class OutreachFollowupProcessor
{
    public function __construct(
        private OutreachMailer $mailer,
        private PushNotificationService $push,
    ) {}

    /**
     * @return array{processed:int,sent:int,errors:list<string>}
     */
    public function process(int $limit = 50): array
    {
        $now = Carbon::now('UTC');

        $rows = OutreachJob::query()
            ->where('auto_followup', true)
            ->whereNotNull('next_follow_up_at')
            ->where('next_follow_up_at', '<=', $now)
            ->whereColumn('follow_up_count', '<', 'max_followups')
            ->whereIn('status', ['sent', 'waiting_followup', 'followup_sent'])
            ->orderBy('next_follow_up_at')
            ->limit($limit)
            ->get();

        $sent = 0;
        $errors = [];

        foreach ($rows as $job) {
            $payload = $this->jobToPayload($job);
            $result = $this->mailer->sendToProspect($payload, 'followup');
            if (! ($result['ok'] ?? false)) {
                $err = $result['error'] ?? 'send failed';
                $errors[] = 'id='.$job->id.' '.$err;
                $job->forceFill(['last_error' => substr($err, 0, 512)])->save();
                continue;
            }

            $count = (int) $job->follow_up_count + 1;
            $max = (int) $job->max_followups;
            $cadence = OutreachCadence::normalize((string) $job->cadence);
            $next = null;
            $status = 'followup_sent';
            if ($count < $max) {
                $days = OutreachCadence::daysUntilNext($cadence, $count);
                $next = Carbon::now('UTC')->addDays($days);
            } else {
                $status = 'completed';
            }

            $job->forceFill([
                'follow_up_count' => $count,
                'last_follow_up_at' => Carbon::now('UTC'),
                'next_follow_up_at' => $next,
                'status' => $status,
                'last_error' => null,
            ])->save();

            $this->tryPush($payload, $count);
            $sent++;
        }

        return [
            'processed' => $rows->count(),
            'sent' => $sent,
            'errors' => $errors,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function jobToPayload(OutreachJob $job): array
    {
        return [
            'id' => $job->id,
            'slug' => $job->slug,
            'contact_name' => $job->contact_name,
            'contact_email' => $job->contact_email,
            'business_name' => $job->business_name,
            'preview_url' => $job->preview_url,
            'package_name' => (string) ($job->package_name ?? ''),
            'quoted_amount' => (string) ($job->quoted_amount ?? ''),
            'timeline' => (string) ($job->timeline ?? ''),
            'payment_terms' => '',
            'follow_up_count' => (int) $job->follow_up_count,
            'cadence' => (string) $job->cadence,
            'system_label' => '',
            'system_pain' => '',
        ];
    }

    /**
     * @param  array<string, mixed>  $job
     */
    private function tryPush(array $job, int $followUpNumber): void
    {
        try {
            $business = trim((string) ($job['business_name'] ?? 'Client'));
            $email = trim((string) ($job['contact_email'] ?? ''));
            $slug = trim((string) ($job['slug'] ?? ''));
            $this->push->sendToAdmins(
                'Outreach follow-up sent',
                "Follow-up #{$followUpNumber} sent to {$email} ({$business})",
                [
                    'type' => 'outreach_followup',
                    'slug' => $slug,
                    'url' => '/#admin',
                ]
            );
        } catch (\Throwable $e) {
            Log::warning('Outreach follow-up push failed', ['error' => $e->getMessage()]);
        }
    }
}
