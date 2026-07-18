<?php

namespace App\Services;

use App\Support\BrowserOriginGate;
use Illuminate\Support\Facades\Cache;

/**
 * Admin Web Push for legit client preview views and feedback.
 *
 * Preview-view throttle: one push per preview slug + browser session (Cache TTL
 * defaults to 30 minutes as a safety net if the same session id is reused).
 */
class PreviewAnalyticsPush
{
    public function __construct(
        private PushNotificationService $push,
    ) {}

    public function maybeNotifyPreviewView(
        string $eventType,
        ?string $previewSlug,
        string $sessionId,
    ): void {
        if (! $this->isLegitPreviewView($eventType, $previewSlug, $sessionId)) {
            return;
        }

        $slug = trim((string) $previewSlug);
        if (! $this->claimPreviewViewPush($slug, $sessionId)) {
            return;
        }

        $this->tryPush(
            'Client preview viewed',
            $slug,
            [
                'type' => 'preview_view',
                'slug' => $slug,
                'url' => 'https://carlmanuel.com/#admin',
            ]
        );
    }

    public function notifyFeedback(
        string $previewSlug,
        string $sentiment,
        ?string $previewLabel = null,
        ?string $comment = null,
    ): void {
        if (! BrowserOriginGate::hasAllowedBrowserOrigin()) {
            return;
        }

        $slug = trim($previewSlug);
        $label = trim((string) ($previewLabel ?: $slug));
        $isLike = $sentiment === 'like';

        $title = $isLike ? 'Preview liked' : 'Preview disliked';
        $body = $isLike
            ? "{$label} — thumbs up"
            : $this->dislikeBody($label, $comment);

        $this->tryPush($title, $body, [
            'type' => 'preview_feedback',
            'slug' => $slug,
            'sentiment' => $sentiment,
            'url' => 'https://carlmanuel.com/#admin',
        ]);
    }

    public function isLegitPreviewView(
        string $eventType,
        ?string $previewSlug,
        string $sessionId,
    ): bool {
        if ($eventType !== 'preview_view') {
            return false;
        }

        if (! BrowserOriginGate::hasAllowedBrowserOrigin()) {
            return false;
        }

        $slug = trim((string) $previewSlug);
        if ($slug === '' || ! $this->isValidPreviewSlug($slug)) {
            return false;
        }

        $sessionId = trim($sessionId);
        if ($sessionId === '') {
            return false;
        }

        return true;
    }

    public function claimPreviewViewPush(string $slug, string $sessionId): bool
    {
        $minutes = max(1, (int) config('portfolio.push_preview_view_throttle_minutes', 30));
        $key = 'admin_push:preview_view:'.hash('sha256', strtolower($slug).'|'.$sessionId);

        return Cache::add($key, 1, now()->addMinutes($minutes));
    }

    public function isValidPreviewSlug(string $slug): bool
    {
        return (bool) preg_match('/^[a-z0-9][a-z0-9-]{0,62}$/i', $slug);
    }

    private function dislikeBody(string $label, ?string $comment): string
    {
        $trimmed = trim((string) $comment);
        if ($trimmed === '') {
            return "{$label} — thumbs down";
        }

        if (strlen($trimmed) > 80) {
            $trimmed = substr($trimmed, 0, 77).'…';
        }

        return "{$label} — {$trimmed}";
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function tryPush(string $title, string $body, array $data): void
    {
        try {
            $this->push->sendToAdmins($title, $body, $data);
        } catch (\Throwable) {
            // Push must never break analytics responses.
        }
    }
}
