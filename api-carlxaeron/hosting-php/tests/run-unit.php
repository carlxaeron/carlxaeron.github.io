<?php

declare(strict_types=1);

/**
 * Unit tests for outreach cadence, mail helpers, CORS allowlist, browser origin gate,
 * slug masking, rate limit.
 * No DB or SMTP — pure / file-local only.
 *
 * Run (required before deploying hosting-php):
 *   php api-carlxaeron/hosting-php/tests/run-unit.php
 */

$root = dirname(__DIR__);

if (!function_exists('env')) {
    function env(string $key, ?string $default = null): ?string
    {
        return $default;
    }
}

require_once $root . '/src/cors.php';
require_once $root . '/src/rate_limit.php';
require_once $root . '/src/analytics.php';
require_once $root . '/src/mail.php';
require_once $root . '/src/outreach.php';
require_once $root . '/src/assistant.php';
require_once $root . '/src/weekly_report.php';

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

echo "\nfollow-up discount stack (10 → 20 → 30 → 50)\n";
assert_same([10, 10, 10, 20], outreach_followup_discount_steps(), 'step ladder');
assert_same(10, outreach_followup_discount_step(0), '3d FU step 10%');
assert_same(10, outreach_followup_discount_step(1), '1st 7d step 10%');
assert_same(10, outreach_followup_discount_step(2), '2nd 7d step 10%');
assert_same(20, outreach_followup_discount_step(3), '3rd 7d step 20%');
assert_same(10, outreach_followup_discount_total(0), 'after 3d total 10%');
assert_same(20, outreach_followup_discount_total(1), 'after 1st 7d total 20%');
assert_same(30, outreach_followup_discount_total(2), 'after 2nd 7d total 30%');
assert_same(50, outreach_followup_discount_total(3), 'after 3rd 7d total 50%');
assert_same(15000, outreach_parse_amount_pesos('₱15,000'), 'parse ₱15,000');
assert_same('₱13,500', outreach_format_pesos(13500), 'format 10% off 15k');
$offer3d = outreach_followup_offer_copy([
    'quoted_amount' => '₱15,000',
], 0);
assert_same(10, $offer3d['totalPct'], '3d offer totalPct');
assert_same('₱13,500', $offer3d['discounted'], '3d discounted amount');
assert_true(str_contains($offer3d['text'], 'commission'), '3d offers commission');
assert_true(str_contains($offer3d['text'], '10%'), '3d mentions 10%');
$offerLast = outreach_followup_offer_copy(['quoted_amount' => '₱15,000'], 3);
assert_same(50, $offerLast['totalPct'], 'last FU total 50%');
assert_same('₱7,500', $offerLast['discounted'], '50% of 15k');
[$fuSubject, $fuHtml, $fuText] = outreach_build_followup_email([
    'contact_name' => 'Test',
    'business_name' => 'Demo Biz',
    'preview_url' => 'https://carlmanuel.com/?preview=demo',
    'package_name' => 'Starter Business Website',
    'quoted_amount' => '₱15,000',
    'payment_terms' => '',
    'follow_up_count' => 0,
]);
assert_true(str_contains($fuSubject, '10%'), '3d subject has discount');
assert_true(str_contains($fuHtml, 'commission'), '3d HTML has commission');
assert_true(str_contains($fuHtml, '61557195950694'), '3d HTML has Facebook link');
assert_true(str_contains($fuHtml, 'tel:+639625389886'), '3d HTML has phone link');
assert_true(str_contains($fuText, '₱13,500'), '3d text has discounted price');
assert_true(str_contains($fuText, '+63 962 538 9886'), '3d text has phone');
assert_true(str_contains($fuText, '61557195950694'), '3d text has Facebook link');

echo "\ninitial + follow-up systems-first copy\n";
[$initSubject, $initHtml, $initText] = outreach_build_initial_email([
    'contact_name' => 'Test',
    'business_name' => 'Demo Biz',
    'preview_url' => 'https://carlmanuel.com/?preview=demo',
    'package_name' => 'Starter Business Website',
    'quoted_amount' => '₱15,000',
    'payment_terms' => '',
    'timeline' => '5–7 days',
]);
assert_true(str_contains(strtolower($initSubject), 'admin'), 'initial subject mentions admin');
assert_true(str_contains($initHtml, '/admin/'), 'initial HTML has admin path');
assert_true(str_contains(strtolower($initHtml), 'site and admin'), 'initial HTML mentions site + admin');
assert_true(str_contains($initHtml, 'tel:+639625389886'), 'initial HTML has phone link');
assert_true(str_contains($initText, '+63 962 538 9886'), 'initial text has phone');
assert_true(str_contains(strtolower($initText), 'admin'), 'initial text mentions admin');
[, $initLabelHtml, $initLabelText] = outreach_build_initial_email([
    'contact_name' => 'Test',
    'business_name' => 'Demo Biz',
    'preview_url' => 'https://carlmanuel.com/?preview=demo',
    'package_name' => 'Starter',
    'quoted_amount' => '',
    'payment_terms' => '',
    'timeline' => '',
    'system_label' => 'Booking & calendar admin',
]);
assert_true(str_contains($initLabelText, 'Booking & calendar admin'), 'initial uses systemLabel');
assert_true(str_contains($initLabelHtml, 'Booking'), 'initial HTML includes system label');
assert_true(str_contains(strtolower($fuHtml), 'site and admin'), '3d HTML mentions site + admin');

