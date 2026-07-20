<?php

namespace Tests\Feature;

use App\Models\OutreachJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
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

    public function test_login_success_returns_token(): void
    {
        $this->postJson('/admin/login', [
            'email' => self::ADMIN_EMAIL,
            'password' => self::ADMIN_PASSWORD,
        ])
            ->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonStructure([
                'data' => ['token', 'user' => ['email']],
            ])
            ->assertJsonPath('data.user.email', self::ADMIN_EMAIL);
    }

    public function test_login_fails_with_bad_password(): void
    {
        $this->postJson('/admin/login', [
            'email' => self::ADMIN_EMAIL,
            'password' => 'wrong-password',
        ])
            ->assertStatus(401)
            ->assertJsonPath('message', 'Invalid credentials');
    }

    public function test_admin_routes_require_token(): void
    {
        $this->getJson('/admin/summary')
            ->assertUnauthorized();

        $this->getJson('/admin/analytics')
            ->assertUnauthorized();

        $this->getJson('/admin/contacts')
            ->assertUnauthorized();

        $this->getJson('/admin/quotations')
            ->assertUnauthorized();

        $this->getJson('/admin/outreach')
            ->assertUnauthorized();
    }

    public function test_summary_returns_unmasked_slugs(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->getJson('/admin/summary')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'clientSites',
                    'totalPreviewViews',
                    'totalAgrees',
                    'previewStats',
                    'generatedAt',
                ],
            ]);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail();
        $token = $user->createToken('admin')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/admin/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out');
    }

    public function test_outreach_pause_updates_job(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        OutreachJob::query()->create([
            'slug' => 'demo-client',
            'business_name' => 'Demo Client',
            'contact_name' => 'Demo Contact',
            'contact_email' => 'client@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=demo-client',
            'auto_followup' => true,
            'status' => 'active',
            'next_follow_up_at' => now()->addDays(3),
        ]);

        $this->postJson('/admin/outreachPause', [
            'slug' => 'demo-client',
            'contactEmail' => 'client@example.com',
        ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'demo-client')
            ->assertJsonPath('data.updated', 1);

        $this->assertDatabaseHas('outreach_jobs', [
            'slug' => 'demo-client',
            'auto_followup' => false,
            'status' => 'paused',
            'next_follow_up_at' => null,
        ]);
    }

    public function test_outreach_pause_requires_slug(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->postJson('/admin/outreachPause', ['slug' => ''])
            ->assertStatus(400)
            ->assertJsonPath('message', 'Missing slug');
    }
}
