<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OutreachScheduler;
use App\Services\PushNotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OutreachController extends Controller
{
    public function __construct(
        private OutreachScheduler $scheduler,
        private PushNotificationService $push,
    ) {}

    public function schedule(Request $request): JsonResponse
    {
        if ($response = $this->authorizeSecret($request)) {
            return $response;
        }

        try {
            $data = $this->scheduler->schedule($request->all());
        } catch (\InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage());
        } catch (\RuntimeException $e) {
            return ApiResponse::error($e->getMessage(), [], 500);
        }

        return ApiResponse::success('Outreach scheduled', $data);
    }

    public function pause(Request $request): JsonResponse
    {
        if ($response = $this->authorizeSecret($request)) {
            return $response;
        }

        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        $email = trim((string) $request->input('contactEmail', ''));

        try {
            $data = $this->scheduler->pause($slug, $email);
        } catch (\InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success('Outreach paused', $data);
    }

    /**
     * Secret-protected notify for hosting-php cron / CLI after outreach emails.
     */
    public function pushNotify(Request $request): JsonResponse
    {
        if ($response = $this->authorizeSecret($request)) {
            return $response;
        }

        $title = trim((string) $request->input('title', ''));
        $body = trim((string) $request->input('body', ''));
        if ($title === '' || $body === '') {
            return ApiResponse::error('title and body are required');
        }

        $data = $request->input('data');
        if (! is_array($data)) {
            $data = [];
        }
        if (! isset($data['url'])) {
            $data['url'] = '/#admin';
        }

        try {
            $sent = $this->push->sendToAdmins($title, $body, $data);
        } catch (\Throwable $e) {
            Log::warning('pushNotifyAdmins failed', ['error' => $e->getMessage()]);

            return ApiResponse::error('Web push delivery failed', [], 503);
        }

        return ApiResponse::success('Push queued', ['sent' => $sent]);
    }

    private function authorizeSecret(Request $request): ?JsonResponse
    {
        $expected = (string) config('portfolio.outreach_secret', '');
        if ($expected === '') {
            return ApiResponse::error('OUTREACH_SECRET not configured', [], 500);
        }

        $given = trim((string) ($request->input('secret') ?? $request->header('X-Outreach-Secret', '')));
        if ($given === '' || ! hash_equals($expected, $given)) {
            return ApiResponse::error('Unauthorized', [], 401);
        }

        return null;
    }
}
