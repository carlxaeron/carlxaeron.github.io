<?php

namespace App\Services;

use App\Mail\AgreementSignRequestMail;
use App\Mail\AgreementSignedMail;
use App\Models\ServiceAgreement;
use Illuminate\Support\Facades\Mail;
use Throwable;

final class AgreementMailer
{
    /**
     * @return array{ok:bool,error?:string}
     */
    public function sendSignRequest(ServiceAgreement $agreement): array
    {
        $payload = AgreementEmailBuilder::signRequest($agreement);

        try {
            $bccList = $this->bccRecipients();
            $mail = Mail::to($agreement->client_email);
            if ($bccList !== []) {
                $mail->bcc($bccList);
            }
            $mail->send(new AgreementSignRequestMail($payload));

            return ['ok' => true];
        } catch (Throwable $e) {
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Notify admin inbox that the client signed.
     *
     * @return array{ok:bool,error?:string}
     */
    public function sendSignedNotification(ServiceAgreement $agreement): array
    {
        [$subject, $html, $text] = AgreementEmailBuilder::signedNotify($agreement);
        $to = $this->adminRecipients();
        if ($to === []) {
            return ['ok' => false, 'error' => 'No mail recipients configured'];
        }

        try {
            $bccList = $this->bccRecipients();
            // Avoid duplicate when MAIL_TO and MAIL_BCC both include info@
            $bccList = array_values(array_filter(
                $bccList,
                static fn (string $addr): bool => ! in_array($addr, $to, true),
            ));

            $mail = Mail::to($to);
            if ($bccList !== []) {
                $mail->bcc($bccList);
            }
            $mail->send(new AgreementSignedMail(
                $subject,
                $html,
                $text,
                $agreement->client_email,
                $agreement->client_name,
            ));

            return ['ok' => true];
        } catch (Throwable $e) {
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /** @return list<string> */
    private function adminRecipients(): array
    {
        $raw = (string) config('portfolio.mail_to', 'info@carlmanuel.com');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }

    /** @return list<string> */
    private function bccRecipients(): array
    {
        $raw = (string) config('portfolio.mail_bcc', 'info@carlmanuel.com');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }
}
