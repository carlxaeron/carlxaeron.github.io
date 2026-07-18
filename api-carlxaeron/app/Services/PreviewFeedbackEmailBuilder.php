<?php

namespace App\Services;

/**
 * Auto-reply emails when a prospect likes or dislikes a client preview.
 */
final class PreviewFeedbackEmailBuilder
{
    private const FB_PROFILE = '61557195950694';

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{0:string,1:string,2:string}
     */
    public static function build(string $sentiment, array $ctx): array
    {
        return $sentiment === 'dislike'
            ? self::dislike($ctx)
            : self::like($ctx);
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
            .'<p>Thank you for liking the sample website I prepared for <strong>'.e($biz).'</strong>. '
            .'It is good to know the direction resonates with you.</p>'
            .'<p>If you are ready to <strong>push through</strong>, we can begin with the deposit '
            .'(<strong>'.e($payment).'</strong>). '.$timelineLine.'</p>'
            .'<p><strong>Preview again:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .'<p>Reply to this email if you want to proceed, need a quick tweak first, or have questions about scope or payment.</p>'
            .self::signatureHtml();

        $timelineText = $timeline !== ''
            ? "We can target {$timeline} once the project starts."
            : 'We can agree on a timeline once you are ready to begin.';

        $text = "Hi {$name},\n\n"
            ."Thank you for liking the sample website for {$biz}.\n\n"
            ."If you are ready to push through, we can begin with the deposit ({$payment}). {$timelineText}\n\n"
            ."Preview: {$preview}\n\n"
            ."Reply if you want to proceed, need a tweak first, or have questions.\n\n"
            .self::signatureText();

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
            .'<p>Thank you for taking a moment to share feedback on the sample website for <strong>'.e($biz).'</strong>. '
            .'Honest input helps me get the preview closer to what you want.</p>'
            .$commentHtml
            .'<p>What would make the sample feel right for you — layout, photos, wording, or something else? '
            .'I am happy to revise before we move forward.</p>'
            .'<p>If you are still interested, reply with what to change. If timing is not right, that is okay too — '
            .'just let me know.</p>'
            .'<p><strong>Preview:</strong> <a href="'.e($preview).'">'.e($preview).'</a></p>'
            .self::signatureHtml();

        $text = "Hi {$name},\n\n"
            ."Thank you for sharing feedback on the sample website for {$biz}.\n\n"
            .$commentText
            ."What would make the sample feel right for you? I am happy to revise before we move forward.\n\n"
            ."If you are still interested, reply with what to change. If timing is not right, just let me know.\n\n"
            ."Preview: {$preview}\n\n"
            .self::signatureText();

        return [$subject, $html, $text];
    }

    private static function signatureHtml(): string
    {
        return '<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
            .'<a href="https://carlmanuel.com">carlmanuel.com</a> · '
            .'<a href="https://www.facebook.com/profile.php?id='.self::FB_PROFILE.'">Facebook</a> · '
            .'info@carlmanuel.com</p>';
    }

    private static function signatureText(): string
    {
        return "Carl Louis Manuel\ncarlmanuel.com · facebook.com/profile.php?id=".self::FB_PROFILE.' · info@carlmanuel.com';
    }
}
