<?php

namespace Tests\Unit;

use App\Services\OutreachEmailBuilder;
use Tests\TestCase;

class OutreachEmailBuilderTest extends TestCase
{
    private const FB_PROFILE = '61557195950694';

    private const PHONE_DISPLAY = '+63 962 538 9886';

    private const PHONE_TEL = '+639625389886';

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
        $this->assertStringContainsString('tel:'.self::PHONE_TEL, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
    }

    public function test_initial_email_leads_with_admin_then_site(): void
    {
        [$subject, $html, $text] = OutreachEmailBuilder::initial($this->sampleJob());

        $this->assertStringContainsString('Business system + website sample', $subject);
        $this->assertStringContainsString('/admin/', $html);
        $this->assertStringContainsString('Start with the admin', $html);
        $this->assertStringContainsString('Then the marketing site', $html);
        $this->assertStringContainsString('Start with the admin', $text);
        $this->assertStringContainsString('Then the marketing site', $text);
    }

    public function test_initial_email_uses_system_label_when_provided(): void
    {
        $job = array_merge($this->sampleJob(), ['system_label' => 'Booking & calendar admin']);
        [$subject, $html, $text] = OutreachEmailBuilder::initial($job);

        $this->assertStringContainsString('Booking & calendar admin + website sample', $subject);
        $this->assertStringContainsString('Booking &amp; calendar admin', $html);
        $this->assertStringContainsString('Booking & calendar admin', $text);
    }

    public function test_initial_email_uses_system_pain_when_provided(): void
    {
        $job = array_merge($this->sampleJob(), [
            'system_label' => 'Booking & calendar admin',
            'system_pain' => 'Stop taking bookings only on Messenger — see the calendar fill in real time.',
        ]);
        [, $html, $text] = OutreachEmailBuilder::initial($job);

        $this->assertStringContainsString('Stop taking bookings only on Messenger', $html);
        $this->assertStringContainsString('Stop taking bookings only on Messenger', $text);
    }

    public function test_followup_email_includes_facebook_in_signature(): void
    {
        [, $html, $text] = OutreachEmailBuilder::followup($this->sampleJob());

        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('Facebook', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
    }

    public function test_initial_email_states_website_only_pricing(): void
    {
        [, $html, $text] = OutreachEmailBuilder::initial($this->sampleJob());

        $this->assertStringContainsString('Investment (website only)', $html);
        $this->assertStringContainsString('Investment (website only)', $text);
        $this->assertStringContainsString('priced separately', strtolower($html));
        $this->assertStringContainsString('priced separately', strtolower($text));
        $this->assertStringContainsString('(website only)', $html);
    }

    public function test_followup_email_states_website_only_pricing(): void
    {
        [, $html, $text] = OutreachEmailBuilder::followup($this->sampleJob());

        $this->assertStringContainsString('website only', strtolower($html));
        $this->assertStringContainsString('website only', strtolower($text));
        $this->assertStringContainsString('priced separately', strtolower($html));
    }

    public function test_initial_email_includes_facebook_contact_line(): void
    {
        [, $html, $text] = OutreachEmailBuilder::initial($this->sampleJob());

        $this->assertStringContainsString('message me on', strtolower($html));
        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('message me on Facebook', $text);
    }

    public function test_followup_email_leads_with_admin(): void
    {
        [$subject, $html] = OutreachEmailBuilder::followup($this->sampleJob());

        $this->assertStringContainsString('admin system', strtolower($subject));
        $this->assertStringContainsString('browse the pages inside the frames', strtolower($html));
        $this->assertStringContainsString('Preview (admin + site)', $html);
    }
}
