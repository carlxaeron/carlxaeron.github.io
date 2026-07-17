<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OutreachScheduler;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutreachController extends Controller
{
    public function __construct(
        private OutreachScheduler $scheduler,
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
