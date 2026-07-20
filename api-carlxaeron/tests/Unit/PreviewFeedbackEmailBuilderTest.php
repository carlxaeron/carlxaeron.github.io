<?php

namespace Tests\Unit;

use App\Services\PreviewFeedbackEmailBuilder;
use Tests\TestCase;

class PreviewFeedbackEmailBuilderTest extends TestCase
{
    private const FB_PROFILE = '61557195950694';

    private const PHONE_DISPLAY = '+63 962 538 9886';

    /** @return array<string, mixed> */
    private function sampleContext(): array
    {
        return [
            'contact_name' => 'Maria',
            'business_name' => 'JK Construction',
            'preview_url' => 'https://carlmanuel.com/?preview=jk-construction',
            'timeline' => '5–7 days',
            'payment_terms' => '',
            'comment' => 'Needs clearer CTA',
        ];
    }

    public function test_like_email_asks_to_push_through_with_preview_link(): void
    {
        [$subject, $html, $text] = PreviewFeedbackEmailBuilder::build('like', $this->sampleContext());

        $this->assertStringContainsString('JK Construction', $subject);
        $this->assertStringContainsString('push through', strtolower($html));
        $this->assertStringContainsString('https://carlmanuel.com/?preview=jk-construction', $html);
        $this->assertStringContainsString('50% upfront', $html);
        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
        $this->assertStringContainsString('push through', strtolower($text));
        $this->assertStringContainsString('admin system', strtolower($html));
        $this->assertStringContainsString('admin system', strtolower($text));
    }

    public function test_dislike_email_references_comment_and_invites_revision(): void
    {
        [$subject, $html, $text] = PreviewFeedbackEmailBuilder::build('dislike', $this->sampleContext());

        $this->assertStringContainsString('feedback', strtolower($subject));
        $this->assertStringContainsString('Needs clearer CTA', $html);
        $this->assertStringContainsString('revise', strtolower($html));
        $this->assertStringContainsString('Needs clearer CTA', $text);
        $this->assertStringContainsString(self::FB_PROFILE, $text);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
    }

    public function test_agree_email_thanks_and_promises_follow_up(): void
    {
        [$subject, $html, $text] = PreviewFeedbackEmailBuilder::build('agree', $this->sampleContext());

        $this->assertStringContainsString('follow up', strtolower($subject));
        $this->assertStringContainsString('JK Construction', $subject);
        $this->assertStringContainsString('follow up shortly', strtolower($html));
        $this->assertStringContainsString('website only', strtolower($html));
        $this->assertStringContainsString('https://carlmanuel.com/?preview=jk-construction', $html);
        $this->assertStringContainsString('follow up shortly', strtolower($text));
        $this->assertStringContainsString(self::FB_PROFILE, $html);
        $this->assertStringContainsString(self::PHONE_DISPLAY, $text);
    }
}
