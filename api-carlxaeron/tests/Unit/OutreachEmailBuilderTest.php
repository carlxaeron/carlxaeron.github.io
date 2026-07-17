<?php

namespace Tests\Unit;

use App\Services\OutreachEmailBuilder;
use Tests\TestCase;

class OutreachEmailBuilderTest extends TestCase
{
    private const FB_PROFILE = '61557195950694';

    /** @return array<string, mixed> */
    private function sampleJob(): array
    {
        return [
            'contact_name' => 'Test',
            'business_name' => 'Demo Biz',
            'preview_url' => 'https://carlmanuel.com/?preview=demo',
            'package_name' => 'Starter Business Website',
            'quoted_amount' => '₱15,000',
            'payment_terms' => '',
            'timeline' => '5–7 days',
            'follow_up_count' => 0,
        ];
    }

    public function test_initial_email_includes_facebook_in_signature(): void
    {
        [, $html, $text] = OutreachEmailBuilder::initial($this->sampleJob());

        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('Facebook', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
    }

    public function test_followup_email_includes_facebook_in_signature(): void
    {
        [, $html, $text] = OutreachEmailBuilder::followup($this->sampleJob());

        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('Facebook', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
    }
}
