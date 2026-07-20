<?php

namespace Tests\Unit;

use App\Services\PreviewAnalyticsPush;
use App\Services\PushNotificationService;
use App\Support\BrowserOriginGate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PreviewAnalyticsPushTest extends TestCase
{
    use RefreshDatabase;

    private const ORIGIN = ['Origin' => 'https://carlmanuel.com'];

    private function bindRequestHeaders(array $headers): void
    {
        $server = [];
        foreach ($headers as $key => $value) {
            $normalized = strtoupper(str_replace('-', '_', $key));
            if (! str_starts_with($normalized, 'HTTP_')) {
                $normalized = 'HTTP_'.$normalized;
            }
            $server[$normalized] = $value;
        }

        $this->app->instance('request', \Illuminate\Http\Request::create('/', 'GET', [], [], [], $server));
    }

    public function test_preview_view_requires_allowed_origin_and_event_type(): void
    {
        $service = app(PreviewAnalyticsPush::class);

        $this->assertFalse($service->isLegitPreviewView('pageview', 'jk-construction', 's1'));
        $this->assertFalse($service->isLegitPreviewView('preview_view', 'jk-construction', 's1'));

        $this->bindRequestHeaders(self::ORIGIN);
        $this->assertTrue($service->isLegitPreviewView('preview_view', 'jk-construction', 's1'));
        $this->assertFalse($service->isLegitPreviewView('preview_view', 'bad slug!', 's1'));
    }

    public function test_preview_view_push_throttled_per_slug_and_session(): void
    {
        Cache::flush();

        $service = app(PreviewAnalyticsPush::class);

        $this->assertTrue($service->claimPreviewViewPush('jk-construction', 'session-a'));
        $this->assertFalse($service->claimPreviewViewPush('jk-construction', 'session-a'));
        $this->assertTrue($service->claimPreviewViewPush('jk-construction', 'session-b'));
        $this->assertTrue($service->claimPreviewViewPush('other-slug', 'session-a'));
    }

    public function test_maybe_notify_preview_view_sends_once_with_browser_origin(): void
    {
        Cache::flush();

        $this->mock(PushNotificationService::class, function ($mock): void {
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

        $service = app(PreviewAnalyticsPush::class);

        $this->bindRequestHeaders(self::ORIGIN);
        $service->maybeNotifyPreviewView('preview_view', 'jk-construction', 'sess-1');
        $service->maybeNotifyPreviewView('preview_view', 'jk-construction', 'sess-1');
    }

    public function test_notify_feedback_like_and_dislike(): void
    {
        $this->mock(PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'Preview liked',
                    'JK Construction — thumbs up',
                    [
                        'type' => 'preview_feedback',
                        'slug' => 'jk-construction',
                        'sentiment' => 'like',
                        'url' => 'https://carlmanuel.com/#admin',
                    ]
                )
                ->andReturn(1);

            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'Preview disliked',
                    'JK Construction — Layout feels crowded on mobile',
                    [
                        'type' => 'preview_feedback',
                        'slug' => 'jk-construction',
                        'sentiment' => 'dislike',
                        'url' => 'https://carlmanuel.com/#admin',
                    ]
                )
                ->andReturn(1);
        });

        $service = app(PreviewAnalyticsPush::class);

        $this->bindRequestHeaders(self::ORIGIN);
        $service->notifyFeedback('jk-construction', 'like', 'JK Construction');
        $service->notifyFeedback(
            'jk-construction',
            'dislike',
            'JK Construction',
            'Layout feels crowded on mobile'
        );
    }

    public function test_notify_feedback_agree(): void
    {
        $this->mock(PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')
                ->once()
                ->with(
                    'Ready to proceed',
                    'JK Construction — wants to move forward',
                    [
                        'type' => 'preview_feedback',
                        'slug' => 'jk-construction',
                        'sentiment' => 'agree',
                        'url' => 'https://carlmanuel.com/#admin',
                    ]
                )
                ->andReturn(1);
        });

        $service = app(PreviewAnalyticsPush::class);

        $this->bindRequestHeaders(self::ORIGIN);
        $service->notifyFeedback('jk-construction', 'agree', 'JK Construction');
    }

    public function test_browser_origin_gate_matches_hosting_php_allowlist(): void
    {
        $this->assertTrue(BrowserOriginGate::isAllowedOrigin('https://carlmanuel.com'));
        $this->assertTrue(BrowserOriginGate::isAllowedOrigin('https://www.carlmanuel.com'));
        $this->assertFalse(BrowserOriginGate::isAllowedOrigin('https://evil.test'));

        $this->bindRequestHeaders(['Referer' => 'https://carlmanuel.com/?preview=jk-construction']);
        $this->assertTrue(BrowserOriginGate::hasAllowedBrowserOrigin());
    }
}