echo "\nMail header helpers\n";
assert_same('info@carlmanuel.com', mail_bare_address('info@carlmanuel.com'), 'bare stays bare');
assert_same('info@carlmanuel.com', mail_bare_address('"Carl Louis Manuel" <info@carlmanuel.com>'), 'strip display name');
assert_same('info@carlmanuel.com', mail_bare_address('  <info@carlmanuel.com>  '), 'strip brackets + trim');
assert_same('info@carlmanuel.com', mail_format_mailbox('info@carlmanuel.com', null), 'format no name');
assert_same('info@carlmanuel.com', mail_format_mailbox('info@carlmanuel.com', ''), 'format empty name');
assert_same('"Carl Louis Manuel" <info@carlmanuel.com>', mail_format_mailbox('info@carlmanuel.com', 'Carl Louis Manuel'), 'format with name');
assert_same('"Quote \\"Me\\"" <a@b.c>', mail_format_mailbox('a@b.c', 'Quote "Me"'), 'escape quotes in name');
$mid = mail_message_id('carlmanuel.com');
assert_true((bool) preg_match('/^<[0-9a-f]+\.[0-9a-f]+@carlmanuel\.com>$/', $mid), 'Message-ID shape');

echo "\nCORS allowlist (no * fallback)\n";
assert_true(is_allowed_origin('https://carlmanuel.com'), 'portfolio origin allowed');
assert_true(is_allowed_origin('http://localhost:3000'), 'local origin allowed');
assert_true(!is_allowed_origin('https://evil.example'), 'unknown origin denied');
assert_true(!is_allowed_origin(''), 'empty origin not allowlisted');
assert_true(!in_array('*', allowed_origins(), true), 'allowlist has no wildcard');
$corsSrc = file_get_contents($root . '/src/cors.php') ?: '';
assert_true(!str_contains($corsSrc, "Access-Control-Allow-Origin: *"), 'cors.php must not set ACAO *');
assert_true(str_contains($corsSrc, 'X-Outreach-Secret'), 'preflight allows X-Outreach-Secret');
assert_true(str_contains($corsSrc, 'require_browser_origin'), 'cors.php defines require_browser_origin');

echo "\nbrowser origin / referer gate\n";
assert_same('https://carlmanuel.com', normalize_origin_url('https://carlmanuel.com/insights'), 'normalize strips path');
assert_same('http://localhost:3000', normalize_origin_url('http://localhost:3000/#quote'), 'normalize keeps port');
$prevOrigin = $_SERVER['HTTP_ORIGIN'] ?? null;
$prevReferer = $_SERVER['HTTP_REFERER'] ?? null;
unset($_SERVER['HTTP_ORIGIN'], $_SERVER['HTTP_REFERER']);
assert_true(!request_has_allowed_browser_origin(), 'no origin/referer → denied');
$_SERVER['HTTP_ORIGIN'] = 'https://evil.example';
assert_true(!request_has_allowed_browser_origin(), 'evil Origin denied');
$_SERVER['HTTP_ORIGIN'] = 'https://carlmanuel.com';
assert_true(request_has_allowed_browser_origin(), 'portfolio Origin allowed');
unset($_SERVER['HTTP_ORIGIN']);
$_SERVER['HTTP_REFERER'] = 'https://www.carlmanuel.com/some/path';
assert_true(request_has_allowed_browser_origin(), 'portfolio Referer allowed');
$_SERVER['HTTP_REFERER'] = 'https://evil.example/page';
assert_true(!request_has_allowed_browser_origin(), 'evil Referer denied');
if ($prevOrigin !== null) {
    $_SERVER['HTTP_ORIGIN'] = $prevOrigin;
} else {
    unset($_SERVER['HTTP_ORIGIN']);
}
if ($prevReferer !== null) {
    $_SERVER['HTTP_REFERER'] = $prevReferer;
} else {
    unset($_SERVER['HTTP_REFERER']);
}
$handlersSrc = file_get_contents($root . '/routes/handlers.php') ?: '';
assert_true(substr_count($handlersSrc, 'require_browser_origin()') >= 5, 'public data routes require browser origin (except health)');
assert_true(str_contains($handlersSrc, 'mask_client_slug'), 'analyticsSummary masks preview slugs');
assert_true(!preg_match('/function route_health\(\): void\s*\{[^}]*require_browser_origin/', $handlersSrc), 'health stays open without browser origin gate');

