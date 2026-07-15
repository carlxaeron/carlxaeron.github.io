<?php

declare(strict_types=1);

/**
 * Unit tests for outreach cadence / follow-up helpers.
 * No DB or SMTP — pure functions only.
 *
 * Run (required before deploying hosting-php outreach):
 *   php api-carlxaeron/hosting-php/tests/run-unit.php
 */

$root = dirname(__DIR__);
require_once $root . '/src/outreach.php';

$failed = 0;
$passed = 0;

function assert_true(bool $cond, string $msg): void
{
    global $failed, $passed;
    if ($cond) {
        $passed++;
        echo "  PASS  {$msg}\n";
        return;
    }
    $failed++;
    echo "  FAIL  {$msg}\n";
}

function assert_same(mixed $expected, mixed $actual, string $msg): void
{
    assert_true($expected === $actual, "{$msg} (expected " . var_export($expected, true) . ', got ' . var_export($actual, true) . ')');
}

echo "Outreach unit tests\n";

echo "\nnormalize cadence\n";
assert_same('3d1w', outreach_normalize_cadence(''), 'empty → 3d1w');
assert_same('3d1w', outreach_normalize_cadence('3d1w'), '3d1w stays');
assert_same('3d1w', outreach_normalize_cadence('seq'), 'seq → 3d1w');
assert_same('3d', outreach_normalize_cadence('3d'), 'legacy 3d');
assert_same('1w', outreach_normalize_cadence('1w'), 'legacy 1w');
assert_same('3d1w', outreach_normalize_cadence('3D1W'), 'case fold to 3d1w');

echo "\ndays until next (3d1w sequence: 3 → 7 → 7 → 7)\n";
assert_same(3, outreach_days_until_next('3d1w', 0), 'before 1st FU: 3d');
assert_same(7, outreach_days_until_next('3d1w', 1), 'before 2nd FU: 7d');
assert_same(7, outreach_days_until_next('3d1w', 2), 'before 3rd FU: 7d');
assert_same(7, outreach_days_until_next('3d1w', 3), 'before 4th FU: 7d');
assert_same(3, outreach_days_until_next('', 0), 'default cadence empty: 3d');
assert_same(7, outreach_days_until_next('', 1), 'default cadence after first: 7d');

echo "\nlegacy single cadences\n";
assert_same(3, outreach_days_until_next('3d', 0), 'legacy 3d interval');
assert_same(3, outreach_days_until_next('3d', 2), 'legacy 3d stays constant');
assert_same(7, outreach_days_until_next('1w', 0), 'legacy 1w interval');
assert_same(7, outreach_days_until_next('1w', 3), 'legacy 1w stays constant');

echo "\nmax follow-ups default\n";
assert_same(4, outreach_default_max_followups(), 'default max = 4');

echo "\npayment terms default\n";
$terms = outreach_default_payment_terms();
assert_true(str_contains($terms, '50% upfront'), 'mentions 50% upfront');
assert_true(str_contains($terms, 'not the full amount upfront'), 'clarifies not full upfront');
assert_same($terms, outreach_payment_terms([]), 'empty job uses default');
assert_same('Custom terms', outreach_payment_terms(['payment_terms' => 'Custom terms']), 'custom terms win');

echo "\nsequence length (max 4 retries)\n";
$delays = [];
for ($sent = 0; $sent < outreach_default_max_followups(); $sent++) {
    $delays[] = outreach_days_until_next('3d1w', $sent);
}
assert_same([3, 7, 7, 7], $delays, 'full sequence 3d→7d→7d→7d');

echo "\n";
if ($failed > 0) {
    echo "RESULT: {$failed} failed, {$passed} passed\n";
    exit(1);
}
echo "RESULT: {$passed} passed\n";
exit(0);
