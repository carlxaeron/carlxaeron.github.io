<?php

namespace Tests\Unit;

use App\Models\ServiceAgreement;
use App\Services\AgreementEmailBuilder;
use App\Support\OutreachSignature;
use Tests\TestCase;

class AgreementEmailBuilderTest extends TestCase
{
    public function test_sign_request_includes_link_and_signature(): void
    {
        $agreement = new ServiceAgreement([
            'token' => str_repeat('a', 64),
            'business_name' => 'Demo Co',
            'client_name' => 'Jane',
            'client_email' => 'jane@example.com',
            'expires_at' => now()->addDays(14),
        ]);

        [$subject, $html, $text] = AgreementEmailBuilder::signRequest($agreement);

        $this->assertStringContainsString('Demo Co', $subject);
        $this->assertStringContainsString('?sign='.str_repeat('a', 64), $html);
        $this->assertStringContainsString(OutreachSignature::PHONE_DISPLAY, $html);
        $this->assertStringContainsString('?sign='.str_repeat('a', 64), $text);
        $this->assertStringContainsString('Jane', $html);
    }

    public function test_signed_notify_includes_signatory(): void
    {
        $agreement = new ServiceAgreement([
            'token' => str_repeat('b', 64),
            'slug' => 'demo-client',
            'business_name' => 'Demo Co',
            'client_name' => 'Jane',
            'client_email' => 'jane@example.com',
            'filled_html' => '<p>Body</p>',
            'client_signatory_name' => 'Jane Client',
            'client_signatory_title' => 'Owner',
            'client_signed_at' => now(),
            'client_signature_data' => 'data:image/png;base64,abc',
            'status' => 'signed',
        ]);

        [$subject, $html, $text] = AgreementEmailBuilder::signedNotify($agreement);

        $this->assertSame('Signed: Demo Co', $subject);
        $this->assertStringContainsString('Jane Client', $html);
        $this->assertStringContainsString('Owner', $html);
        $this->assertStringContainsString('<p>Body</p>', $html);
        $this->assertStringContainsString('demo-client', $text);
    }
}
