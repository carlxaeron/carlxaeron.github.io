<?php

namespace App\Services;

use App\Support\OutreachSignature;

/**
 * Builds outreach HTML/text bodies (mirrors hosting-php/src/outreach.php).
 */
final class OutreachEmailBuilder
{
    /**
     * @param  array<string, mixed>  $job
     */
    private static function systemLabel(array $job): string
    {
        return trim((string) ($job['system_label'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $job
     */
    private static function systemPain(array $job): string
    {
        return trim((string) ($job['system_pain'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $job
     */
    private static function systemHookSentence(array $job, bool $html = true): string
    {
        $label = self::systemLabel($job);
        $pain = self::systemPain($job);
        $biz = (string) $job['business_name'];

        if ($label !== '' && $pain !== '') {
            if ($html) {
                return 'I prepared a sample <strong>'.e($label).'</strong> for <strong>'.e($biz).'</strong>. '
                    .'<strong>'.e($pain).'</strong>';
            }

            return "I prepared a sample {$label} for {$biz}. {$pain}";
        }

        if ($label !== '') {
            if ($html) {
                return 'I prepared a sample <strong>'.e($label).'</strong> for <strong>'.e($biz).'</strong> '
                    .'— so day-to-day work lives in one place instead of scattered chats and notes.';
            }

            return "I prepared a sample {$label} for {$biz} — so day-to-day work lives in one place instead of scattered chats and notes.";
        }

        if ($html) {
            return 'I prepared a sample <strong>business admin system and website</strong> for <strong>'.e($biz).'</strong> '
                .'— operations first, with a marketing site as the public face.';
        }

        return "I prepared a sample business admin system and website for {$biz} — operations first, with a marketing site as the public face.";
    }

    /**
     * @param  array<string, mixed>  $job
     */
    private static function adminBrowseHtml(array $job): string
    {
        $label = self::systemLabel($job);
        $adminName = $label !== '' ? $label : 'admin demo';

        return '<p><strong>Start with the admin (desktop &amp; mobile):</strong> the preview opens on your '
            .'<strong>'.e($adminName).'</strong> — already logged in at <code>/admin/</code>. '
            .'Scroll inside the frames and click Dashboard, Bookings/Calendar, and other sample pages.</p>';
    }

    /**
     * @param  array<string, mixed>  $job
     */
    private static function adminBrowseText(array $job): string
    {
        $label = self::systemLabel($job);
        $adminName = $label !== '' ? $label : 'admin demo';

        return "Start with the admin (desktop & mobile): {$adminName} at /admin/ — scroll inside the frames and browse the sample pages.\n\n";
    }

    /**
     * @param  array<string, mixed>  $job
     * @return array{0:string,1:string,2:string}
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
        $hook = self::systemHookSentence($job, true);
        $hookText = self::systemHookSentence($job, false);

        $subject = $label !== ''
            ? "{$label} + website sample for {$biz}"
            : "Business system + website sample for {$biz}";

        $title = $label !== ''
            ? e($label).' + website sample'
            : 'Business system + website sample';

        $html = '<h2>'.$title.' for '.e($biz).'</h2>'
            .'<p>Hi '.e($name).',</p>'
            .'<p>'.$hook.'</p>'
            .self::adminBrowseHtml($job)
            .'<p><strong>Then the marketing site:</strong> desktop and mobile pages at <code>/</code> show '
            .'how '.e($biz).' could look online.</p>'
            .'<p><strong>Preview link:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p><strong>Package:</strong> '.e($pkg).'<br>'
            .($amount !== '' ? '<strong>Investment (total):</strong> '.e($amount).'<br>' : '')
            .'<strong>Payment:</strong> '.e($payment).'<br>'
            .'<strong>Timeline:</strong> '.e($timeline).'</p>'
            .'<p><em>To start, only the upfront portion is due — not the full package amount.</em></p>'
            .'<p>Reply if the admin and site previews look right, you want changes, or you are ready to proceed.</p>'
            .OutreachSignature::html();
        $text = "Hi {$name},\n\n{$hookText}\n"
            .self::adminBrowseText($job)
            ."Then the marketing site at / on desktop and mobile.\n"
            ."Preview: {$preview}\n\n"
            ."Package: {$pkg}\n"
            .($amount !== '' ? "Investment (total): {$amount}\n" : '')
            ."Payment: {$payment}\n"
            ."To start, only the upfront portion is due — not the full package amount.\n"
            ."Timeline: {$timeline}\n\n"
            ."Reply if the admin and site previews look right, you want changes, or you are ready to proceed.\n\n"
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }

    /**
     * @param  array<string, mixed>  $job
     * @return array{0:string,1:string,2:string}
     */
    public static function followup(array $job): array
    {
        $name = (string) $job['contact_name'];
        $biz = (string) $job['business_name'];
        $preview = (string) $job['preview_url'];
        $pkg = (string) ($job['package_name'] ?: 'Starter Business Website');
        $payment = OutreachCadence::paymentTerms($job);
        $count = (int) ($job['follow_up_count'] ?? 0);
        $label = self::systemLabel($job);
        $systemPhrase = $label !== '' ? $label : 'admin system';
        $isWeekFollowUp = $count >= 1;
        $offer = OutreachCadence::followupOfferCopy($job, $count);
        $totalPct = $offer['totalPct'];
        $discounted = $offer['discounted'];

        if ($isWeekFollowUp) {
            $subject = $totalPct > 0
                ? "Still interested? {$totalPct}% off — {$biz} {$systemPhrase} + website preview"
                : "Still interested? {$biz} {$systemPhrase} + website preview";
            $ask = 'Did you <strong>browse the admin</strong> preview and like the sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?'
                .'<br><br>Payment stays <strong>'.e($payment).'</strong>'
                .($discounted !== null
                    ? ' on the discounted total of <strong>'.e($discounted).'</strong>'
                    : '')
                .'. Only the upfront half is due to start.';
            $askText = 'Did you browse the admin preview and like the sample, want revisions, or is it not a fit right now?'
                ."\n\nPayment stays {$payment}"
                .($discounted !== null ? " on the discounted total of {$discounted}" : '')
                .'. Only the upfront half is due to start.';
        } else {
            $subject = $totalPct > 0
                ? "Quick check-in + {$totalPct}% off — your {$biz} {$systemPhrase} + website preview"
                : "Quick check-in — your {$biz} {$systemPhrase} + website preview";
            $ask = 'Did the <strong>admin</strong> preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with <strong>'
                .e($pkg).'</strong>'
                .($discounted !== null ? ' at <strong>'.e($discounted).'</strong>' : '')
                .'? Only the upfront portion is due to begin — not the full amount.';
            $askText = "Did the admin preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with {$pkg}"
                .($discounted !== null ? " at {$discounted}" : '')
                .'? Only the upfront portion is due to begin — not the full amount.';
        }

        $html = '<p>Hi '.e($name).',</p>'
            .'<p>Checking in about the sample <strong>'.e($systemPhrase).'</strong> and website for <strong>'.e($biz).'</strong>.</p>'
            .'<p><strong>Preview (admin + site):</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>'.$ask.'</p>'
            .$offer['html']
            .'<p>No pressure — a short reply is enough.</p>'
            .OutreachSignature::html();
        $text = "Hi {$name},\n\nChecking in about the {$systemPhrase} and website for {$biz}.\nPreview: {$preview}\n\n{$askText}\n\n"
            .$offer['text']."\n\n"
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }
}
