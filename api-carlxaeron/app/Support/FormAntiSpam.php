<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Lightweight bot checks for public Contact / Quote forms.
 * - Honeypot: bots fill hidden "website" field
 * - Time trap: reject submits faster than MIN_SECONDS after form open
 */
final class FormAntiSpam
{
    public const HONEYPOT_FIELD = 'website';

    public const MIN_SECONDS = 3;

    public const MAX_AGE_SECONDS = 86400; // 24h — discard stale/replayed timestamps

    /**
     * @return string|null Error message, or null if OK
     */
    public static function rejectReason(Request $request): ?string
    {
        $honeypot = trim((string) $request->input(self::HONEYPOT_FIELD, ''));
        if ($honeypot !== '') {
            return 'spam';
        }

        $openedRaw = $request->input('formOpenedAt');
        if ($openedRaw === null || $openedRaw === '') {
            return 'spam';
        }

        $openedAt = is_numeric($openedRaw) ? (float) $openedRaw : 0.0;
        // Accept seconds or milliseconds
        if ($openedAt > 1_000_000_000_000) {
            $openedAt = $openedAt / 1000;
        }

        $now = microtime(true);
        $elapsed = $now - $openedAt;

        if ($elapsed < self::MIN_SECONDS) {
            return 'spam';
        }

        if ($elapsed > self::MAX_AGE_SECONDS || $elapsed < 0) {
            return 'spam';
        }

        return null;
    }

    /**
     * Silent success for bots (do not reveal which check failed).
     */
    public static function silentOkMessage(string $kind): string
    {
        return $kind === 'quotation'
            ? 'Quote request received'
            : 'Contact request received';
    }
}
