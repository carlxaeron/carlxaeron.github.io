<?php

declare(strict_types=1);

/**
 * File-based fixed-window IP rate limiter under storage/rate-limit/.
 * Uses REMOTE_ADDR only (do not trust X-Forwarded-For for limiting on Stellar).
 */

function rate_limit_storage_dir(?string $override = null): string
{
    if ($override !== null && $override !== '') {
        return rtrim($override, '/');
    }
    $root = dirname(__DIR__);
    return $root . '/storage/rate-limit';
}

function rate_limit_client_ip(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return $ip !== '' ? $ip : '0.0.0.0';
}

/**
 * @return bool true if request is allowed (count incremented), false if over limit
 */
function rate_limit_check(
    string $bucket,
    int $max,
    int $windowSeconds,
    ?string $ip = null,
    ?string $storageDir = null
): bool {
    if ($max <= 0 || $windowSeconds <= 0) {
        return true;
    }

    $ip = $ip ?? rate_limit_client_ip();
    $dir = rate_limit_storage_dir($storageDir);
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        // Fail open if storage is unavailable — still serve portfolio traffic.
        error_log('rate_limit: cannot create storage dir ' . $dir);
        return true;
    }

    $key = hash('sha1', $bucket . '|' . $ip);
    $path = $dir . '/' . $key . '.json';
    $now = time();

    $fp = @fopen($path, 'c+');
    if ($fp === false) {
        error_log('rate_limit: cannot open ' . $path);
        return true;
    }

    try {
        if (!flock($fp, LOCK_EX)) {
            return true;
        }

        $raw = stream_get_contents($fp);
        $state = ['start' => $now, 'count' => 0];
        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded) && isset($decoded['start'], $decoded['count'])) {
                $state = [
                    'start' => (int) $decoded['start'],
                    'count' => (int) $decoded['count'],
                ];
            }
        }

        if ($now - $state['start'] >= $windowSeconds) {
            $state = ['start' => $now, 'count' => 0];
        }

        if ($state['count'] >= $max) {
            return false;
        }

        $state['count']++;
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($state));
        fflush($fp);
        return true;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

/** Exit with 429 when over limit (Firebase-shaped body still uses status 400). */
function rate_limit_enforce(string $bucket, int $max, int $windowSeconds): void
{
    if (!rate_limit_check($bucket, $max, $windowSeconds)) {
        send_error('Too many requests', [], 429);
    }
}

/** Resolve max/window from env with plan defaults. */
function rate_limit_config(string $route): array
{
    $defaults = [
        'contact' => [8, 3600],
        'quotation' => [8, 3600],
        'trackVisit' => [120, 60],
        'previewFeedback' => [30, 3600],
        'analyticsSummary' => [60, 60],
        'outreach' => [60, 3600],
        'assistant' => [30, 3600],
    ];

    [$maxDefault, $windowDefault] = $defaults[$route] ?? [60, 60];

    $envMap = [
        'contact' => 'RATE_LIMIT_CONTACT',
        'quotation' => 'RATE_LIMIT_QUOTATION',
        'trackVisit' => 'RATE_LIMIT_TRACK_VISIT',
        'previewFeedback' => 'RATE_LIMIT_PREVIEW_FEEDBACK',
        'analyticsSummary' => 'RATE_LIMIT_ANALYTICS_SUMMARY',
        'outreach' => 'RATE_LIMIT_OUTREACH',
        'assistant' => 'RATE_LIMIT_ASSISTANT',
    ];

    $envKey = $envMap[$route] ?? null;
    $max = $maxDefault;
    if ($envKey !== null) {
        $raw = env($envKey);
        if ($raw !== null && $raw !== '' && is_numeric($raw)) {
            $max = max(1, (int) $raw);
        }
    }

    return [$max, $windowDefault];
}

function rate_limit_route(string $route): void
{
    [$max, $window] = rate_limit_config($route);
    rate_limit_enforce($route === 'outreach' ? 'outreach' : $route, $max, $window);
}
