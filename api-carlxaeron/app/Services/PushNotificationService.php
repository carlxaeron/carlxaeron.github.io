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
            if (! $this->isValidSubscriptionRecord($record)) {
                Log::warning('Web push subscription skipped (invalid keys or endpoint)', [
                    'id' => $record->id,
                    'endpoint' => $record->endpoint,
                ]);
                $record->delete();

                continue;
            }

            try {
                $webPush->queueNotification(
                    $this->toWebPushSubscription($record),
                    $payload
                );
                $queued++;
            } catch (\Throwable $e) {
                Log::warning('Web push queue failed', [
                    'id' => $record->id,
                    'endpoint' => $record->endpoint,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($queued === 0) {
            return 0;
        }

        try {
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
        } catch (\Throwable $e) {
            Log::error('Web push send failed', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
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

    private function isValidSubscriptionRecord(PushSubscription $record): bool
    {
        $endpoint = trim((string) $record->endpoint);
        if ($endpoint === '' || filter_var($endpoint, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        $scheme = parse_url($endpoint, PHP_URL_SCHEME);
        if (! in_array($scheme, ['https', 'http'], true)) {
            return false;
        }

        $p256dh = trim((string) $record->public_key);
        $auth = trim((string) $record->auth_token);

        return $this->isValidBase64UrlKey($p256dh, 65, 88)
            && $this->isValidBase64UrlKey($auth, 16, 24);
    }

    private function isValidBase64UrlKey(string $value, int $minLength, int $maxLength): bool
    {
        if ($value === '' || strlen($value) < $minLength || strlen($value) > $maxLength) {
            return false;
        }

        if (! preg_match('/^[A-Za-z0-9_-]+$/', $value)) {
            return false;
        }

        return base64_decode(strtr($value, '-_', '+/'), true) !== false;
    }
}
