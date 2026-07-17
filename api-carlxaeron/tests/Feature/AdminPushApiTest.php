<?php

namespace Tests\Feature;

use App\Models\PushSubscription;
use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Mockery;
use Tests\TestCase;

class AdminPushApiTest extends TestCase
{
    use RefreshDatabase;

    private const ADMIN_EMAIL = 'admin@example.com';

    private const ADMIN_PASSWORD = 'secret-password';

    private const TEST_VAPID_PUBLIC = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

    private const TEST_VAPID_PRIVATE = 'UxiXIk9c0dM5kMYkbbAUYfi6yVjyuCLfBDgz0SBoP7o';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'portfolio.vapid_public_key' => self::TEST_VAPID_PUBLIC,
            'portfolio.vapid_private_key' => self::TEST_VAPID_PRIVATE,
            'portfolio.vapid_subject' => 'mailto:admin@example.com',
        ]);

        User::query()->create([
            'name' => 'Admin',
            'email' => self::ADMIN_EMAIL,
            'password' => Hash::make(self::ADMIN_PASSWORD),
        ]);
    }

    public function test_push_routes_require_token(): void
    {
        $this->getJson('/admin/push/vapidPublicKey')->assertUnauthorized();
        $this->postJson('/admin/push/subscribe', [])->assertUnauthorized();
        $this->deleteJson('/admin/push/subscribe', [])->assertUnauthorized();
        $this->postJson('/admin/push/test')->assertUnauthorized();
    }

    public function test_vapid_public_key_returns_configured_key(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->getJson('/admin/push/vapidPublicKey')
            ->assertOk()
            ->assertJsonPath('data.publicKey', self::TEST_VAPID_PUBLIC);
    }

    public function test_vapid_public_key_returns_error_when_not_configured(): void
    {
        config(['portfolio.vapid_public_key' => '']);

        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->getJson('/admin/push/vapidPublicKey')
            ->assertStatus(503)
            ->assertJsonPath('message', 'Web push not configured');
    }

    public function test_subscribe_stores_subscription(): void
    {
        $user = User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail();
        Sanctum::actingAs($user, ['*']);

        $payload = [
            'endpoint' => 'https://push.example.test/subscription/abc',
            'keys' => [
                'p256dh' => 'p256dh-key',
                'auth' => 'auth-token',
            ],
        ];

        $this->postJson('/admin/push/subscribe', $payload)
            ->assertOk()
            ->assertJsonPath('message', 'Subscribed')
            ->assertJsonPath('data.endpoint', $payload['endpoint']);

        $this->assertDatabaseHas('push_subscriptions', [
            'user_id' => $user->id,
            'endpoint' => $payload['endpoint'],
            'public_key' => 'p256dh-key',
            'auth_token' => 'auth-token',
        ]);
    }

    public function test_subscribe_requires_fields(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->postJson('/admin/push/subscribe', ['endpoint' => 'https://push.example.test/sub'])
            ->assertStatus(400)
            ->assertJsonPath('message', 'Missing endpoint or subscription keys');
    }

    public function test_unsubscribe_deletes_subscription(): void
    {
        $user = User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail();
        Sanctum::actingAs($user, ['*']);

        $endpoint = 'https://push.example.test/subscription/remove-me';
        PushSubscription::query()->create([
            'user_id' => $user->id,
            'endpoint' => $endpoint,
            'public_key' => 'p256dh-key',
            'auth_token' => 'auth-token',
        ]);

        $this->deleteJson('/admin/push/subscribe', ['endpoint' => $endpoint])
            ->assertOk()
            ->assertJsonPath('data.deleted', 1);

        $this->assertDatabaseMissing('push_subscriptions', [
            'endpoint' => $endpoint,
        ]);
    }

    public function test_test_endpoint_calls_service_for_current_user(): void
    {
        $user = User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail();
        Sanctum::actingAs($user, ['*']);

        $this->mock(PushNotificationService::class, function ($mock) use ($user): void {
            $mock->shouldReceive('isConfigured')->once()->andReturn(true);
            $mock->shouldReceive('sendToUser')
                ->once()
                ->with(
                    Mockery::on(fn ($arg) => $arg->is($user)),
                    'Test notification',
                    'Push is working from Admin Settings.',
                    Mockery::on(fn ($data) => $data['type'] === 'test' && $data['url'] === 'https://carlmanuel.com/#admin')
                )
                ->andReturn(1);
        });

        $this->postJson('/admin/push/test')
            ->assertOk()
            ->assertJsonPath('message', 'Test sent')
            ->assertJsonPath('data.sent', 1);
    }
}
