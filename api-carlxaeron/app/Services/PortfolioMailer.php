<?php

namespace App\Services;

use App\Mail\ContactReceived;
use App\Mail\PreviewAgreeNotifyMail;
use App\Mail\QuotationReceived;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

final class PortfolioMailer
{
    /** @return list<string> */
    public function recipients(): array
    {
        $raw = (string) config('portfolio.mail_to', '');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }

    /** @return list<string> */
    public function bccRecipients(): array
    {
        $raw = (string) config('portfolio.mail_bcc', 'info@carlmanuel.com');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }

    public function sendContact(string $name, string $email, string $message): void
    {
        $to = $this->recipients();
        if ($to === []) {
            throw new \RuntimeException('No mail recipients configured');
        }

        Mail::to($to)->send(new ContactReceived($name, $email, $message));
    }

    /** @param array{name:string,company:string,email:string,phone:string,projectType:string,budgetRange:string,currency:?string,timeline:string,services:list<string>,details:string} $quote */
    public function sendQuotation(array $quote): void
    {
        $to = $this->recipients();
        if ($to === []) {
            throw new \RuntimeException('No mail recipients configured');
        }

        Mail::to($to)->send(new QuotationReceived($quote));
    }

    /**
     * Carl-facing notice when a prospect taps Ready to proceed on a preview.
     */
    public function sendPreviewAgree(
        string $slug,
        ?string $label,
        string $visitorId,
        ?string $previewUrl = null,
    ): void {
        $to = $this->recipients();
        if ($to === []) {
            throw new \RuntimeException('No mail recipients configured');
        }

        $business = trim((string) ($label ?: $slug));
        $url = trim((string) ($previewUrl ?: "https://carlmanuel.com/?preview={$slug}"));
        $when = now()->toIso8601String();

        $subject = "Ready to proceed — {$business}";
        $html = '<h2>Ready to proceed</h2>'
            .'<p>A prospect confirmed interest in moving forward.</p>'
            .'<p><strong>Business:</strong> '.e($business).'</p>'
            .'<p><strong>Slug:</strong> '.e($slug).'</p>'
            .'<p><strong>Preview:</strong> <a href="'.e($url).'">'.e($url).'</a></p>'
            .'<p><strong>Visitor ID:</strong> '.e($visitorId).'</p>'
            .'<p><strong>Time:</strong> '.e($when).'</p>'
            .'<p>Generate and send a service agreement from Admin → Clients when you are ready.</p>';

        $text = "Ready to proceed\n\n"
            ."Business: {$business}\n"
            ."Slug: {$slug}\n"
            ."Preview: {$url}\n"
            ."Visitor ID: {$visitorId}\n"
            ."Time: {$when}\n\n"
            ."Generate and send a service agreement from Admin → Clients when you are ready.\n";

        $bccList = array_values(array_filter(
            $this->bccRecipients(),
            static fn (string $addr): bool => ! in_array($addr, $to, true),
        ));

        $mail = Mail::to($to);
        if ($bccList !== []) {
            $mail->bcc($bccList);
        }
        $mail->send(new PreviewAgreeNotifyMail($subject, $html, $text));
    }

    public function trySend(callable $send, string $context): void
    {
        try {
            $send();
        } catch (Throwable $e) {
            Log::warning("{$context} SMTP failed: ".$e->getMessage());
        }
    }
}
