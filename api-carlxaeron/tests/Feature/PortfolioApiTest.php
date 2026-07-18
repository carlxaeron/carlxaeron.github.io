<?php

namespace Tests\Feature;

use App\Mail\ContactReceived;
use App\Mail\OutreachProspectMail;
use App\Models\OutreachJob;
use App\Models\PreviewFeedback;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_health(): void
    {
        $this->getJson('/health')
            ->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.ok', true)
            ->assertJsonPath('data.service', 'api-carlxaeron');
    }

    public function test_track_visit_requires_fields(): void
    {
        $this->postJson('/trackVisit', [])
            ->assertStatus(400)
            ->assertJsonPath('status', 400)
            ->assertJsonPath('message', 'Missing required fields');
    }

    public function test_track_visit_records(): void
    {
        $this->postJson('/trackVisit', [
            'visitorId' => 'v1',
            'sessionId' => 's1',
            'eventType' => 'preview_view',
            'previewSlug' => 'demo',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Visit recorded');

        $this->assertDatabaseHas('visits', [
            'visitor_id' => 'v1',
            'session_id' => 's1',
            'event_type' => 'preview_view',
            'preview_slug' => 'demo',
        ]);
    }

    public function test_track_visit_preview_view_triggers_admin_push_once_per_session(): void
    {
        Cache::flush();

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'Client preview viewed',
                    'jk-construction',
                    [
                        'type' => 'preview_view',
                        'slug' => 'jk-construction',
                        'url' => 'https://carlmanuel.com/#admin',
                    ]
                )
                ->andReturn(1);
        });

        $payload = [
            'visitorId' => 'v-push',
            'sessionId' => 's-push',
            'eventType' => 'preview_view',
            'previewSlug' => 'jk-construction',
        ];

        $headers = ['Origin' => 'https://carlmanuel.com'];

        $this->postJson('/trackVisit', $payload, $headers)->assertOk();
        $this->postJson('/trackVisit', $payload, $headers)->assertOk();
    }

    public function test_track_visit_preview_view_skips_push_without_browser_origin(): void
    {
        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldNotReceive('sendToAdmins');
        });

        $this->postJson('/trackVisit', [
            'visitorId' => 'v2',
            'sessionId' => 's2',
            'eventType' => 'preview_view',
            'previewSlug' => 'jk-construction',
        ])->assertOk();
    }

    public function test_track_visit_skips_excluded_visitor(): void
    {
        config(['portfolio.analytics_exclude_visitor_ids' => 'excluded-visitor']);

        $this->postJson('/trackVisit', [
            'visitorId' => 'excluded-visitor',
            'sessionId' => 's1',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Visit skipped (excluded)');

        $this->assertDatabaseCount('visits', 0);
    }

    public function test_preview_feedback_validation_and_dedupe(): void
    {
        $payload = [
            'visitorId' => 'v1',
            'sessionId' => 's1',
            'previewSlug' => 'jk-construction',
            'sentiment' => 'like',
        ];

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'Preview liked',
                    'jk-construction — thumbs up',
                    [
                        'type' => 'preview_feedback',
                        'slug' => 'jk-construction',
                        'sentiment' => 'like',
                        'url' => 'https://carlmanuel.com/#admin',
                    ]
                )
                ->andReturn(1);
        });

        $this->postJson('/previewFeedback', $payload, ['Origin' => 'https://carlmanuel.com'])
            ->assertOk()
            ->assertJsonPath('message', 'Feedback recorded');

        $this->postJson('/previewFeedback', $payload, ['Origin' => 'https://carlmanuel.com'])
            ->assertStatus(400)
            ->assertJsonPath('message', 'You already submitted feedback for this preview');

        $this->postJson('/previewFeedback', [
            'visitorId' => 'v2',
            'sessionId' => 's2',
            'previewSlug' => 'jk-construction',
            'sentiment' => 'dislike',
        ], ['Origin' => 'https://carlmanuel.com'])
            ->assertStatus(400)
            ->assertJsonPath('message', 'Comment is required when disliking');
    }

    public function test_preview_feedback_like_sends_auto_reply_when_outreach_email_exists(): void
    {
        Mail::fake();
        config(['portfolio.mail_bcc' => 'admin@example.com']);

        OutreachJob::query()->create([
            'slug' => 'jk-construction',
            'business_name' => 'JK Construction',
            'contact_name' => 'Juan',
            'contact_email' => 'juan@jk.test',
            'preview_url' => 'https://carlmanuel.com/?preview=jk-construction',
            'cadence' => '3d1w',
            'auto_followup' => true,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
        ]);

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')->once()->andReturn(1);
        });

        $this->postJson('/previewFeedback', [
            'visitorId' => 'v-auto-like',
            'sessionId' => 's-auto-like',
            'previewSlug' => 'jk-construction',
            'previewLabel' => 'JK Construction',
            'sentiment' => 'like',
        ], ['Origin' => 'https://carlmanuel.com'])
            ->assertOk();

        Mail::assertSent(OutreachProspectMail::class, function (OutreachProspectMail $mail) {
            return str_contains(strtolower($mail->htmlBody), 'thanks for the thumbs up');
        });

        $this->assertDatabaseHas('preview_feedback', [
            'visitor_id' => 'v-auto-like',
            'preview_slug' => 'jk-construction',
            'prospect_email' => 'juan@jk.test',
        ]);

        $row = PreviewFeedback::query()->where('visitor_id', 'v-auto-like')->first();
        $this->assertNotNull($row?->auto_reply_sent_at);
    }

    public function test_preview_feedback_dislike_sends_different_auto_reply(): void
    {
        Mail::fake();

        OutreachJob::query()->create([
            'slug' => 'jk-construction',
            'business_name' => 'JK Construction',
            'contact_name' => 'Juan',
            'contact_email' => 'juan@jk.test',
            'preview_url' => 'https://carlmanuel.com/?preview=jk-construction',
            'cadence' => '3d1w',
            'auto_followup' => false,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
        ]);

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')->once()->andReturn(1);
        });

        $this->postJson('/previewFeedback', [
            'visitorId' => 'v-auto-dislike',
            'sessionId' => 's-auto-dislike',
            'previewSlug' => 'jk-construction',
            'previewLabel' => 'JK Construction',
            'sentiment' => 'dislike',
            'comment' => 'Needs clearer CTA',
        ], ['Origin' => 'https://carlmanuel.com'])
            ->assertOk();

        Mail::assertSent(OutreachProspectMail::class, function (OutreachProspectMail $mail) {
            return str_contains(strtolower($mail->htmlBody), 'honest feedback')
                && str_contains($mail->htmlBody, 'Needs clearer CTA');
        });
    }

    public function test_preview_feedback_dislike_triggers_admin_push(): void
    {
        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'Preview disliked',
                    'JK Construction — Needs clearer CTA',
                    [
                        'type' => 'preview_feedback',
                        'slug' => 'jk-construction',
                        'sentiment' => 'dislike',
                        'url' => 'https://carlmanuel.com/#admin',
                    ]
                )
                ->andReturn(1);
        });

        $this->postJson('/previewFeedback', [
            'visitorId' => 'v3',
            'sessionId' => 's3',
            'previewSlug' => 'jk-construction',
            'previewLabel' => 'JK Construction',
            'sentiment' => 'dislike',
            'comment' => 'Needs clearer CTA',
        ], ['Origin' => 'https://carlmanuel.com'])
            ->assertOk();
    }

    public function test_contact_persists_and_sends_mail(): void
    {
        config(['portfolio.mail_to' => 'inbox@example.com']);
        Mail::fake();

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'New contact message',
                    'Test — test@example.com',
                    ['type' => 'contact', 'url' => 'https://carlmanuel.com/#admin']
                )
                ->andReturn(0);
        });

        $this->postJson('/contact', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'message' => 'Hello',
            'website' => '',
            'formOpenedAt' => time() - 5,
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Contact request received');

        $this->assertDatabaseHas('contact', [
            'name' => 'Test',
            'email' => 'test@example.com',
        ]);

        Mail::assertSent(ContactReceived::class);
    }

    public function test_contact_honeypot_silently_succeeds_without_persisting(): void
    {
        Mail::fake();

        $this->postJson('/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Spam',
            'website' => 'http://evil.test',
            'formOpenedAt' => time() - 5,
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Contact request received');

        $this->assertDatabaseCount('contact', 0);
        Mail::assertNothingSent();
    }

    public function test_contact_too_fast_silently_succeeds_without_persisting(): void
    {
        Mail::fake();

        $this->postJson('/contact', [
            'name' => 'Speedy',
            'email' => 'fast@example.com',
            'message' => 'Hi',
            'website' => '',
            'formOpenedAt' => time(),
        ])
            ->assertOk();

        $this->assertDatabaseCount('contact', 0);
        Mail::assertNothingSent();
    }

    public function test_quotation_persists(): void
    {
        Mail::fake();

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'New quote request',
                    'Ada (Ada Co)',
                    ['type' => 'quotation', 'url' => 'https://carlmanuel.com/#admin']
                )
                ->andReturn(0);
        });

        $this->postJson('/quotation', [
            'name' => 'Ada',
            'email' => 'ada@example.com',
            'details' => 'Need a site',
            'company' => 'Ada Co',
            'services' => ['Landing page', 'SEO'],
            'website' => '',
            'formOpenedAt' => time() - 5,
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Quote request received');

        $this->assertDatabaseHas('quotations', [
            'name' => 'Ada',
            'email' => 'ada@example.com',
            'company' => 'Ada Co',
        ]);
    }

    public function test_quotation_persists_currency(): void
    {
        Mail::fake();

        $this->mock(\App\Services\PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')->once()->andReturn(0);
        });

        $this->postJson('/quotation', [
            'name' => 'Ben',
            'email' => 'ben@example.com',
            'details' => 'Need an app',
            'currency' => 'USD',
            'budgetRange' => '$3k–$10k',
            'website' => '',
            'formOpenedAt' => time() - 5,
        ])
            ->assertOk();

        $this->assertDatabaseHas('quotations', [
            'email' => 'ben@example.com',
            'currency' => 'USD',
            'budget_range' => '$3k–$10k',
        ]);

        Mail::assertSent(\App\Mail\QuotationReceived::class, function (\App\Mail\QuotationReceived $mail) {
            return $mail->quote['currency'] === 'USD'
                && $mail->quote['budgetRange'] === '$3k–$10k';
        });
    }

    public function test_analytics_summary_shape_and_counts(): void
    {
        Visit::query()->create([
            'visitor_id' => 'v1',
            'session_id' => 's1',
            'event_type' => 'preview_view',
            'preview_slug' => 'jk-construction',
            'created_at' => now(),
        ]);
        PreviewFeedback::query()->create([
            'visitor_id' => 'v1',
            'session_id' => 's1',
            'preview_slug' => 'jk-construction',
            'sentiment' => 'like',
            'created_at' => now(),
        ]);

        $this->getJson('/analyticsSummary')
            ->assertOk()
            ->assertJsonPath('data.totalPreviewViews', 1)
            ->assertJsonPath('data.totalLikes', 1)
            ->assertJsonPath('data.previewStats.0.slug', 'jk****on')
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'clientSites',
                    'totalPreviewViews',
                    'uniquePreviewVisitorsWeek',
                    'totalLikes',
                    'totalDislikes',
                    'visitsByDay',
                    'previewStats',
                    'generatedAt',
                ],
            ]);
    }
}
