<?php

declare(strict_types=1);

function allowed_origins(): array
{
    return [
        'https://carlxaeron.github.io',
        'https://carlmanuel.com',
        'https://www.carlmanuel.com',
        'http://localhost:3000',
    ];
}

function apply_cors(string $methods = 'POST, OPTIONS'): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, allowed_origins(), true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    header('Access-Control-Allow-Methods: ' . $methods);
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
}

function handle_preflight(string $methods = 'POST, OPTIONS'): void
{
    apply_cors($methods);
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
