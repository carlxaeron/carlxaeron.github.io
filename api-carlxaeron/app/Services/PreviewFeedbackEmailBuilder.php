<?php

namespace App\Services;

use App\Support\OutreachSignature;

/**
 * Auto-reply emails when a prospect likes, dislikes, or agrees on a client preview.
 */
final class PreviewFeedbackEmailBuilder
{

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{0:string,1:string,2:string}
     */
    public static function build(string $sentiment, array $ctx): array
    {
        return match ($sentiment) {
            'dislike' => self::dislike($ctx),
            'agree' => self::agree($ctx),
            default => self::like($ctx),
        };
    }

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{0:string,1:string,2:string}
     */
    private static function like(array $ctx): array
    {
        $name = (string) ($ctx['contact_name'] ?: 'there');
        $biz = (string) ($ctx['business_name'] ?: 'your business');
        $preview = (string) $ctx['preview_url'];
        $timeline = trim((string) ($ctx['timeline'] ?? ''));
        $payment = OutreachCadence::paymentTerms($ctx);

        $subject = "Thanks for liking the {$biz} preview — ready to move forward?";

        $timelineLine = $timeline !== ''
            ? "We can target <strong>".e($timeline)."</strong> once the project starts."
            : 'We can agree on a timeline once you are ready to begin.';

        $html = '<h2>Thanks for the thumbs up</h2>'
            .'<p>Hi '.e($name).',</p>'
            .'<p>Thank you for liking the sample website and admin system I prepared for <strong>'.e($biz).'</strong>. '
            .'It is good to know the direction resonates with you.</p>'
            .'<p>If you are ready to <strong>push through on the website</strong>, we can begin with the deposit '
            .'(<strong>'.e($payment).'</strong>). '.$timelineLine
            .' The quoted package is <strong>website only</strong>; the admin preview is a sample — a production system is priced separately if you want one.</p>'
            .'<p><strong>Preview again (site + admin on desktop &amp; mobile):</strong> '
            .'<a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>Reply to this email if you want to proceed, need a quick tweak first, or have questions about scope or payment.</p>'
            .OutreachSignature::facebookContactHtml()
            .OutreachSignature::html();

        $timelineText = $timeline !== ''
            ? "We can target {$timeline} once the project starts."
            : 'We can agree on a timeline once you are ready to begin.';

        $text = "Hi {$name},\n\n"
            ."Thank you for liking the sample website and admin system for {$biz}.\n\n"
            ."If you are ready to push through on the website, we can begin with the deposit ({$payment}). {$timelineText} "
            ."The quoted package is website only; the admin preview is a sample — a production system is priced separately if you want one.\n\n"
            ."Preview (site + admin): {$preview}\n\n"
            ."Reply if you want to proceed, need a tweak first, or have questions.\n\n"
            .OutreachSignature::facebookContactText()
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{0:string,1:string,2:string}
     */
    private static function agree(array $ctx): array
    {
        $name = (string) ($ctx['contact_name'] ?: 'there');
        $biz = (string) ($ctx['business_name'] ?: 'your business');
        $preview = (string) $ctx['preview_url'];

        $subject = "Thanks — I'll follow up on {$biz}";

        $html = '<h2>Thanks — you are ready to proceed</h2>'
            .'<p>Hi '.e($name).',</p>'
            .'<p>Thank you for confirming you want to move forward with the sample website for <strong>'.e($biz).'</strong>. '
            .'I will follow up shortly with next steps.</p>'
            .'<p>The quoted package is <strong>website only</strong>; the admin preview is a sample — a production system is priced separately if you want one.</p>'
            .'<p><strong>Preview again:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>Reply anytime if you have questions before I reach out.</p>'
            .OutreachSignature::facebookContactHtml()
            .OutreachSignature::html();

        $text = "Hi {$name},\n\n"
            ."Thank you for confirming you want to move forward with the sample website for {$biz}. "
            ."I will follow up shortly with next steps.\n\n"
            ."The quoted package is website only; the admin preview is a sample — a production system is priced separately if you want one.\n\n"
            ."Preview: {$preview}\n\n"
            ."Reply anytime if you have questions before I reach out.\n\n"
            .OutreachSignature::facebookContactText()
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{0:string,1:string,2:string}
     */
    private static function dislike(array $ctx): array
    {
        $name = (string) ($ctx['contact_name'] ?: 'there');
        $biz = (string) ($ctx['business_name'] ?: 'your business');
        $preview = (string) $ctx['preview_url'];
        $comment = trim((string) ($ctx['comment'] ?? ''));

        $subject = "Thanks for your feedback on {$biz} — how can we improve?";

        $commentHtml = $comment !== ''
            ? '<p>I read your note: <em>“'.e($comment).'”</em></p>'
            : '';
        $commentText = $comment !== ''
            ? "I read your note: \"{$comment}\"\n\n"
            : '';

        $html = '<h2>Thanks for your honest feedback</h2>'
            .'<p>Hi '.e($name).',</p>'
            .'<p>Thank you for taking a moment to share feedback on the sample website and admin system for <strong>'.e($biz).'</strong>. '
            .'Honest input helps me get the preview closer to what you want.</p>'
            .$commentHtml
            .'<p>What would make the sample feel right for you — layout, photos, wording, or something else? '
            .'I am happy to revise before we move forward.</p>'
            .'<p>If you are still interested, reply with what to change. If timing is not right, that is okay too — '
            .'just let me know.</p>'
            .'<p><strong>Preview:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .OutreachSignature::facebookContactHtml()
            .OutreachSignature::html();

        $text = "Hi {$name},\n\n"
            ."Thank you for sharing feedback on the sample website and admin system for {$biz}.\n\n"
            .$commentText
            ."What would make the sample feel right for you? I am happy to revise before we move forward.\n\n"
            ."If you are still interested, reply with what to change. If timing is not right, just let me know.\n\n"
            ."Preview: {$preview}\n\n"
            .OutreachSignature::facebookContactText()
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }
}
