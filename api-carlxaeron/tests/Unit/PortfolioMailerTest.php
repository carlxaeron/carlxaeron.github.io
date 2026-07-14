<?php

namespace Tests\Unit;

use App\Mail\ContactReceived;
use App\Mail\QuotationReceived;
use App\Services\PortfolioMailer;
use Illuminate\Support\Facades\Mail;
use RuntimeException;
use Tests\TestCase;

class PortfolioMailerTest extends TestCase
{
    public function test_recipients_parse_mail_to_csv(): void
    {
        config(['portfolio.mail_to' => ' a@x.com , , b@y.com ']);

        $this->assertSame(['a@x.com', 'b@y.com'], (new PortfolioMailer)->recipients());
    }

    public function test_send_contact_requires_recipients(): void
    {
        config(['portfolio.mail_to' => '']);
        Mail::fake();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('No mail recipients configured');

        (new PortfolioMailer)->sendContact('N', 'n@e.com', 'hi');
    }

    public function test_send_contact_queues_mailable(): void
    {
        config(['portfolio.mail_to' => 'to@example.com']);
        Mail::fake();

        (new PortfolioMailer)->sendContact('Carl', 'carl@example.com', 'Hello');

        Mail::assertSent(ContactReceived::class, function (ContactReceived $mail) {
            return $mail->senderName === 'Carl'
                && $mail->hasTo('to@example.com');
        });
    }

    public function test_send_quotation_queues_mailable(): void
    {
        config(['portfolio.mail_to' => 'to@example.com']);
        Mail::fake();

        (new PortfolioMailer)->sendQuotation([
            'name' => 'Carl',
            'company' => 'Acme',
            'email' => 'carl@example.com',
            'phone' => '',
            'projectType' => 'web',
            'budgetRange' => '',
            'timeline' => '',
            'services' => ['Site'],
            'details' => 'Build a site',
        ]);

        Mail::assertSent(QuotationReceived::class);
    }

    public function test_try_send_swallows_exceptions(): void
    {
        $mailer = new PortfolioMailer;
        $mailer->trySend(function () {
            throw new RuntimeException('SMTP down');
        }, 'contact');

        $this->assertTrue(true);
    }
}
