<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationReceived extends Mailable
{
    use Queueable, SerializesModels;

    /** @param array{name:string,company:string,email:string,phone:string,projectType:string,budgetRange:string,currency:?string,timeline:string,services:list<string>,details:string} $quote */
    public function __construct(public array $quote) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New portfolio quote request',
            replyTo: [new Address($this->quote['email'], $this->quote['name'])],
        );
    }

    public function content(): Content
    {
        $q = $this->quote;
        $services = $q['services'] !== [] ? implode(', ', $q['services']) : '—';

        $html = '<h2>New portfolio quote request</h2>'
            . '<p><strong>Name:</strong> ' . e($q['name']) . '</p>'
            . '<p><strong>Company:</strong> ' . e($q['company'] ?: '—') . '</p>'
            . '<p><strong>Email:</strong> ' . e($q['email']) . '</p>'
            . '<p><strong>Phone:</strong> ' . e($q['phone'] ?: '—') . '</p>'
            . '<p><strong>Project type:</strong> ' . e($q['projectType'] ?: '—') . '</p>'
            . '<p><strong>Services:</strong> ' . e($services) . '</p>'
            . '<p><strong>Currency:</strong> ' . e($q['currency'] ?: '—') . '</p>'
            . '<p><strong>Budget:</strong> ' . e($q['budgetRange'] ?: '—') . '</p>'
            . '<p><strong>Timeline:</strong> ' . e($q['timeline'] ?: '—') . '</p>'
            . '<p><strong>Project details:</strong></p><p>' . nl2br(e($q['details'])) . '</p>';

        return new Content(htmlString: $html);
    }
}
