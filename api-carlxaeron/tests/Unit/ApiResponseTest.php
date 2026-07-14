<?php

namespace Tests\Unit;

use App\Services\AnalyticsExclusion;
use App\Support\ApiResponse;
use Tests\TestCase;

class ApiResponseTest extends TestCase
{
    public function test_success_wraps_firebase_envelope(): void
    {
        $response = ApiResponse::success('OK', ['ok' => true]);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame([
            'status' => 200,
            'message' => 'OK',
            'data' => ['ok' => true],
        ], $response->getData(true));
    }

    public function test_success_empty_data_is_object(): void
    {
        $payload = json_decode(ApiResponse::success('Done')->getContent(), true);

        $this->assertSame(200, $payload['status']);
        $this->assertSame([], $payload['data']);
    }

    public function test_error_wraps_firebase_envelope(): void
    {
        $response = ApiResponse::error('Missing required fields');

        $this->assertSame(400, $response->getStatusCode());
        $this->assertSame([
            'status' => 400,
            'message' => 'Missing required fields',
            'data' => [],
            'errCode' => '',
        ], $response->getData(true));
    }
}
