<?php

namespace App\Services;

/**
 * Builds outreach HTML/text bodies (mirrors hosting-php/src/outreach.php).
 */
final class OutreachEmailBuilder
{
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

        $subject = "Website proposal for {$biz} — preview your sample site";
        $html = '<h2>Website proposal for '.e($biz).'</h2>'
            .'<p>Hi '.e($name).',</p>'
            .'<p>I prepared a <strong>sample one-page website</strong> for <strong>'.e($biz).'</strong> '
            .'so you can see how your business could look online on desktop and mobile.</p>'
            .'<p><strong>Preview:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p><strong>Package:</strong> '.e($pkg).'<br>'
            .($amount !== '' ? '<strong>Investment (total):</strong> '.e($amount).'<br>' : '')
            .'<strong>Payment:</strong> '.e($payment).'<br>'
            .'<strong>Timeline:</strong> '.e($timeline).'</p>'
            .'<p><em>To start, only the upfront portion is due — not the full package amount.</em></p>'
            .'<p>Reply if you like the preview, want changes, or want to proceed.</p>'
            .'<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
            .'<a href="https://carlmanuel.com">carlmanuel.com</a> · '
            .'<a href="https://www.facebook.com/profile.php?id=61557195950694">Facebook</a> · info@carlmanuel.com</p>';
        $text = "Hi {$name},\n\nSample website for {$biz}:\n{$preview}\n\n"
            ."Package: {$pkg}\n"
            .($amount !== '' ? "Investment (total): {$amount}\n" : '')
            ."Payment: {$payment}\n"
            ."To start, only the upfront portion is due — not the full package amount.\n"
            ."Timeline: {$timeline}\n\n"
            ."Reply if you like it, want changes, or want to proceed.\n\n"
            ."Carl Louis Manuel\ncarlmanuel.com · facebook.com/profile.php?id=61557195950694 · info@carlmanuel.com";

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
        $isWeekFollowUp = $count >= 1;
        $offer = OutreachCadence::followupOfferCopy($job, $count);
        $totalPct = $offer['totalPct'];
        $discounted = $offer['discounted'];

        if ($isWeekFollowUp) {
            $subject = $totalPct > 0
                ? "Still interested? {$totalPct}% off — {$biz} website proposal"
                : "Still interested? {$biz} website proposal";
            $ask = 'Did you <strong>like</strong> the sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?'
                .'<br><br>Payment stays <strong>'.e($payment).'</strong>'
                .($discounted !== null
                    ? ' on the discounted total of <strong>'.e($discounted).'</strong>'
                    : '')
                .'. Only the upfront half is due to start.';
            $askText = 'Did you like the sample, want revisions, or is it not a fit right now?'
                ."\n\nPayment stays {$payment}"
                .($discounted !== null ? " on the discounted total of {$discounted}" : '')
                .'. Only the upfront half is due to start.';
        } else {
            $subject = $totalPct > 0
                ? "Quick check-in + {$totalPct}% off — your {$biz} website preview"
                : "Quick check-in — your {$biz} website preview";
            $ask = 'Did the desktop + mobile preview look useful? Anything to change? Ready to proceed with <strong>'
                .e($pkg).'</strong>'
                .($discounted !== null ? ' at <strong>'.e($discounted).'</strong>' : '')
                .'? Only the upfront portion is due to begin — not the full amount.';
            $askText = "Did the preview look useful? Anything to change? Ready to proceed with {$pkg}"
                .($discounted !== null ? " at {$discounted}" : '')
                .'? Only the upfront portion is due to begin — not the full amount.';
        }

        $html = '<p>Hi '.e($name).',</p>'
            .'<p>Checking in about the sample website for <strong>'.e($biz).'</strong>.</p>'
            .'<p><strong>Preview:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>'.$ask.'</p>'
            .$offer['html']
            .'<p>No pressure — a short reply is enough.</p>'
            .'<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
            .'<a href="https://carlmanuel.com">carlmanuel.com</a> · '
            .'<a href="https://www.facebook.com/profile.php?id=61557195950694">Facebook</a> · info@carlmanuel.com</p>';
        $text = "Hi {$name},\n\nChecking in about {$biz}.\nPreview: {$preview}\n\n{$askText}\n\n"
            .$offer['text']."\n\n"
            ."Carl Louis Manuel\ncarlmanuel.com · facebook.com/profile.php?id=61557195950694 · info@carlmanuel.com";

        return [$subject, $html, $text];
    }
}
