<?php

namespace App\Services;

/**
 * Same salt / rules as Firebase analyticsExclusion.js and the legacy PHP API.
 */
final class AnalyticsExclusion
{
    private const IP_SALT = ':carlxaeron-portfolio';

    public function clientIp(): string
    {
        $forwarded = request()->header('X-Forwarded-For');
        if (is_string($forwarded) && $forwarded !== '') {
            return trim(explode(',', $forwarded)[0]);
        }

        return (string) request()->ip();
    }

    public function hashIp(?string $ip): ?string
    {
        if (!$ip) {
            return null;
        }

        return substr(hash('sha256', $ip . self::IP_SALT), 0, 16);
    }

    /** @return list<string> */
    public function parseList(?string $value): array
    {
        if (!$value) {
            return [];
        }

        $parts = array_map(
            static fn (string $e): string => strtolower(trim($e)),
            explode(',', $value)
        );

        return array_values(array_filter($parts, static fn (string $e): bool => $e !== ''));
    }

    public function isExcludedRequest(?string $visitorId = null): bool
    {
        return $this->isExcludedRecord($this->hashIp($this->clientIp()), $visitorId);
    }

    public function isExcludedRecord(?string $ipHash, ?string $visitorId): bool
    {
        $ipHashes = $this->parseList(config('portfolio.analytics_exclude_ip_hashes'));
        $visitorIds = $this->parseList(config('portfolio.analytics_exclude_visitor_ids'));

        if ($ipHash && in_array(strtolower($ipHash), $ipHashes, true)) {
            return true;
        }

        if ($visitorId && in_array(strtolower(trim($visitorId)), $visitorIds, true)) {
            return true;
        }

        return false;
    }

    public function parseDevice(?string $userAgent): string
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

    /** Public Insights slug mask — mirrors hosting-php mask_client_slug / frontend maskClientSlug. */
    public function maskClientSlug(?string $slug): string
    {
        $s = trim((string) $slug);
        $len = strlen($s);
        if ($len <= 4) {
            return str_repeat('*', max($len, 4));
        }

        return substr($s, 0, 2) . '****' . substr($s, -2);
    }
}
