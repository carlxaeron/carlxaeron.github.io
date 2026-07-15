<?php

declare(strict_types=1);

function parse_exclusion_list(?string $value): array
{
    if (!$value) {
        return [];
    }
    $parts = array_map(static fn ($e) => strtolower(trim($e)), explode(',', $value));
    return array_values(array_filter($parts, static fn ($e) => $e !== ''));
}

function client_ip(): string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($forwarded) && $forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '');
}

/** Same salt as Firebase analyticsExclusion.js */
function hash_ip(?string $ip): ?string
{
    if (!$ip) {
        return null;
    }
    return substr(hash('sha256', $ip . ':carlxaeron-portfolio'), 0, 16);
}

function is_excluded_analytics_request(?string $visitorId = null): bool
{
    $ipHashes = parse_exclusion_list(env('ANALYTICS_EXCLUDE_IP_HASHES'));
    $visitorIds = parse_exclusion_list(env('ANALYTICS_EXCLUDE_VISITOR_IDS'));
    $ipHash = hash_ip(client_ip());
    if ($ipHash && in_array(strtolower($ipHash), $ipHashes, true)) {
        return true;
    }
    if ($visitorId && in_array(strtolower(trim($visitorId)), $visitorIds, true)) {
        return true;
    }
    return false;
}

function is_excluded_record(?string $ipHash, ?string $visitorId): bool
{
    $ipHashes = parse_exclusion_list(env('ANALYTICS_EXCLUDE_IP_HASHES'));
    $visitorIds = parse_exclusion_list(env('ANALYTICS_EXCLUDE_VISITOR_IDS'));
    if ($ipHash && in_array(strtolower($ipHash), $ipHashes, true)) {
        return true;
    }
    if ($visitorId && in_array(strtolower(trim($visitorId)), $visitorIds, true)) {
        return true;
    }
    return false;
}

function parse_device(?string $userAgent): string
{
    $ua = strtolower((string) $userAgent);
    if (preg_match('/mobile|android|iphone|ipad/', $ua)) {
        return 'Mobile';
    }
    if (preg_match('/tablet|ipad/', $ua)) {
        return 'Tablet';
    }
    return 'Desktop';
}

/**
 * Mask client preview slugs for public JSON (first2 + **** + last2).
 * Matches frontend maskClientSlug — e.g. g3k-cad → g3****ad.
 */
function mask_client_slug(?string $slug): string
{
    $s = trim((string) $slug);
    $len = strlen($s);
    if ($len <= 4) {
        return str_repeat('*', max($len, 4));
    }
    return substr($s, 0, 2) . '****' . substr($s, -2);
}