echo "\nmask_client_slug\n";
assert_same('g3****ad', mask_client_slug('g3k-cad'), 'g3k-cad → g3****ad');
assert_same('jk****on', mask_client_slug('jk-construction'), 'jk-construction → jk****on');
assert_same('ku****an', mask_client_slug('kubling-tahanan'), 'kubling-tahanan → ku****an');
assert_same('****', mask_client_slug('ab'), 'short slug fully masked');
assert_same('****', mask_client_slug('abcd'), 'len 4 fully masked');

echo "\nRate limit (temp dir)\n";
$tmpdir = sys_get_temp_dir() . '/api-rl-' . bin2hex(random_bytes(4));
assert_true(rate_limit_check('t', 2, 60, '1.2.3.4', $tmpdir), '1st allow');
assert_true(rate_limit_check('t', 2, 60, '1.2.3.4', $tmpdir), '2nd allow');
assert_true(!rate_limit_check('t', 2, 60, '1.2.3.4', $tmpdir), '3rd blocked');
assert_true(rate_limit_check('t', 2, 60, '9.9.9.9', $tmpdir), 'other IP still allowed');
assert_same([8, 3600], rate_limit_config('contact'), 'contact default 8/hour');
assert_same([120, 60], rate_limit_config('trackVisit'), 'trackVisit default 120/min');
assert_same([30, 3600], rate_limit_config('assistant'), 'assistant default 30/hour');
foreach (glob($tmpdir . '/*') ?: [] as $f) {
    @unlink($f);
}
@rmdir($tmpdir);

echo "\nAssistant helpers\n";
$ctx = assistant_load_context();
assert_true(isset($ctx['SKILLS']) && is_array($ctx['SKILLS']), 'context has SKILLS');
assert_true(isset($ctx['COMPANIES']) && is_array($ctx['COMPANIES']), 'context has COMPANIES');
$prompt = assistant_system_prompt($ctx);
assert_true(str_contains($prompt, 'Carl Louis Manuel'), 'system prompt names Carl');
$norm = assistant_normalize_messages([
    ['role' => 'user', 'content' => 'Hello'],
    ['role' => 'bad', 'content' => 'x'],
    ['role' => 'assistant', 'content' => ''],
]);
assert_same(1, count($norm), 'normalizes one valid message');
assert_same('user', $norm[0]['role'], 'role preserved');
$indexSrc = file_get_contents($root . '/public/index.php') ?: '';
assert_true(str_contains($indexSrc, "case '/assistant'"), 'index routes /assistant');

echo "\nWeekly report helpers\n";
$map = [];
weekly_report_inc($map, 'home');
weekly_report_inc($map, 'home');
weekly_report_inc($map, 'about');
$top = weekly_report_top($map, 8);
assert_same([['home', 2], ['about', 1]], $top, 'top sorts by count');
$mail = weekly_report_build_mail([
    'weekLabel' => '2026-07-08 → 2026-07-15',
    'totalEvents' => 10,
    'pageViews' => 4,
    'sectionViews' => 3,
    'previewViews' => 3,
    'uniqueVisitors' => 2,
    'uniqueSessions' => 2,
    'totalLikes' => 1,
    'totalDislikes' => 0,
    'topSections' => [['home', 2]],
    'topPreviews' => [['jk-construction', 3]],
    'topReferrers' => [['Direct / none', 5]],
    'devices' => [['Desktop', 4]],
]);
assert_true(str_contains($mail['subject'], 'Weekly portfolio visit report'), 'mail subject');
assert_true(str_contains($mail['html'], 'jk-construction'), 'admin mail keeps raw slug');
assert_true(str_contains($mail['text'], 'jk-construction'), 'text keeps raw slug');
assert_same('info@carlmanuel.com', $mail['replyTo'], 'reply-to');

echo "\nQuote currency helper\n";
assert_same(null, normalize_quote_currency(''), 'empty → null');
assert_same('USD', normalize_quote_currency('usd'), 'usd → USD');
assert_same('PHP', normalize_quote_currency('PHP'), 'PHP stays');
assert_same(null, normalize_quote_currency('EUR'), 'unsupported → null');

echo "\n";
if ($failed > 0) {
    echo "RESULT: {$failed} failed, {$passed} passed\n";
    exit(1);
}
echo "RESULT: {$passed} passed\n";
exit(0);
