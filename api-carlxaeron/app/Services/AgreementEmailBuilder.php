<?php

namespace App\Services;

use App\Models\ServiceAgreement;
use App\Support\OutreachSignature;

/**
 * Builds agreement sign-request and signed-notification email bodies.
 */
final class AgreementEmailBuilder
{
    /**
     * @return array{0:string,1:string,2:string} subject, html, text
     */
    public static function signRequest(ServiceAgreement $agreement): array
    {
        $biz = $agreement->business_name;
        $name = trim($agreement->client_name) !== '' ? $agreement->client_name : 'there';
        $url = $agreement->signUrl();
        $expires = $agreement->expires_at?->timezone('Asia/Manila')->format('F j, Y') ?? 'in 14 days';

        $subject = "Please review & sign — {$biz} service agreement";

        $html = '<p>Hi '.e($name).',</p>'
            .'<p>I prepared a <strong>service agreement</strong> for <strong>'.e($biz).'</strong>. '
            .'Please review it online and sign when you are ready.</p>'
            .'<p><a href="'.e($url).'" style="display:inline-block;padding:10px 16px;background:#00A862;color:#fff;'
            .'text-decoration:none;border-radius:4px;font-weight:600;">Review &amp; sign agreement</a></p>'
            .'<p>Or open this link:<br><a href="'.e($url).'">'.e($url).'</a></p>'
            .'<p>This link expires on <strong>'.e($expires).'</strong> (Asia/Manila).</p>'
            .OutreachSignature::facebookContactHtml()
            .OutreachSignature::html();

        $text = "Hi {$name},\n\n"
            ."I prepared a service agreement for {$biz}. Please review it online and sign when you are ready.\n\n"
            ."Review & sign: {$url}\n\n"
            ."This link expires on {$expires} (Asia/Manila).\n\n"
            .OutreachSignature::facebookContactText()
            .OutreachSignature::text();

        return [$subject, $html, $text];
    }

    /**
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
