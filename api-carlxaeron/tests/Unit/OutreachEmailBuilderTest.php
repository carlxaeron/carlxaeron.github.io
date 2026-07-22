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
        [, $html, $text] = OutreachEmailBuilder::renderInitial($this->sampleJob());

        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('Facebook', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
        $this->assertStringContainsString('tel:'.self::PHONE_TEL, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
        $this->assertStringContainsString('https://carlmanuel.com/static/images/profile3.jpg', $html);
        $this->assertStringContainsString('alt="Carl Louis Manuel"', $html);
        $this->assertStringNotContainsString('profile3.jpg', $text);
        $this->assertStringContainsString('#00473e', $html);
        $this->assertStringContainsString('#00A862', $html);
    }

    public function test_initial_email_leads_with_admin_then_site(): void
    {
        [$subject, $html, $text] = OutreachEmailBuilder::renderInitial($this->sampleJob());

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
        [$subject, $html, $text] = OutreachEmailBuilder::renderInitial($job);

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
        [, $html, $text] = OutreachEmailBuilder::renderInitial($job);

        $this->assertStringContainsString('Stop taking bookings only on Messenger', $html);
        $this->assertStringContainsString('Stop taking bookings only on Messenger', $text);
    }

    public function test_initial_email_includes_one_time_access_urls_when_present(): void
    {
        $job = array_merge($this->sampleJob(), [
            'site_access_url' => 'https://demo.netlify.app/?access=siteTok',
            'admin_access_url' => 'https://demo.netlify.app/admin/?access=adminTok',
        ]);
        [, $html, $text] = OutreachEmailBuilder::renderInitial($job);

        $this->assertStringContainsString('Open website (one-time)', $html);
        $this->assertStringContainsString('Open admin sample (one-time)', $html);
        $this->assertStringContainsString('siteTok', $html);
        $this->assertStringContainsString('adminTok', $html);
        $this->assertStringContainsString('siteTok', $text);
        $this->assertStringContainsString('adminTok', $text);
        $this->assertStringContainsString('Iframe preview (portfolio)', $html);
        $this->assertStringContainsString('Notify Carl', $html);
        $this->assertStringContainsString('Open website sample (one-time)', $html);
    }

    public function test_initial_email_omits_one_time_block_without_urls(): void
    {
        [, $html] = OutreachEmailBuilder::renderInitial($this->sampleJob());

        $this->assertStringNotContainsString('Open website (one-time)', $html);
        $this->assertStringContainsString('Iframe preview (portfolio)', $html);
    }

    public function test_followup_email_includes_facebook_in_signature(): void
    {
        [, $html, $text] = OutreachEmailBuilder::renderFollowup($this->sampleJob());

        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('Facebook', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
        $this->assertStringContainsString('https://carlmanuel.com/static/images/profile3.jpg', $html);
        $this->assertStringContainsString('alt="Carl Louis Manuel"', $html);
    }

    public function test_initial_email_mentions_screenshots_when_attachments_flagged(): void
    {
        $job = array_merge($this->sampleJob(), ['has_attachments' => true]);
        [, $html, $text] = OutreachEmailBuilder::renderInitial($job);

        $this->assertStringContainsString('Attached:', $html);
        $this->assertStringContainsString('screenshots', strtolower($html));
        $this->assertStringContainsString('admin/system', strtolower($html));
        $this->assertStringContainsString('Attached:', $text);
        $this->assertStringContainsString('screenshots', strtolower($text));
    }

    public function test_initial_email_omits_screenshot_note_without_attachments(): void
    {
        [, $html] = OutreachEmailBuilder::renderInitial($this->sampleJob());

        $this->assertStringNotContainsString('<strong>Attached:</strong>', $html);
    }

    public function test_initial_email_states_website_only_pricing(): void
    {
        [, $html, $text] = OutreachEmailBuilder::renderInitial($this->sampleJob());

        $this->assertStringContainsString('Investment (website only)', $html);
        $this->assertStringContainsString('Investment (website only)', $text);
        $this->assertStringContainsString('priced separately', strtolower($html));
        $this->assertStringContainsString('priced separately', strtolower($text));
        $this->assertStringContainsString('(website only)', $html);
        $this->assertStringContainsString('#D4E9E2', $html);
    }

    public function test_followup_email_states_website_only_pricing(): void
    {
        [, $html, $text] = OutreachEmailBuilder::renderFollowup($this->sampleJob());

        $this->assertStringContainsString('website only', strtolower($html));
        $this->assertStringContainsString('website only', strtolower($text));
        $this->assertStringContainsString('priced separately', strtolower($html));
        $this->assertStringContainsString('A short reply works', $html);
        $this->assertStringNotContainsString('No pressure', $html);
    }

    public function test_initial_email_includes_facebook_contact_line(): void
    {
        [, $html, $text] = OutreachEmailBuilder::renderInitial($this->sampleJob());

        $this->assertStringContainsString('message me on', strtolower($html));
        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString('message me on Facebook', $text);
    }

    public function test_followup_email_leads_with_admin(): void
    {
        [$subject, $html] = OutreachEmailBuilder::renderFollowup($this->sampleJob());

        $this->assertStringContainsString('admin system', strtolower($subject));
        $this->assertStringContainsString('browse the pages inside the frames', strtolower($html));
        $this->assertStringContainsString('Preview (admin + site)', $html);
    }

    public function test_initial_returns_blade_view_payload(): void
    {
        $payload = OutreachEmailBuilder::initial($this->sampleJob());

        $this->assertSame('emails.outreach.initial', $payload['view']);
        $this->assertSame('emails.outreach.initial-text', $payload['text']);
        $this->assertArrayHasKey('contactName', $payload['data']);
        $this->assertSame('Demo Biz', $payload['data']['businessName']);
    }
}
