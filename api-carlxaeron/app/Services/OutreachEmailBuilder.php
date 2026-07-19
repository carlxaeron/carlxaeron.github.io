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
    private static function samplePhrase(array $job): string
    {
        $label = self::systemLabel($job);

        return $label !== ''
            ? "sample website and {$label}"
            : 'sample website and browsable admin system';
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
        $sample = self::samplePhrase($job);

        $subject = "Website + admin preview for {$biz} — site & system on desktop and mobile";
        $html = '<h2>Website + admin preview for '.e($biz).'</h2>'
            .'<p>Hi '.e($name).',</p>'
            .'<p>I prepared a <strong>'.e($sample).'</strong> for <strong>'.e($biz).'</strong> '
            .'so you can see how your business could look online on <strong>desktop and mobile</strong>.</p>'
            .'<p><strong>Preview (site + admin — scroll inside each frame):</strong> '
            .'<a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<ul>'
            .'<li><strong>Site</strong> — desktop and mobile marketing page (<code>/</code>)</li>'
            .'<li><strong>Admin</strong> — desktop and mobile demo, already logged in (<code>/admin/</code>) — '
            .'click through Dashboard, Bookings/Calendar, and other sample pages</li>'
            .'</ul>'
            .'<p><strong>Package:</strong> '.e($pkg).'<br>'
            .($amount !== '' ? '<strong>Investment (total):</strong> '.e($amount).'<br>' : '')
            .'<strong>Payment:</strong> '.e($payment).'<br>'
            .'<strong>Timeline:</strong> '.e($timeline).'</p>'
            .'<p><em>To start, only the upfront portion is due — not the full package amount.</em></p>'
            .'<p>Reply if you like the site and admin preview, want changes, or want to proceed.</p>'
            .OutreachSignature::html();
        $text = "Hi {$name},\n\n{$sample} for {$biz}:\n{$preview}\n\n"
            ."The preview shows site + admin on desktop and mobile. Browse the admin pages inside the frames.\n\n"
            ."Package: {$pkg}\n"
            .($amount !== '' ? "Investment (total): {$amount}\n" : '')
            ."Payment: {$payment}\n"
            ."To start, only the upfront portion is due — not the full package amount.\n"
            ."Timeline: {$timeline}\n\n"
            ."Reply if you like the site and admin preview, want changes, or want to proceed.\n\n"
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
        $isWeekFollowUp = $count >= 1;
        $offer = OutreachCadence::followupOfferCopy($job, $count);
        $totalPct = $offer['totalPct'];
        $discounted = $offer['discounted'];

        if ($isWeekFollowUp) {
            $subject = $totalPct > 0
                ? "Still interested? {$totalPct}% off — {$biz} website + admin preview"
                : "Still interested? {$biz} website + admin preview";
            $ask = 'Did you <strong>like</strong> the site and admin sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?'
                .'<br><br>Payment stays <strong>'.e($payment).'</strong>'
                .($discounted !== null
                    ? ' on the discounted total of <strong>'.e($discounted).'</strong>'
                    : '')
                .'. Only the upfront half is due to start.';
            $askText = 'Did you like the site and admin sample, want revisions, or is it not a fit right now?'
                ."\n\nPayment stays {$payment}"
                .($discounted !== null ? " on the discounted total of {$discounted}" : '')
                .'. Only the upfront half is due to start.';
        } else {
            $subject = $totalPct > 0
                ? "Quick check-in + {$totalPct}% off — your {$biz} website + admin preview"
                : "Quick check-in — your {$biz} website + admin preview";
            $ask = 'Did the <strong>site and admin</strong> previews look useful on desktop and mobile? Anything to change? Ready to proceed with <strong>'
                .e($pkg).'</strong>'
                .($discounted !== null ? ' at <strong>'.e($discounted).'</strong>' : '')
                .'? Only the upfront portion is due to begin — not the full amount.';
            $askText = "Did the site and admin previews look useful on desktop and mobile? Anything to change? Ready to proceed with {$pkg}"
                .($discounted !== null ? " at {$discounted}" : '')
                .'? Only the upfront portion is due to begin — not the full amount.';
        }

        $html = '<p>Hi '.e($name).',</p>'
            .'<p>Checking in about the sample website and admin system for <strong>'.e($biz).'</strong>.</p>'
            .'<p><strong>Preview (site + admin):</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>'.$ask.'</p>'
            .$offer['html']
            .'<p>No pressure — a short reply is enough.</p>'
            .OutreachSignature::html();
        $text = "Hi {$name},\n\nChecking in about {$biz} (site + admin preview).\nPreview: {$preview}\n\n{$askText}\n\n"
            .$offer['text']."\n\n"
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }
}
