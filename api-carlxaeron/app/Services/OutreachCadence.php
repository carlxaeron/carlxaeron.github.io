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
     * @param  array<string, mixed>  $job
     * @return array{html:string,text:string,totalPct:int,stepPct:int,discounted:?string}
     */
    public static function followupOfferCopy(array $job, int $followUpsAlreadySent): array
    {
        $stepPct = self::followupDiscountStep($followUpsAlreadySent);
        $totalPct = self::followupDiscountTotal($followUpsAlreadySent);
        $amountRaw = trim((string) ($job['quoted_amount'] ?? ''));
        $pesos = $amountRaw !== '' ? self::parseAmountPesos($amountRaw) : null;
        $discounted = null;
        if ($pesos !== null && $totalPct > 0) {
            $discounted = self::formatPesos((int) round($pesos * (100 - $totalPct) / 100));
        }

        $priceHtml = '';
        $priceText = '';
        if ($totalPct > 0) {
            $priceHtml = 'This check-in includes a <strong>'.e((string) $totalPct).'% discount</strong>'
                .($stepPct > 0 && $followUpsAlreadySent > 0
                    ? ' (another <strong>'.e((string) $stepPct).'%</strong> off)'
                    : '')
                .' from the original package'
                .($amountRaw !== '' ? ' of '.e($amountRaw) : '')
                .($discounted !== null ? ' — now <strong>'.e($discounted).'</strong> total' : '')
                .'. Maximum goodwill discount is 50% off.';
            $priceText = "This check-in includes a {$totalPct}% discount"
                .($stepPct > 0 && $followUpsAlreadySent > 0 ? " (another {$stepPct}% off)" : '')
                .' from the original package'
                .($amountRaw !== '' ? " of {$amountRaw}" : '')
                .($discounted !== null ? " — now {$discounted} total" : '')
                .'. Maximum goodwill discount is 50% off.';
        }

        $commissionHtml = 'I can also offer a <strong>commission</strong> if you refer clients or want a partner arrangement — '
            .'just message me and we can discuss a fair split.';
        $commissionText = 'I can also offer a commission if you refer clients or want a partner arrangement — '
            .'just message me and we can discuss a fair split.';

        $html = ($priceHtml !== '' ? '<p>'.$priceHtml.'</p>' : '')
            .'<p>'.$commissionHtml.'</p>';
        $text = ($priceText !== '' ? $priceText."\n\n" : '')
            .$commissionText;

        return [
            'html' => $html,
            'text' => $text,
            'totalPct' => $totalPct,
            'stepPct' => $stepPct,
            'discounted' => $discounted,
        ];
    }
}
