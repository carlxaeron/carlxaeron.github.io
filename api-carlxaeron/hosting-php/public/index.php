<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/bootstrap.php';
require_once dirname(__DIR__) . '/routes/handlers.php';

try {
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';

    // Strip common deploy prefixes (subdir on tahanan.org or /public)
    foreach (['/api-carlxaeron/public', '/api-carlxaeron', '/public'] as $base) {
        if (str_starts_with($path, $base)) {
            $path = substr($path, strlen($base)) ?: '/';
            break;
        }
    }

    $path = '/' . trim($path, '/');
    if ($path === '/') {
        $path = '/health';
    }

    // Allow /index.php/trackVisit style
    if (str_contains($path, 'index.php')) {
        $path = '/' . trim(substr($path, strpos($path, 'index.php') + strlen('index.php')), '/');
        if ($path === '/') {
            $path = '/health';
        }
    }

    switch ($path) {
        case '/health':
            route_health();
            break;
        case '/trackVisit':
            route_track_visit();
            break;
        case '/previewFeedback':
            route_preview_feedback();
            break;
        case '/analyticsSummary':
            route_analytics_summary();
            break;
        case '/contact':
            route_contact();
            break;
        case '/quotation':
            route_quotation();
            break;
        case '/outreachSchedule':
            route_outreach_schedule();
            break;
        case '/outreachPause':
            route_outreach_pause();
            break;
        default:
            handle_preflight('GET, POST, OPTIONS');
            send_error('Not found', [], 404);
    }
} catch (Throwable $e) {
    error_log('api-carlxaeron: ' . $e->getMessage());
    apply_cors('GET, POST, OPTIONS');
    send_error('Internal server error', [], 500);
}
