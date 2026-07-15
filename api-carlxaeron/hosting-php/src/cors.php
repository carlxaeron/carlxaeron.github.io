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

function is_allowed_origin(?string $origin): bool
{
    if ($origin === null || $origin === '') {
        return false;
    }
    return in_array($origin, allowed_origins(), true);
}

/**
 * Normalize a raw Origin or absolute URL to scheme://host[:port] (no path).
 */
function normalize_origin_url(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    if ($value === '') {
        return null;
    }
    $parts = parse_url($value);
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        return null;
    }
    $origin = strtolower($parts['scheme']) . '://' . strtolower($parts['host']);
    if (isset($parts['port'])) {
        $origin .= ':' . (int) $parts['port'];
    }
    return $origin;
}

/**
 * True when Origin (preferred) or Referer maps to an allowlisted portfolio origin.
 * Used to block casual curl / address-bar GETs on data endpoints; /health stays open.
 */
function request_has_allowed_browser_origin(): bool
{
    $origin = normalize_origin_url($_SERVER['HTTP_ORIGIN'] ?? null);
    if ($origin !== null && is_allowed_origin($origin)) {
        return true;
    }

    $refererOrigin = normalize_origin_url($_SERVER['HTTP_REFERER'] ?? null);
    return $refererOrigin !== null && is_allowed_origin($refererOrigin);
}

/**
 * Exit 403 unless the request has an allowlisted Origin or Referer.
 * Call after handle_preflight on browser-facing data GETs (e.g. analyticsSummary).
 */
function require_browser_origin(): void
{
    if (request_has_allowed_browser_origin()) {
        return;
    }
    send_error('Forbidden', [], 403);
}

/** Baseline hardening on every CORS / JSON response. */
function apply_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header('Cache-Control: no-store');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
}

/**
 * CORS for browser callers. Allowlist only — never fall back to *.
 * Missing Origin (curl / Cursor) omits Access-Control-Allow-Origin.
 */
function apply_cors(string $methods = 'POST, OPTIONS'): void
{
    apply_security_headers();

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (is_allowed_origin($origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }

    header('Access-Control-Allow-Methods: ' . $methods);
    header('Access-Control-Allow-Headers: Content-Type, X-Outreach-Secret, Accept, Origin');
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
