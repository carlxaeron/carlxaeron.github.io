<?php

namespace Tests\Feature;

use App\Mail\PreviewUnlockRequestMail;
use App\Models\PreviewAccessToken;
use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Mockery;
use Tests\TestCase;

class PreviewAccessApiTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'test-preview-access-secret';

    private const ADMIN_EMAIL = 'admin@example.com';

    private const ADMIN_PASSWORD = 'secret-password';

    private const HOST = 'demo-client.netlify.app';

    private const SLUG = 'demo-client';

    /** @var \Mockery\MockInterface&PushNotificationService */
    private $pushMock;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'portfolio.preview_access_secret' => self::SECRET,
            'portfolio.mail_to' => 'info@carlmanuel.com',
            'portfolio.mail_bcc' => 'info@carlmanuel.com',
        ]);

        User::query()->create([
            'name' => 'Admin',
            'email' => self::ADMIN_EMAIL,
            'password' => Hash::make(self::ADMIN_PASSWORD),
        ]);

        $this->pushMock = Mockery::mock(PushNotificationService::class);
        $this->pushMock->shouldReceive('sendToAdmins')->andReturn(0)->byDefault();
        $this->app->instance(PushNotificationService::class, $this->pushMock);
    }

    private function actingAsAdmin(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );
    }

    private function mintToken(string $scope = PreviewAccessToken::SCOPE_SITE, array $overrides = []): PreviewAccessToken
    {
        return PreviewAccessToken::query()->create(array_merge([
            'token' => PreviewAccessToken::generateToken(),
            'slug' => self::SLUG,
            'netlify_host' => self::HOST,
            'scope' => $scope,
            'status' => PreviewAccessToken::STATUS_UNUSED,
            'expires_at' => now()->addDays(14),
            'contact_email' => 'prospect@example.com',
            'unlock_request_count' => 0,
        ], $overrides));
    }

    public function test_redeem_once_then_second_denied(): void
    {
        $row = $this->mintToken();

        $this->withHeader('X-Preview-Access-Secret', self::SECRET)
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => self::HOST,
                'path' => '/',
                'clientIp' => '203.0.113.10',
                'clientUa' => 'TestAgent/1.0',
            ])
            ->assertOk()
            ->assertJsonPath('data.ok', true)
            ->assertJsonPath('data.scope', 'site')
            ->assertJsonPath('data.slug', self::SLUG)
            ->assertJsonPath('data.unlockMarker', '1');

        $this->assertDatabaseHas('preview_access_tokens', [
            'id' => $row->id,
            'status' => 'used',
            'used_ip' => '203.0.113.10',
        ]);

        $this->withHeader('X-Preview-Access-Secret', self::SECRET)
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => self::HOST,
                'path' => '/',
            ])
            ->assertStatus(403)
            ->assertJsonPath('data.ok', false)
            ->assertJsonPath('data.reason', 'used');
    }

    public function test_redeem_rejects_wrong_secret(): void
    {
        $row = $this->mintToken();

        $this->withHeader('X-Preview-Access-Secret', 'wrong')
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => self::HOST,
                'path' => '/',
            ])
            ->assertStatus(401)
            ->assertJsonPath('data.reason', 'unauthorized');
    }

    public function test_redeem_rejects_missing_secret(): void
    {
        $row = $this->mintToken();

        $this->postJson('/previewAccess/redeem', [
            'token' => $row->token,
            'host' => self::HOST,
            'path' => '/',
        ])
            ->assertStatus(401);
    }

    public function test_redeem_rejects_wrong_host(): void
    {
        $row = $this->mintToken();

        $this->withHeader('X-Preview-Access-Secret', self::SECRET)
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => 'other.netlify.app',
                'path' => '/',
            ])
            ->assertStatus(403)
            ->assertJsonPath('data.reason', 'host_mismatch');
    }

    public function test_redeem_rejects_wrong_scope(): void
    {
        $row = $this->mintToken(PreviewAccessToken::SCOPE_SITE);

        $this->withHeader('X-Preview-Access-Secret', self::SECRET)
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => self::HOST,
                'path' => '/admin/',
            ])
            ->assertStatus(403)
            ->assertJsonPath('data.reason', 'scope_mismatch');
    }

    public function test_redeem_admin_scope_from_path(): void
    {
        $row = $this->mintToken(PreviewAccessToken::SCOPE_ADMIN);

        $this->withHeader('X-Preview-Access-Secret', self::SECRET)
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => self::HOST,
                'path' => '/admin/index.html',
            ])
            ->assertOk()
            ->assertJsonPath('data.ok', true)
            ->assertJsonPath('data.scope', 'admin');
    }

    public function test_redeem_rejects_expired(): void
    {
        $row = $this->mintToken(PreviewAccessToken::SCOPE_SITE, [
            'expires_at' => now()->subDay(),
        ]);

        $this->withHeader('X-Preview-Access-Secret', self::SECRET)
            ->postJson('/previewAccess/redeem', [
                'token' => $row->token,
                'host' => self::HOST,
                'path' => '/',
            ])
            ->assertStatus(403)
            ->assertJsonPath('data.reason', 'expired');
    }

    public function test_request_unlock_sends_mail_and_push(): void
    {
        Mail::fake();
        $row = $this->mintToken(PreviewAccessToken::SCOPE_SITE, [
            'status' => PreviewAccessToken::STATUS_USED,
            'used_at' => now(),
        ]);

        $this->pushMock->shouldReceive('sendToAdmins')
            ->once()
            ->withArgs(function (string $title, string $body, array $data): bool {
                return $title === 'Preview unlock request'
                    && ($data['type'] ?? null) === 'preview_unlock_request'
                    && ($data['slug'] ?? null) === self::SLUG;
            })
            ->andReturn(1);

        $this->withHeaders([
            'Origin' => 'https://'.self::HOST,
        ])->postJson('/previewAccess/requestUnlock', [
            'slug' => self::SLUG,
            'host' => self::HOST,
            'token' => $row->token,
            'message' => 'Please unlock again',
            'label' => 'Demo Client',
        ])
            ->assertOk()
            ->assertJsonPath('data.ok', true)
            ->assertJsonPath('data.notified', true);

        Mail::assertSent(PreviewUnlockRequestMail::class, function (PreviewUnlockRequestMail $mail) {
            return str_contains($mail->mailSubject, 'Unlock request')
                && str_contains($mail->htmlBody, 'Demo Client')
                && str_contains($mail->htmlBody, 'Please unlock again');
        });

        $this->assertDatabaseHas('preview_access_tokens', [
            'id' => $row->id,
            'unlock_request_count' => 1,
        ]);
    }

    public function test_request_unlock_forbidden_without_browser_origin(): void
    {
        $this->postJson('/previewAccess/requestUnlock', [
            'slug' => self::SLUG,
            'host' => self::HOST,
        ])
            ->assertStatus(403);
    }

    public function test_admin_mint_list_revoke(): void
    {
        $this->actingAsAdmin();

        $mint = $this->postJson('/admin/preview-access', [
            'slug' => self::SLUG,
            'netlifyHost' => self::HOST,
            'contactEmail' => 'prospect@example.com',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Preview access minted')
            ->assertJsonStructure([
                'data' => [
                    'items',
                    'urls' => ['site', 'admin'],
                ],
            ]);

        $this->assertCount(2, $mint->json('data.items'));
        $this->assertStringContainsString('?access=', $mint->json('data.urls.site'));
        $this->assertStringContainsString('/admin/?access=', $mint->json('data.urls.admin'));

        $this->getJson('/admin/preview-access?slug='.self::SLUG)
            ->assertOk()
            ->assertJsonPath('data.pagination.total', 2);

        $id = (int) $mint->json('data.items.0.id');
        $this->postJson("/admin/preview-access/{$id}/revoke")
            ->assertOk()
            ->assertJsonPath('data.status', 'revoked');
    }

    public function test_admin_mint_requires_auth(): void
    {
        $this->postJson('/admin/preview-access', [
            'slug' => self::SLUG,
            'netlifyHost' => self::HOST,
        ])->assertUnauthorized();
    }
}
