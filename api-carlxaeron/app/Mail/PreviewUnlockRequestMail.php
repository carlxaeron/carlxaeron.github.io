<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\Mime\Email;

class PreviewUnlockRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $mailSubject,
        public string $htmlBody,
        public string $textBody,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->mailSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->htmlBody,
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function build(): self
    {
        return $this->withSymfonyMessage(function (Email $message): void {
            $message->text($this->textBody);
        });
    }
}
