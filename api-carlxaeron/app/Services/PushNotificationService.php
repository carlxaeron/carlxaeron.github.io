<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushNotificationService
{
    public function isConfigured(): bool
    {
        return $this->getVapidPublicKey() !== '' && $this->getVapidPrivateKey() !== '';
    }

    public function getVapidPublicKey(): string
    {
        return trim((string) config('portfolio.vapid_public_key', ''));
    }

    public function subscribe(User $user, array $payload): PushSubscription
    {
        $endpoint = trim((string) ($payload['endpoint'] ?? ''));
        $keys = is_array($payload['keys'] ?? null) ? $payload['keys'] : [];
        $p256dh = trim((string) ($keys['p256dh'] ?? ''));
        $auth = trim((string) ($keys['auth'] ?? ''));
        $userAgent = isset($payload['userAgent'])
            ? substr((string) $payload['userAgent'], 0, 512)
            : null;

        return PushSubscription::query()->updateOrCreate(
            ['endpoint' => $endpoint],
            [
                'user_id' => $user->id,
                'public_key' => $p256dh,
                'auth_token' => $auth,
                'user_agent' => $userAgent,
            ]
        );
    }

    public function unsubscribe(User $user, string $endpoint): int
    {
        return PushSubscription::query()
            ->where('user_id', $user->id)
            ->where('endpoint', trim($endpoint))
            ->delete();
    }

    public function sendToAdmins(string $title, string $body, array $data = []): int
    {
        $subscriptions = PushSubscription::query()->get();

        return $this->sendToRecords($subscriptions, $title, $body, $data);
    }

    public function sendToUser(User $user, string $title, string $body, array $data = []): int
    {
        $subscriptions = PushSubscription::query()
            ->where('user_id', $user->id)
            ->get();

        return $this->sendToRecords($subscriptions, $title, $body, $data);
    }

    /**
     * @param  iterable<int, PushSubscription>  $records
     */
    private function sendToRecords(iterable $records, string $title, string $body, array $data): int
    {
        if (! $this->isConfigured()) {
            Log::warning('Web push skipped: VAPID keys not configured');

            return 0;
        }

        $webPush = $this->makeWebPushClient();
        $payload = json_encode([
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        $queued = 0;
        foreach ($records as $record) {
            $webPush->queueNotification(
                $this->toWebPushSubscription($record),
                $payload
            );
            $queued++;
        }

        if ($queued === 0) {
            return 0;
        }

        $sent = 0;
        foreach ($webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $sent++;
                continue;
            }

            if ($report->isSubscriptionExpired()) {
                PushSubscription::query()
                    ->where('endpoint', $report->getEndpoint())
                    ->delete();
            }

            Log::warning('Web push delivery failed', [
                'endpoint' => $report->getEndpoint(),
                'reason' => $report->getReason(),
                'expired' => $report->isSubscriptionExpired(),
            ]);
        }

        return $sent;
    }

    private function makeWebPushClient(): WebPush
    {
        return new WebPush([
            'VAPID' => [
                'subject' => (string) config('portfolio.vapid_subject', 'mailto:info@carlmanuel.com'),
                'publicKey' => $this->getVapidPublicKey(),
                'privateKey' => $this->getVapidPrivateKey(),
            ],
        ]);
    }

    private function toWebPushSubscription(PushSubscription $record): Subscription
    {
        return Subscription::create([
            'endpoint' => $record->endpoint,
            'keys' => [
                'p256dh' => $record->public_key,
                'auth' => $record->auth_token,
            ],
        ]);
    }

    private function getVapidPrivateKey(): string
    {
        return trim((string) config('portfolio.vapid_private_key', ''));
    }
}
