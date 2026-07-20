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
     * Quoted amounts (₱15k / ₱18k) are website-only; admin preview is a sample; production system is extra.
     *
     * @return array{0:string,1:string} [html fragment, plain text fragment]
     */
    private static function websitePricingBlock(string $pkg, string $amount, string $payment, string $timeline): array
    {
        $amountHtml = $amount !== ''
            ? '<strong>Investment (website only):</strong> '.e($amount).'<br>'
            : '';
        $amountText = $amount !== '' ? "Investment (website only): {$amount}\n" : '';

        $html = '<p><strong>Package:</strong> '.e($pkg).' <em>(website only)</em><br>'
            .$amountHtml
            .'<strong>Payment:</strong> '.e($payment).'<br>'
            .'<strong>Timeline:</strong> '.e($timeline).'</p>'
            .'<p><strong>Admin system:</strong> the preview includes a <em>sample</em> so you can explore how day-to-day operations could look. '
            .'A production business system is <strong>priced separately</strong> if you want that built for real.</p>'
            .'<p><em>To start the website, only the upfront portion is due — not the full website amount.</em></p>';

        $text = "Package: {$pkg} (website only)\n"
            .$amountText
            ."Payment: {$payment}\n"
            ."Timeline: {$timeline}\n\n"
            ."Admin system: the preview includes a sample so you can explore operations. "
            ."A production business system is priced separately if you want that built for real.\n"
            ."To start the website, only the upfront portion is due — not the full website amount.\n";

        return [$html, $text];
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
        [$pricingHtml, $pricingText] = self::websitePricingBlock($pkg, $amount, $payment, $timeline);

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
            .$pricingHtml
            .'<p>Reply if the admin and site previews look right, you want changes, or you are ready to proceed '
            .'(website now, and/or a custom quote for a live system).</p>'
            .OutreachSignature::facebookContactHtml()
            .OutreachSignature::html();
        $text = "Hi {$name},\n\n{$hookText}\n"
            .self::adminBrowseText($job)
            ."Then the marketing site at / on desktop and mobile.\n"
            ."Preview: {$preview}\n\n"
            .$pricingText."\n"
            ."Reply if the admin and site previews look right, you want changes, or you are ready to proceed "
            ."(website now, and/or a custom quote for a live system).\n\n"
            .OutreachSignature::facebookContactText()
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

        $pricingAside = 'Quoted figures are for the <strong>website only</strong>. The admin preview is a sample — a production system is priced separately if you want one.';
        $pricingAsideText = 'Quoted figures are for the website only. The admin preview is a sample — a production system is priced separately if you want one.';

        if ($isWeekFollowUp) {
            $subject = $totalPct > 0
                ? "Still interested? {$totalPct}% off website — {$biz} {$systemPhrase} + website preview"
                : "Still interested? {$biz} {$systemPhrase} + website preview";
            $ask = 'Did you <strong>browse the admin</strong> preview and like the sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?'
                .'<br><br>Website payment stays <strong>'.e($payment).'</strong>'
                .($discounted !== null
                    ? ' on the discounted <strong>website</strong> total of <strong>'.e($discounted).'</strong>'
                    : '')
                .'. Only the upfront half is due to start the website.';
            $askText = 'Did you browse the admin preview and like the sample, want revisions, or is it not a fit right now?'
                ."\n\nWebsite payment stays {$payment}"
                .($discounted !== null ? " on the discounted website total of {$discounted}" : '')
                .'. Only the upfront half is due to start the website.';
        } else {
            $subject = $totalPct > 0
                ? "Quick check-in + {$totalPct}% off website — your {$biz} {$systemPhrase} + website preview"
                : "Quick check-in — your {$biz} {$systemPhrase} + website preview";
            $ask = 'Did the <strong>admin</strong> preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with the <strong>website</strong> package (<strong>'
                .e($pkg).'</strong>'
                .($discounted !== null ? ' at <strong>'.e($discounted).'</strong>' : '')
                .')? Only the upfront portion is due to begin — not the full website amount. Want a live system too? I can quote that separately.';
            $askText = "Did the admin preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with the website package ({$pkg}"
                .($discounted !== null ? " at {$discounted}" : '')
                .')? Only the upfront portion is due to begin — not the full website amount. Want a live system too? I can quote that separately.';
        }

        $html = '<p>Hi '.e($name).',</p>'
            .'<p>Checking in about the sample <strong>'.e($systemPhrase).'</strong> and website for <strong>'.e($biz).'</strong>.</p>'
            .'<p><strong>Preview (admin + site):</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>'.$ask.'</p>'
            .'<p><em>'.$pricingAside.'</em></p>'
            .$offer['html']
            .'<p>No pressure — a short reply is enough.</p>'
            .OutreachSignature::facebookContactHtml()
            .OutreachSignature::html();
        $text = "Hi {$name},\n\nChecking in about the {$systemPhrase} and website for {$biz}.\nPreview: {$preview}\n\n{$askText}\n\n"
            ."{$pricingAsideText}\n\n"
            .$offer['text']."\n\n"
            .OutreachSignature::facebookContactText()
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }
}
