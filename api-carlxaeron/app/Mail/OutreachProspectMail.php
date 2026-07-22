<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OutreachProspectMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $mailSubject;

    /**
     * Rendered HTML for test assertions (Blade is the source of truth).
     */
    public string $htmlBody;

    public string $textBody;

    /**
     * @param  array{subject:string,view:string,text:string,data:array<string,mixed>}  $payload
     * @param  list<array{filename:string,mime:string,content:string}>  $fileAttachments
     */
    public function __construct(
        array $payload,
        public array $fileAttachments = [],
    ) {
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

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $out = [];
        foreach ($this->fileAttachments as $file) {
            $content = $file['content'];
            $out[] = Attachment::fromData(
                static fn () => $content,
                $file['filename'],
            )->withMime($file['mime']);
        }

        return $out;
    }
}
