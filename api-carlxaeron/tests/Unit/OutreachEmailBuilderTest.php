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

    public function test_initial_email_mentions_site_and_admin_preview(): void
    {
        [$subject, $html, $text] = OutreachEmailBuilder::initial($this->sampleJob());

        $this->assertStringContainsString('admin', strtolower($subject));
        $this->assertStringContainsString('/admin/', $html);
        $this->assertStringContainsString('site and admin', strtolower($html));
        $this->assertStringContainsString('admin', strtolower($text));
    }

    public function test_initial_email_uses_system_label_when_provided(): void
    {
        $job = array_merge($this->sampleJob(), ['system_label' => 'Booking & calendar admin']);
        [, $html, $text] = OutreachEmailBuilder::initial($job);

        $this->assertStringContainsString('Booking &amp; calendar admin', $html);
        $this->assertStringContainsString('Booking & calendar admin', $text);
    }

    public function test_followup_email_includes_facebook_in_signature(): void
    {
        [, $html, $text] = OutreachEmailBuilder::followup($this->sampleJob());

        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('Facebook', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
    }

    public function test_followup_email_mentions_site_and_admin(): void
    {
        [$subject, $html] = OutreachEmailBuilder::followup($this->sampleJob());

        $this->assertStringContainsString('admin', strtolower($subject));
        $this->assertStringContainsString('site and admin', strtolower($html));
    }
}
