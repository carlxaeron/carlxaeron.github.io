<?php

namespace Tests\Feature;

use App\Models\OutreachJob;
use App\Models\PreviewFeedback;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private const ADMIN_EMAIL = 'admin@example.com';

    private const ADMIN_PASSWORD = 'secret-password';

    protected function setUp(): void
    {
        parent::setUp();

        User::query()->create([
            'name' => 'Admin',
            'email' => self::ADMIN_EMAIL,
            'password' => Hash::make(self::ADMIN_PASSWORD),
        ]);
    }

    public function test_analytics_requires_auth(): void
    {
        $this->getJson('/admin/analytics')
            ->assertUnauthorized();
    }

    public function test_analytics_returns_detailed_metrics(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        Visit::query()->create([
            'visitor_id' => 'v1',
            'session_id' => 's1',
            'event_type' => 'preview_view',
            'section' => null,
            'preview_slug' => 'jk-construction',
            'path' => '/?preview=jk-construction',
            'referrer' => 'https://facebook.com/',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'device' => 'Desktop',
            'ip_hash' => 'abcd1234efgh5678',
            'created_at' => now()->subDay(),
        ]);

        Visit::query()->create([
            'visitor_id' => 'v2-long-visitor-id-xyz',
            'session_id' => 's2',
            'event_type' => 'section_view',
            'section' => 'projects',
            'preview_slug' => null,
            'path' => '/#projects',
            'referrer' => '',
            'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'device' => 'Mobile',
            'ip_hash' => 'efgh',
            'created_at' => now()->subHours(2),
        ]);

        PreviewFeedback::query()->create([
            'visitor_id' => 'v1',
            'session_id' => 's1',
            'preview_slug' => 'jk-construction',
            'preview_label' => 'JK Construction',
            'sentiment' => 'agree',
            'comment' => null,
            'ip_hash' => 'abcd',
            'created_at' => now()->subHour(),
        ]);

        PreviewFeedback::query()->create([
            'visitor_id' => 'v3',
            'session_id' => 's3',
            'preview_slug' => 'jk-construction',
            'preview_label' => 'JK Construction',
            'sentiment' => 'like',
            'comment' => 'Looks great',
            'ip_hash' => 'ijkl',
            'created_at' => now()->subMinutes(30),
        ]);

        OutreachJob::query()->create([
            'slug' => 'jk-construction',
            'business_name' => 'JK Construction',
            'contact_name' => 'Client',
            'contact_email' => 'client@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=jk-construction',
            'auto_followup' => true,
            'status' => 'active',
            'follow_up_count' => 1,
            'initial_sent_at' => now()->subDays(5),
            'next_follow_up_at' => now()->addDays(2),
        ]);

        $this->getJson('/admin/analytics?days=30')
            ->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.rangeDays', 30)
            ->assertJsonPath('data.previewViews', 1)
            ->assertJsonPath('data.sectionViews', 1)
            ->assertJsonPath('data.totalAgrees', 1)
            ->assertJsonPath('data.totalLikes', 1)
            ->assertJsonPath('data.agreesInRange', 1)
            ->assertJsonPath('data.outreachFunnel.total', 1)
            ->assertJsonPath('data.outreachFunnel.withInitialSent', 1)
            ->assertJsonStructure([
                'data' => [
                    'visitsByDay',
                    'topSections',
                    'topPreviews',
                    'devices',
                    'previewStats',
                    'recentFeedback',
                    'outreachFunnel' => [
                        'total',
                        'byStatus',
                        'autoFollowUp',
                        'withInitialSent',
                        'totalFollowUpsSent',
                    ],
                    'generatedAt',
                ],
            ]);

        $previews = collect($this->getJson('/admin/analytics?days=7')->json('data.topPreviews'));
        $this->assertTrue(
            $previews->contains(fn ($row) => ($row['label'] ?? '') === 'jk-construction'),
            'Admin analytics keeps raw preview slugs'
        );
    }

    public function test_analytics_rejects_invalid_days_with_default(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->getJson('/admin/analytics?days=999')
            ->assertOk()
            ->assertJsonPath('data.rangeDays', 30);
    }

    public function test_analytics_visits_returns_detail_rows_with_hashed_ip_only(): void
    {
        Visit::query()->create([
            'visitor_id' => 'visitor-aaaaaaaa',
            'session_id' => 's1',
            'event_type' => 'preview_view',
            'section' => null,
            'preview_slug' => 'jk-construction',
            'path' => '/?preview=jk-construction',
            'referrer' => 'https://facebook.com/page',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'language' => 'en-US',
            'device' => 'Desktop',
            'ip_hash' => 'deadbeefcafebabe',
            'created_at' => now()->subHour(),
        ]);

        Visit::query()->create([
            'visitor_id' => 'visitor-bbbbbbbb',
            'session_id' => 's2',
            'event_type' => 'section_view',
            'section' => 'about',
            'preview_slug' => null,
            'path' => '/#about',
            'referrer' => null,
            'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
            'device' => 'Mobile',
            'ip_hash' => '1111222233334444',
            'created_at' => now()->subMinutes(10),
        ]);

        $this->getJson('/admin/analytics/visits')
            ->assertUnauthorized();

        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->getJson('/admin/analytics/visits?days=30&perPage=10')
            ->assertOk()
            ->assertJsonPath('data.pagination.total', 2)
            ->assertJsonPath('data.ipPrivacy', 'hashed')
            ->assertJsonPath('data.items.0.eventType', 'section_view')
            ->assertJsonPath('data.items.0.browser', 'Safari')
            ->assertJsonPath('data.items.0.os', 'iOS')
            ->assertJsonPath('data.items.0.device', 'Mobile')
            ->assertJsonPath('data.items.0.ipHash', '11112222…')
            ->assertJsonPath('data.items.1.previewSlug', 'jk-construction')
            ->assertJsonPath('data.items.1.browser', 'Chrome')
            ->assertJsonPath('data.items.1.os', 'Windows')
            ->assertJsonPath('data.items.1.referrer', 'facebook.com')
            ->assertJsonPath('data.items.1.ipHash', 'deadbeef…')
            ->assertJsonMissingPath('data.items.0.ip')
            ->assertJsonStructure([
                'data' => [
                    'items' => [
                        [
                            'createdAt',
                            'visitorId',
                            'eventType',
                            'section',
                            'previewSlug',
                            'device',
                            'browser',
                            'os',
                            'referrer',
                            'ipHash',
                        ],
                    ],
                    'pagination',
                    'privacyNote',
                ],
            ]);

        $this->getJson('/admin/analytics/visits?eventType=preview_view&device=Desktop')
            ->assertOk()
            ->assertJsonPath('data.pagination.total', 1)
            ->assertJsonPath('data.items.0.eventType', 'preview_view');
    }
}
