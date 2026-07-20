<?php

namespace Tests\Feature;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class RateLimitIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_exhausting_one_named_limiter_does_not_block_another_route(): void
    {
        RateLimiter::for('contact', fn (Request $request) => Limit::perMinute(2)->by((string) $request->ip()));
        RateLimiter::for('previewFeedback', fn (Request $request) => Limit::perMinute(60)->by((string) $request->ip()));

        // Empty contact is silent-OK (anti-spam); throttle still counts.
        $this->postJson('/contact', [])->assertOk();
        $this->postJson('/contact', [])->assertOk();
        $this->postJson('/contact', [])
            ->assertStatus(429)
            ->assertSee('Too Many Attempts');

        // Shared IP key used to block every throttled route; named limiters keep buckets apart.
        $this->postJson('/previewFeedback', [])
            ->assertStatus(400)
            ->assertJsonPath('status', 400);
    }

    public function test_legacy_inline_throttle_shares_one_ip_bucket_across_limits(): void
    {
        // Documents the bug: bare throttle:max,decay uses prefix '' so keys collide.
        $signature = sha1('|127.0.0.1');

        RateLimiter::clear($signature);
        for ($i = 0; $i < 5; $i++) {
            RateLimiter::hit($signature, 60);
        }

        // After five hits on the shared signature, a strict contact-style limit (5) is exhausted —
        // the same way trackVisit traffic used to trip unrelated routes.
        $this->assertTrue(RateLimiter::tooManyAttempts($signature, 5));
        $this->assertTrue(RateLimiter::tooManyAttempts($signature, 2));
    }
}
