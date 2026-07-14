<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $bodyMessage,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Portfolio contact from {$this->senderName}",
            replyTo: [new Address($this->senderEmail, $this->senderName)],
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '<h2>New portfolio contact message</h2>'
                . '<p><strong>Name:</strong> ' . e($this->senderName) . '</p>'
                . '<p><strong>Email:</strong> ' . e($this->senderEmail) . '</p>'
                . '<p><strong>Message:</strong></p><p>' . nl2br(e($this->bodyMessage)) . '</p>',
        );
    }
}
