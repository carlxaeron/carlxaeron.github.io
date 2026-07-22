<?php

namespace App\Services;

/**
 * Preview feedback auto-reply view data (Blade under resources/views/emails/preview/).
 */
final class PreviewFeedbackEmailBuilder
{
    /**
     * @param  array<string, mixed>  $ctx
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
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
    public static function render(string $sentiment, array $ctx): array
    {
        return OutreachEmailBuilder::renderPayload(self::build($sentiment, $ctx));
    }

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
     */
    private static function like(array $ctx): array
    {
        $name = (string) ($ctx['contact_name'] ?: 'there');
        $biz = (string) ($ctx['business_name'] ?: 'your business');
        $preview = (string) $ctx['preview_url'];
        $timeline = trim((string) ($ctx['timeline'] ?? ''));
        $payment = OutreachCadence::paymentTerms($ctx);

        $subject = "Thanks for liking the {$biz} preview — ready to move forward?";

        return [
            'subject' => $subject,
            'view' => 'emails.preview.feedback-reply',
            'text' => 'emails.preview.feedback-reply-text',
            'data' => [
                'title' => $subject,
                'preheader' => "Thanks for liking the {$biz} preview",
                'sentiment' => 'like',
                'contactName' => $name,
                'businessName' => $biz,
                'previewUrl' => $preview,
                'timeline' => $timeline,
                'paymentTerms' => $payment,
                'comment' => '',
                'showFacebookContact' => true,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
     */
    private static function agree(array $ctx): array
    {
        $name = (string) ($ctx['contact_name'] ?: 'there');
        $biz = (string) ($ctx['business_name'] ?: 'your business');
        $preview = (string) $ctx['preview_url'];

        $subject = "Thanks — I'll follow up on {$biz}";

        return [
            'subject' => $subject,
            'view' => 'emails.preview.feedback-reply',
            'text' => 'emails.preview.feedback-reply-text',
            'data' => [
                'title' => $subject,
                'preheader' => "Thanks — I'll follow up on {$biz}",
                'sentiment' => 'agree',
                'contactName' => $name,
                'businessName' => $biz,
                'previewUrl' => $preview,
                'timeline' => '',
                'paymentTerms' => '',
                'comment' => '',
                'showFacebookContact' => true,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $ctx
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
     */
    private static function dislike(array $ctx): array
    {
        $name = (string) ($ctx['contact_name'] ?: 'there');
        $biz = (string) ($ctx['business_name'] ?: 'your business');
        $preview = (string) $ctx['preview_url'];
        $comment = trim((string) ($ctx['comment'] ?? ''));

        $subject = "Thanks for your feedback on {$biz} — how can we improve?";

        return [
            'subject' => $subject,
            'view' => 'emails.preview.feedback-reply',
            'text' => 'emails.preview.feedback-reply-text',
            'data' => [
                'title' => $subject,
                'preheader' => "Thanks for your feedback on {$biz}",
                'sentiment' => 'dislike',
                'contactName' => $name,
                'businessName' => $biz,
                'previewUrl' => $preview,
                'timeline' => '',
                'paymentTerms' => '',
                'comment' => $comment,
                'showFacebookContact' => true,
            ],
        ];
    }
}
