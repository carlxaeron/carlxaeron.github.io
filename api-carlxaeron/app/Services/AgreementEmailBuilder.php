<?php

namespace App\Services;

use App\Models\ServiceAgreement;

/**
 * Agreement email view data (sign-request uses Blade; signed-notify stays htmlString for admin).
 */
final class AgreementEmailBuilder
{
    /**
     * @return array{subject:string,view:string,text:string,data:array<string,mixed>}
     */
    public static function signRequest(ServiceAgreement $agreement): array
    {
        $biz = $agreement->business_name;
        $name = trim($agreement->client_name) !== '' ? $agreement->client_name : 'there';
        $url = $agreement->signUrl();
        $expires = $agreement->expires_at?->timezone('Asia/Manila')->format('F j, Y') ?? 'in 14 days';

        $subject = "Please review & sign — {$biz} service agreement";

        return [
            'subject' => $subject,
            'view' => 'emails.agreement.sign-request',
            'text' => 'emails.agreement.sign-request-text',
            'data' => [
                'title' => $subject,
                'preheader' => "Service agreement for {$biz} — review and sign",
                'contactName' => $name,
                'businessName' => $biz,
                'signUrl' => $url,
                'expiresLabel' => $expires,
                'showFacebookContact' => true,
            ],
        ];
    }

    /**
     * @return array{0:string,1:string,2:string} subject, html, text
     */
    public static function renderSignRequest(ServiceAgreement $agreement): array
    {
        return OutreachEmailBuilder::renderPayload(self::signRequest($agreement));
    }

    /**
     * Admin notify — still returns htmlString bodies (embedded agreement HTML).
     *
     * @return array{0:string,1:string,2:string} subject, html, text
     */
    public static function signedNotify(ServiceAgreement $agreement): array
    {
        $biz = $agreement->business_name;
        $signatory = (string) $agreement->client_signatory_name;
        $title = (string) ($agreement->client_signatory_title ?? '');
        $when = $agreement->client_signed_at?->timezone('Asia/Manila')->format('Y-m-d H:i:s T') ?? '';
        $adminUrl = 'https://carlmanuel.com/#admin';

        $subject = "Signed: {$biz}";

        $html = '<h2>Agreement signed</h2>'
            .'<p><strong>Business:</strong> '.e($biz).'</p>'
            .'<p><strong>Client:</strong> '.e($agreement->client_name)
            .' &lt;'.e($agreement->client_email).'&gt;</p>'
            .'<p><strong>Signatory:</strong> '.e($signatory)
            .($title !== '' ? ' ('.e($title).')' : '')
            .'</p>'
            .'<p><strong>Signed at:</strong> '.e($when).'</p>'
            .'<p><strong>Slug:</strong> '.e($agreement->slug).'</p>'
            .'<p><a href="'.e($adminUrl).'">Open Admin</a></p>'
            .'<hr>'
            .'<div style="border:1px solid #ddd;padding:12px;max-width:800px;">'
            .$agreement->filled_html
            .'<p><strong>Client signature</strong></p>'
            .($agreement->client_signature_data
                ? '<p><img src="'.e($agreement->client_signature_data).'" alt="Signature" style="max-width:320px;height:auto;border:1px solid #ccc;"></p>'
                : '<p>'.e($signatory).'</p>')
            .'</div>';

        $text = "Agreement signed\n\n"
            ."Business: {$biz}\n"
            ."Client: {$agreement->client_name} <{$agreement->client_email}>\n"
            ."Signatory: {$signatory}".($title !== '' ? " ({$title})" : '')."\n"
            ."Signed at: {$when}\n"
            ."Slug: {$agreement->slug}\n"
            ."Admin: {$adminUrl}\n";

        return [$subject, $html, $text];
    }
}
