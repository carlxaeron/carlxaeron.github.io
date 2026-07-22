<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgreementSignRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $mailSubject;

    public string $htmlBody;

    public string $textBody;

    /**
     * @param  array{subject:string,view:string,text:string,data:array<string,mixed>}  $payload
     */
    public function __construct(array $payload)
    {
        $this->mailSubject = $payload['subject'];
        $this->view = $payload['view'];
        $this->textView = $payload['text'];
        $this->viewData = $payload['data'];
        $this->htmlBody = view($this->view, $this->viewData)->render();
        $this->textBody = view($this->textView, $this->viewData)->render();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->mailSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: $this->view,
            text: $this->textView,
            with: $this->viewData,
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
