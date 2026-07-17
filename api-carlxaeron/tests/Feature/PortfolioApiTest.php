<?php

namespace Tests\Feature;

use App\Mail\ContactReceived;
use App\Models\PreviewFeedback;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $this->postJson('/previewFeedback', $payload)
            ->assertOk()
            ->assertJsonPath('message', 'Feedback recorded');

        $this->postJson('/previewFeedback', $payload)
            ->assertStatus(400)
            ->assertJsonPath('message', 'You already submitted feedback for this preview');

        $this->postJson('/previewFeedback', [
            'visitorId' => 'v2',
            'sessionId' => 's2',
            'previewSlug' => 'jk-construction',
            'sentiment' => 'dislike',
        ])
            ->assertStatus(400)
            ->assertJsonPath('message', 'Comment is required when disliking');
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
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Contact request received');

        $this->assertDatabaseHas('contact', [
            'name' => 'Test',
            'email' => 'test@example.com',
        ]);

        Mail::assertSent(ContactReceived::class);
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
