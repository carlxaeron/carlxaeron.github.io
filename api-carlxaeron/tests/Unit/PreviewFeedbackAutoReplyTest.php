<?php

namespace Tests\Unit;

use App\Mail\OutreachProspectMail;
use App\Models\OutreachJob;
use App\Models\PreviewFeedback;
use App\Services\PreviewFeedbackAutoReply;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PreviewFeedbackAutoReplyTest extends TestCase
{
    use RefreshDatabase;

    public function test_sends_like_auto_reply_using_outreach_job_email(): void
    {
        Mail::fake();
        config(['portfolio.mail_bcc' => 'admin@example.com']);

        OutreachJob::query()->create([
            'slug' => 'jk-construction',
            'business_name' => 'JK Construction',
            'contact_name' => 'Juan',
            'contact_email' => 'juan@jk.test',
            'preview_url' => 'https://carlmanuel.com/?preview=jk-construction',
            'package_name' => 'Starter',
            'quoted_amount' => '₱15,000',
            'timeline' => '5–7 days',
            'cadence' => '3d1w',
            'auto_followup' => true,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
        ]);

        $feedback = PreviewFeedback::query()->create([
            'visitor_id' => 'v-like',
            'session_id' => 's-like',
            'preview_slug' => 'jk-construction',
            'preview_label' => 'JK Construction',
            'sentiment' => 'like',
            'created_at' => now(),
        ]);

        app(PreviewFeedbackAutoReply::class)->maybeSend($feedback);

        Mail::assertSent(OutreachProspectMail::class, function (OutreachProspectMail $mail) {
            return str_contains(strtolower($mail->htmlBody), 'push through')
                && str_contains($mail->htmlBody, 'jk-construction');
        });

        $feedback->refresh();
        $this->assertSame('juan@jk.test', $feedback->prospect_email);
        $this->assertNotNull($feedback->auto_reply_sent_at);
    }

    public function test_skips_when_no_prospect_email(): void
    {
        Mail::fake();

        $feedback = PreviewFeedback::query()->create([
            'visitor_id' => 'v-no-email',
            'session_id' => 's-no-email',
            'preview_slug' => 'unknown-slug',
            'sentiment' => 'like',
            'created_at' => now(),
        ]);

        app(PreviewFeedbackAutoReply::class)->maybeSend($feedback);

        Mail::assertNothingSent();
        $this->assertNull($feedback->fresh()->auto_reply_sent_at);
    }

    public function test_prefers_request_email_over_outreach_job(): void
    {
        Mail::fake();

        OutreachJob::query()->create([
            'slug' => 'demo',
            'business_name' => 'Demo Biz',
            'contact_name' => 'Old',
            'contact_email' => 'old@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=demo',
            'cadence' => '3d1w',
            'auto_followup' => false,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
        ]);

        $feedback = PreviewFeedback::query()->create([
            'visitor_id' => 'v-req',
            'session_id' => 's-req',
            'preview_slug' => 'demo',
            'sentiment' => 'dislike',
            'comment' => 'Too dark',
            'created_at' => now(),
        ]);

        app(PreviewFeedbackAutoReply::class)->maybeSend($feedback, 'new@example.com');

        Mail::assertSent(OutreachProspectMail::class);
        $this->assertSame('new@example.com', $feedback->fresh()->prospect_email);
    }

    public function test_does_not_resend_when_already_sent(): void
    {
        Mail::fake();

        OutreachJob::query()->create([
            'slug' => 'demo',
            'business_name' => 'Demo Biz',
            'contact_name' => 'Jane',
            'contact_email' => 'jane@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=demo',
            'cadence' => '3d1w',
            'auto_followup' => false,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
        ]);

        $feedback = PreviewFeedback::query()->create([
            'visitor_id' => 'v-sent',
            'session_id' => 's-sent',
            'preview_slug' => 'demo',
            'sentiment' => 'like',
            'prospect_email' => 'jane@example.com',
            'auto_reply_sent_at' => now()->subHour(),
            'created_at' => now(),
        ]);

        app(PreviewFeedbackAutoReply::class)->maybeSend($feedback);

        Mail::assertNothingSent();
    }
}
