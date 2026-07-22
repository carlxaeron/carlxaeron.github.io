<?php

namespace App\Services;

/**
 * Builds outreach email view data (HTML/text live in Blade under resources/views/emails/).
 */
final class OutreachEmailBuilder
{
    /**
     * @param  array<string, mixed>  $job
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
     */
    public static function initial(array $job): array
    {
        $name = (string) $job['contact_name'];
        $biz = (string) $job['business_name'];
        $preview = (string) $job['preview_url'];
        $pkg = (string) ($job['package_name'] ?: 'Starter Business Website');
        $amount = (string) ($job['quoted_amount'] ?: '');
        $timeline = (string) ($job['timeline'] ?: '');
        $payment = OutreachCadence::paymentTerms($job);
        $label = self::systemLabel($job);
        $pain = self::systemPain($job);
        $site = trim((string) ($job['site_access_url'] ?? ''));
        $admin = trim((string) ($job['admin_access_url'] ?? ''));
        $hasAttachments = ! empty($job['has_attachments']) || ! empty($job['attachments']);

        $subject = $label !== ''
            ? "{$label} + website sample for {$biz}"
            : "Business system + website sample for {$biz}";

        $headline = $label !== ''
            ? "{$label} + website sample for {$biz}"
            : "Business system + website sample for {$biz}";

        $data = [
            'title' => $subject,
            'preheader' => $label !== ''
                ? "Sample {$label} and website for {$biz}"
                : "Sample admin system and website for {$biz}",
            'headline' => $headline,
            'contactName' => $name,
            'businessName' => $biz,
            'previewUrl' => $preview,
            'packageName' => $pkg,
            'quotedAmount' => $amount,
            'timeline' => $timeline,
            'paymentTerms' => $payment,
            'systemLabel' => $label,
            'systemPain' => $pain,
            'adminBrowseLabel' => $label !== '' ? $label : 'admin demo',
            'siteAccessUrl' => $site,
            'adminAccessUrl' => $admin,
            'hasAttachments' => $hasAttachments,
            'showFacebookContact' => true,
        ];

        return [
            'subject' => $subject,
            'view' => 'emails.outreach.initial',
            'text' => 'emails.outreach.initial-text',
            'data' => $data,
        ];
    }

    /**
     * @param  array<string, mixed>  $job
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
     */
    public static function followup(array $job): array
    {
        $name = (string) $job['contact_name'];
        $biz = (string) $job['business_name'];
        $preview = (string) $job['preview_url'];
        $pkg = (string) ($job['package_name'] ?: 'Starter Business Website');
        $amount = (string) ($job['quoted_amount'] ?: '');
        $payment = OutreachCadence::paymentTerms($job);
        $count = (int) ($job['follow_up_count'] ?? 0);
        $label = self::systemLabel($job);
        $systemPhrase = $label !== '' ? $label : 'admin system';
        $isWeekFollowUp = $count >= 1;
        $offer = OutreachCadence::followupOfferData($job, $count);
        $totalPct = $offer['totalPct'];
        $discounted = $offer['discounted'];

        if ($isWeekFollowUp) {
            $subject = $totalPct > 0
                ? "Still interested? {$totalPct}% off website — {$biz} {$systemPhrase} + website preview"
                : "Still interested? {$biz} {$systemPhrase} + website preview";
        } else {
            $subject = $totalPct > 0
                ? "Quick check-in + {$totalPct}% off website — your {$biz} {$systemPhrase} + website preview"
                : "Quick check-in — your {$biz} {$systemPhrase} + website preview";
        }

        $data = [
            'title' => $subject,
            'preheader' => "Checking in on your {$biz} preview",
            'contactName' => $name,
            'businessName' => $biz,
            'previewUrl' => $preview,
            'packageName' => $pkg,
            'quotedAmount' => $amount,
            'paymentTerms' => $payment,
            'systemPhrase' => $systemPhrase,
            'isWeekFollowUp' => $isWeekFollowUp,
            'totalPct' => $totalPct,
            'stepPct' => $offer['stepPct'],
            'showAnotherStep' => $offer['showAnotherStep'],
            'discounted' => $discounted,
            'showFacebookContact' => true,
        ];

        return [
            'subject' => $subject,
            'view' => 'emails.outreach.followup',
            'text' => 'emails.outreach.followup-text',
            'data' => $data,
        ];
    }

    /**
     * Render subject + HTML + text (for unit tests / assertions).
     *
     * @param  array<string, mixed>  $job
     * @return array{0:string,1:string,2:string}
     */
    public static function renderInitial(array $job): array
    {
        return self::renderPayload(self::initial($job));
    }

    /**
     * @param  array<string, mixed>  $job
     * @return array{0:string,1:string,2:string}
     */
    public static function renderFollowup(array $job): array
    {
        return self::renderPayload(self::followup($job));
    }

    /**
     * @param  array{subject:string,view:string,text:string,data:array<string,mixed>}  $payload
     * @return array{0:string,1:string,2:string}
     */
    public static function renderPayload(array $payload): array
    {
        $html = view($payload['view'], $payload['data'])->render();
        $text = view($payload['text'], $payload['data'])->render();

        return [$payload['subject'], $html, $text];
    }

    /** @param  array<string, mixed>  $job */
    private static function systemLabel(array $job): string
    {
        return trim((string) ($job['system_label'] ?? ''));
    }

    /** @param  array<string, mixed>  $job */
    private static function systemPain(array $job): string
    {
        return trim((string) ($job['system_pain'] ?? ''));
    }
}
