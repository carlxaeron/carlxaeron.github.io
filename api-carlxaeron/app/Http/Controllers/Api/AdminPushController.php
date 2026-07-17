<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PushNotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPushController extends Controller
{
    public function __construct(
        private PushNotificationService $push,
    ) {}

    public function vapidPublicKey(): JsonResponse
    {
        $publicKey = $this->push->getVapidPublicKey();
        if ($publicKey === '') {
            return ApiResponse::error('Web push not configured', [], 503);
        }

        return ApiResponse::success('OK', ['publicKey' => $publicKey]);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $endpoint = trim((string) $request->input('endpoint', ''));
        $keys = $request->input('keys', []);
        $p256dh = is_array($keys) ? trim((string) ($keys['p256dh'] ?? '')) : '';
        $auth = is_array($keys) ? trim((string) ($keys['auth'] ?? '')) : '';

        if ($endpoint === '' || $p256dh === '' || $auth === '') {
            return ApiResponse::error('Missing endpoint or subscription keys');
        }

        $subscription = $this->push->subscribe($request->user(), [
            'endpoint' => $endpoint,
            'keys' => [
                'p256dh' => $p256dh,
                'auth' => $auth,
            ],
            'userAgent' => $request->userAgent(),
        ]);

        return ApiResponse::success('Subscribed', [
            'id' => $subscription->id,
            'endpoint' => $subscription->endpoint,
        ]);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $endpoint = trim((string) $request->input('endpoint', ''));
        if ($endpoint === '') {
            return ApiResponse::error('Missing endpoint');
        }

        $deleted = $this->push->unsubscribe($request->user(), $endpoint);

        return ApiResponse::success('Unsubscribed', ['deleted' => $deleted]);
    }

    public function test(Request $request): JsonResponse
    {
        if (! $this->push->isConfigured()) {
            return ApiResponse::error('Web push not configured', [], 503);
        }

        try {
            $sent = $this->push->sendToUser(
                $request->user(),
                'Test notification',
                'Push is working from Admin Settings.',
                [
                    'type' => 'test',
                    'url' => 'https://carlmanuel.com/#admin',
                ]
            );
        } catch (\Throwable) {
            return ApiResponse::error(
                'Web push delivery failed. The server may be missing push dependencies — contact support or retry after deploy.',
                [],
                503
            );
        }

        if ($sent === 0) {
            return ApiResponse::error(
                'No push was delivered. Enable notifications on this device first, then try again.',
                ['sent' => 0],
                422
            );
        }

        return ApiResponse::success('Test sent', ['sent' => $sent]);
    }
}
