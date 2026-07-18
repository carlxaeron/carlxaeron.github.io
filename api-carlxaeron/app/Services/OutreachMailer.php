<?php

namespace App\Services;

use App\Mail\OutreachProspectMail;
use Illuminate\Support\Facades\Mail;
use Throwable;

final class OutreachMailer
{
    /**
     * @param  array<string, mixed>  $job
     * @return array{ok:bool,error?:string}
     */
    public function sendToProspect(array $job, string $kind): array
    {
        $to = (string) $job['contact_email'];
        if ($kind === 'initial') {
            [$subject, $html, $text] = OutreachEmailBuilder::initial($job);
        } else {
            [$subject, $html, $text] = OutreachEmailBuilder::followup($job);
        }

        return $this->sendProspectMessage($to, $subject, $html, $text);
    }

    /**
     * @return array{ok:bool,error?:string}
     */
    public function sendProspectMessage(string $to, string $subject, string $html, string $text): array
    {
        try {
            $bccList = $this->bccRecipients();
            $mail = Mail::to($to);
            if ($bccList !== []) {
                $mail->bcc($bccList);
            }
            $mail->send(new OutreachProspectMail($subject, $html, $text));

            return ['ok' => true];
        } catch (Throwable $e) {
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /** @return list<string> */
    private function bccRecipients(): array
    {
        $raw = (string) config('portfolio.mail_bcc', 'info@carlmanuel.com');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }
}
