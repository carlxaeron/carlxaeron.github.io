<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Mirrors hosting-php cors.php — allowlisted portfolio origins only.
 */
final class BrowserOriginGate
{
    /** @return list<string> */
    public static function allowedOrigins(): array
    {
        return [
            'https://carlxaeron.github.io',
            'https://carlmanuel.com',
            'https://www.carlmanuel.com',
            'http://localhost:3000',
        ];
    }

    public static function hasAllowedBrowserOrigin(?Request $request = null): bool
    {
        $request ??= request();

        $origin = self::normalizeOriginUrl($request->header('Origin'));
        if ($origin !== null && self::isAllowedOrigin($origin)) {
            return true;
        }

        $refererOrigin = self::normalizeOriginUrl($request->header('Referer'));

        return $refererOrigin !== null && self::isAllowedOrigin($refererOrigin);
    }

    public static function isAllowedOrigin(string $origin): bool
    {
        return in_array($origin, self::allowedOrigins(), true);
    }

    public static function normalizeOriginUrl(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        $parts = parse_url($value);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        $origin = strtolower($parts['scheme']).'://'.strtolower($parts['host']);
        if (isset($parts['port'])) {
            $origin .= ':'.(int) $parts['port'];
        }

        return $origin;
    }
}
