<?php

namespace App\Services;

use App\Mail\OutreachProspectMail;
use Illuminate\Support\Facades\Mail;
use Throwable;

final class OutreachMailer
{
    /**
     * @param  array<string, mixed>  $job
     * @param  list<array{filename:string,mime:string,content:string}>  $attachments
     * @return array{ok:bool,error?:string}
     */
    public function sendToProspect(array $job, string $kind, array $attachments = []): array
    {
        $to = (string) $job['contact_email'];
        $payload = $kind === 'initial'
            ? OutreachEmailBuilder::initial($job)
            : OutreachEmailBuilder::followup($job);

        return $this->sendProspectPayload($to, $payload, $attachments);
    }

    /**
     * @param  array{subject:string,view:string,text:string,data:array<string,mixed>}  $payload
     * @param  list<array{filename:string,mime:string,content:string}>  $attachments
     * @return array{ok:bool,error?:string}
     */
    public function sendProspectPayload(string $to, array $payload, array $attachments = []): array
    {
        try {
            $bccList = $this->bccRecipients();
            $mail = Mail::to($to);
            if ($bccList !== []) {
                $mail->bcc($bccList);
            }
            $mail->send(new OutreachProspectMail($payload, $attachments));

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
