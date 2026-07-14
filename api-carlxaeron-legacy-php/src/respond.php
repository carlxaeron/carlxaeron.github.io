<?php

declare(strict_types=1);

function json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function send_success(string $message = 'Success', $data = []): void
{
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 200,
        'message' => $message,
        'data' => $data ?: new stdClass(),
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

function send_error(string $message = 'Error', $data = [], int $http = 400): void
{
    http_response_code($http);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 400,
        'message' => $message,
        'data' => $data ?: new stdClass(),
        'errCode' => '',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}
