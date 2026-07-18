<?php

namespace App\Services;

use App\Models\OutreachJob;
use App\Models\PreviewFeedback;
use Illuminate\Support\Facades\Log;

/**
 * Sends one auto-reply email per preview feedback row when a prospect email is known.
 */
final class PreviewFeedbackAutoReply
{
    public function __construct(
        private OutreachMailer $mailer,
    ) {}

    public function maybeSend(PreviewFeedback $feedback, ?string $requestEmail = null): void
    {
        if ($feedback->auto_reply_sent_at !== null) {
            return;
        }

        $email = $this->resolveProspectEmail($feedback->preview_slug, $requestEmail);
        if ($email === null) {
            return;
        }

        $context = $this->buildContext($feedback, $email);
        [$subject, $html, $text] = PreviewFeedbackEmailBuilder::build($feedback->sentiment, $context);

        $result = $this->mailer->sendProspectMessage($email, $subject, $html, $text);
        if (! ($result['ok'] ?? false)) {
            Log::warning('Preview feedback auto-reply SMTP failed', [
                'slug' => $feedback->preview_slug,
                'sentiment' => $feedback->sentiment,
                'error' => $result['error'] ?? 'unknown',
            ]);

            return;
        }

        $feedback->forceFill([
            'prospect_email' => $email,
            'auto_reply_sent_at' => now(),
        ])->save();
    }

    private function resolveProspectEmail(string $slug, ?string $requestEmail): ?string
    {
        $fromRequest = strtolower(trim((string) $requestEmail));
        if ($fromRequest !== '' && filter_var($fromRequest, FILTER_VALIDATE_EMAIL)) {
            return $fromRequest;
        }

        $job = OutreachJob::query()
            ->where('slug', $slug)
            ->whereNotNull('contact_email')
            ->where('contact_email', '!=', '')
            ->orderByDesc('id')
            ->first();

        $fromJob = strtolower(trim((string) ($job?->contact_email ?? '')));
        if ($fromJob !== '' && filter_var($fromJob, FILTER_VALIDATE_EMAIL)) {
            return $fromJob;
        }

        return null;
    }

    /** @return array<string, mixed> */
    private function buildContext(PreviewFeedback $feedback, string $email): array
    {
        $slug = $feedback->preview_slug;
        $job = OutreachJob::query()
            ->where('slug', $slug)
            ->orderByDesc('id')
            ->first();

        $label = trim((string) ($feedback->preview_label ?: ''));
        $businessName = trim((string) ($job?->business_name ?: ''));
        if ($businessName === '' && $label !== '') {
            $businessName = $label;
        }

        $contactName = trim((string) ($job?->contact_name ?: ''));
        if ($contactName === '') {
            $contactName = $this->nameFromEmail($email);
        }

        return [
            'contact_name' => $contactName,
            'business_name' => $businessName !== '' ? $businessName : $slug,
            'preview_url' => (string) ($job?->preview_url ?: "https://carlmanuel.com/?preview={$slug}"),
            'package_name' => (string) ($job?->package_name ?: ''),
            'quoted_amount' => (string) ($job?->quoted_amount ?: ''),
            'timeline' => (string) ($job?->timeline ?: ''),
            'payment_terms' => '',
            'comment' => (string) ($feedback->comment ?: ''),
        ];
    }

    private function nameFromEmail(string $email): string
    {
        $local = explode('@', $email)[0] ?? '';
        $local = str_replace(['.', '_', '-'], ' ', $local);
        $local = trim($local);

        if ($local === '') {
            return 'there';
        }

        return ucwords($local);
    }
}
