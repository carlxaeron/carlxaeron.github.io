<?php

namespace Tests\Unit;

use App\Models\PushSubscription;
use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PushNotificationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscribe_creates_and_updates_subscription(): void
    {
        $user = User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('secret'),
        ]);

        $service = app(PushNotificationService::class);
        $endpoint = 'https://push.example.test/subscription/1';

        $service->subscribe($user, [
            'endpoint' => $endpoint,
            'keys' => [
                'p256dh' => 'key-one',
                'auth' => 'auth-one',
            ],
            'userAgent' => 'TestAgent/1.0',
        ]);

        $this->assertDatabaseHas('push_subscriptions', [
            'user_id' => $user->id,
            'endpoint' => $endpoint,
            'public_key' => 'key-one',
            'auth_token' => 'auth-one',
            'user_agent' => 'TestAgent/1.0',
        ]);

        $service->subscribe($user, [
            'endpoint' => $endpoint,
            'keys' => [
                'p256dh' => 'key-two',
                'auth' => 'auth-two',
            ],
        ]);

        $this->assertSame(1, PushSubscription::query()->count());
        $this->assertDatabaseHas('push_subscriptions', [
            'endpoint' => $endpoint,
            'public_key' => 'key-two',
            'auth_token' => 'auth-two',
        ]);
    }

    public function test_unsubscribe_only_removes_current_user_rows(): void
    {
        $owner = User::query()->create([
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('secret'),
        ]);
        $other = User::query()->create([
            'name' => 'Other',
            'email' => 'other@example.com',
            'password' => Hash::make('secret'),
        ]);

        $endpoint = 'https://push.example.test/shared-endpoint';
        PushSubscription::query()->create([
            'user_id' => $other->id,
            'endpoint' => $endpoint,
            'public_key' => 'k',
            'auth_token' => 'a',
        ]);

        $service = app(PushNotificationService::class);
        $deleted = $service->unsubscribe($owner, $endpoint);

        $this->assertSame(0, $deleted);
        $this->assertDatabaseHas('push_subscriptions', ['endpoint' => $endpoint]);

        $deleted = $service->unsubscribe($other, $endpoint);
        $this->assertSame(1, $deleted);
        $this->assertDatabaseMissing('push_subscriptions', ['endpoint' => $endpoint]);
    }

    public function test_send_to_admins_returns_zero_when_not_configured(): void
    {
        config([
            'portfolio.vapid_public_key' => '',
            'portfolio.vapid_private_key' => '',
        ]);

        $service = app(PushNotificationService::class);
        $sent = $service->sendToAdmins('Title', 'Body');

        $this->assertSame(0, $sent);
    }

    public function test_send_skips_and_removes_invalid_subscription_rows(): void
    {
        config([
            'portfolio.vapid_public_key' => 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
            'portfolio.vapid_private_key' => 'UxiXIk9c0dM5kMYkbbAUYfi6yVjyuCLfBDgz0SBoP7o',
            'portfolio.vapid_subject' => 'mailto:admin@example.com',
        ]);

        PushSubscription::query()->create([
            'user_id' => User::query()->create([
                'name' => 'Admin',
                'email' => 'invalid-sub@example.com',
                'password' => Hash::make('secret'),
            ])->id,
            'endpoint' => 'https://example.com/bad',
            'public_key' => 'x',
            'auth_token' => 'y',
        ]);

        $service = app(PushNotificationService::class);
        $sent = $service->sendToAdmins('Title', 'Body');

        $this->assertSame(0, $sent);
        $this->assertDatabaseMissing('push_subscriptions', [
            'endpoint' => 'https://example.com/bad',
        ]);
    }
}
