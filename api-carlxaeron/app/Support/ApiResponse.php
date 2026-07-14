<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * Firebase-compatible JSON envelope used by the portfolio frontend.
 */
final class ApiResponse
{
    public static function success(string $message = 'Success', mixed $data = []): JsonResponse
    {
        return response()->json([
            'status' => 200,
            'message' => $message,
            'data' => $data === [] ? new \stdClass() : $data,
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    public static function error(string $message = 'Error', mixed $data = [], int $http = 400): JsonResponse
    {
        return response()->json([
            'status' => 400,
            'message' => $message,
            'data' => $data === [] ? new \stdClass() : $data,
            'errCode' => '',
        ], $http, [], JSON_UNESCAPED_SLASHES);
    }
}
