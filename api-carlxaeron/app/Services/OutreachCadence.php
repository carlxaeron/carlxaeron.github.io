<?php

namespace App\Services;

/**
 * Outreach cadence + discount helpers (mirrors hosting-php/src/outreach.php).
 */
final class OutreachCadence
{
    public static function normalize(string $cadence): string
    {
        $c = strtolower(trim($cadence));
        if ($c === '3d' || $c === '1w') {
            return $c;
        }

        return '3d1w';
    }

    public static function daysUntilNext(string $cadence, int $followUpsAlreadySent): int
    {
        $cadence = self::normalize($cadence);
        if ($cadence === '3d1w') {
            return $followUpsAlreadySent === 0 ? 3 : 7;
        }

        return $cadence === '3d' ? 3 : 7;
    }

    public static function defaultMaxFollowups(): int
    {
        return 4;
    }

    public static function defaultPaymentTerms(): string
    {
        return '50% upfront to begin · 50% on delivery (not the full amount upfront)';
    }

    /** @param array<string, mixed> $job */
    public static function paymentTerms(array $job): string
    {
        $terms = trim((string) ($job['payment_terms'] ?? ''));

        return $terms !== '' ? $terms : self::defaultPaymentTerms();
    }

    /** @return list<int> */
    public static function followupDiscountSteps(): array
    {
        return [10, 10, 10, 20];
    }

    public static function followupDiscountStep(int $followUpsAlreadySent): int
    {
        $steps = self::followupDiscountSteps();

        return $steps[$followUpsAlreadySent] ?? 0;
    }

    public static function followupDiscountTotal(int $followUpsAlreadySent): int
    {
        $steps = self::followupDiscountSteps();
        $total = 0;
        $upto = min($followUpsAlreadySent + 1, count($steps));
        for ($i = 0; $i < $upto; $i++) {
            $total += $steps[$i];
        }

        return min(50, $total);
    }

    public static function parseAmountPesos(string $amount): ?int
    {
        if (! preg_match('/(\d[\d,]*)/', $amount, $m)) {
            return null;
        }

        return (int) str_replace(',', '', $m[1]);
    }

    public static function formatPesos(int $n): string
    {
        return '₱'.number_format($n);
    }

    /**
     * Structured discount/commission facts for Blade follow-up templates.
     *
     * @param  array<string, mixed>  $job
     * @return array{totalPct:int,stepPct:int,discounted:?string,amountRaw:string,showAnotherStep:bool}
     */
    public static function followupOfferData(array $job, int $followUpsAlreadySent): array
    {
        $stepPct = self::followupDiscountStep($followUpsAlreadySent);
        $totalPct = self::followupDiscountTotal($followUpsAlreadySent);
        $amountRaw = trim((string) ($job['quoted_amount'] ?? ''));
        $pesos = $amountRaw !== '' ? self::parseAmountPesos($amountRaw) : null;
        $discounted = null;
        if ($pesos !== null && $totalPct > 0) {
            $discounted = self::formatPesos((int) round($pesos * (100 - $totalPct) / 100));
        }

        return [
            'totalPct' => $totalPct,
            'stepPct' => $stepPct,
            'discounted' => $discounted,
            'amountRaw' => $amountRaw,
            'showAnotherStep' => $stepPct > 0 && $followUpsAlreadySent > 0,
        ];
    }
}
