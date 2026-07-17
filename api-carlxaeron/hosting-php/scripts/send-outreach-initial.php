<?php

declare(strict_types=1);

/**
 * CLI fallback if Laravel outreach routes fail: php scripts/send-outreach-initial.php /path/to/body.json
 */

if ($argc < 2) {
    fwrite(STDERR, "Usage: php send-outreach-initial.php /path/to/body.json\n");
    exit(1);
}

$root = dirname(__DIR__);
$appRoot = dirname($root);

if (!function_exists('load_env')) {
    require_once $root . '/src/bootstrap.php';
}

// Laravel deploy: hosting-php/.env may be missing — load parent .env + map DB_* aliases.
if (!is_file($root . '/.env') && is_file($appRoot . '/.env')) {
    load_env($appRoot . '/.env');
}
if (!env('DB_NAME') && env('DB_DATABASE')) {
    putenv('DB_NAME=' . env('DB_DATABASE'));
    $_ENV['DB_NAME'] = env('DB_DATABASE');
}
if (!env('DB_USER') && env('DB_USERNAME')) {
    putenv('DB_USER=' . env('DB_USERNAME'));
    $_ENV['DB_USER'] = env('DB_USERNAME');
}
if (env('DB_PASS') === null && env('DB_PASSWORD') !== null) {
    putenv('DB_PASS=' . env('DB_PASSWORD'));
    $_ENV['DB_PASS'] = env('DB_PASSWORD');
}

$raw = file_get_contents($argv[1]);
$body = json_decode($raw !== false ? $raw : '', true);
if (!is_array($body)) {
    fwrite(STDERR, "Invalid JSON body file\n");
    exit(1);
}

outreach_require_secret($body);
outreach_ensure_table();

$slug = substr(trim((string) ($body['slug'] ?? '')), 0, 64);
$businessName = trim((string) ($body['businessName'] ?? ''));
$contactName = trim((string) ($body['contactName'] ?? ''));
$contactEmail = trim((string) ($body['contactEmail'] ?? ''));
$previewUrl = trim((string) ($body['previewUrl'] ?? ''));
$packageName = trim((string) ($body['packageName'] ?? ''));
$quotedAmount = trim((string) ($body['quotedAmount'] ?? ''));
$timeline = trim((string) ($body['timeline'] ?? ''));
$paymentTerms = trim((string) ($body['paymentTerms'] ?? ''));
if ($paymentTerms === '') {
    $paymentTerms = outreach_default_payment_terms();
}
$cadence = outreach_normalize_cadence((string) ($body['cadence'] ?? '3d1w'));
$sendInitial = !empty($body['sendInitial']);
$autoFollowUp = array_key_exists('autoFollowUp', $body) ? (bool) $body['autoFollowUp'] : true;
$maxFollowUps = max(0, min(8, (int) ($body['maxFollowUps'] ?? outreach_default_max_followups())));

if ($slug === '' || $businessName === '' || $contactName === '' || $contactEmail === '' || $previewUrl === '') {
    fwrite(STDERR, "Missing required fields\n");
    exit(1);
}
if (!filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Invalid contactEmail\n");
    exit(1);
}

$now = new DateTimeImmutable('now');
$initialSentAt = null;
$nextFollowUp = null;
$status = 'scheduled';

$job = [
    'contact_name' => $contactName,
    'business_name' => $businessName,
    'preview_url' => $previewUrl,
    'package_name' => $packageName,
    'quoted_amount' => $quotedAmount,
    'timeline' => $timeline,
    'payment_terms' => $paymentTerms,
    'contact_email' => $contactEmail,
    'cadence' => $cadence,
    'follow_up_count' => 0,
];

if ($sendInitial) {
    $result = outreach_send_to_prospect($job, 'initial');
    if (!$result['ok']) {
        fwrite(STDERR, 'Initial email failed: ' . ($result['error'] ?? 'unknown') . "\n");
        exit(1);
    }
    $initialSentAt = $now->format('Y-m-d H:i:s');
    $status = 'sent';
    if ($autoFollowUp && $maxFollowUps > 0) {
        $days = outreach_days_until_next($cadence, 0);
        $nextFollowUp = $now->modify("+{$days} days")->format('Y-m-d H:i:s');
    }
} elseif ($autoFollowUp && $maxFollowUps > 0) {
    $days = outreach_days_until_next($cadence, 0);
    $nextFollowUp = $now->modify("+{$days} days")->format('Y-m-d H:i:s');
    $status = 'waiting_followup';
}

$pdo = db();
$stmt = $pdo->prepare(
    'INSERT INTO outreach_jobs
    (slug, business_name, contact_name, contact_email, preview_url, package_name, quoted_amount, timeline,
     cadence, auto_followup, max_followups, follow_up_count, status, initial_sent_at, next_follow_up_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      business_name = VALUES(business_name),
      contact_name = VALUES(contact_name),
      preview_url = VALUES(preview_url),
      package_name = VALUES(package_name),
      quoted_amount = VALUES(quoted_amount),
      timeline = VALUES(timeline),
      cadence = VALUES(cadence),
      auto_followup = VALUES(auto_followup),
      max_followups = VALUES(max_followups),
      status = VALUES(status),
      initial_sent_at = COALESCE(VALUES(initial_sent_at), initial_sent_at),
      next_follow_up_at = VALUES(next_follow_up_at),
      last_error = NULL'
);
$stmt->execute([
    $slug,
    $businessName,
    $contactName,
    $contactEmail,
    $previewUrl,
    $packageName !== '' ? $packageName : null,
    $quotedAmount !== '' ? $quotedAmount : null,
    $timeline !== '' ? $timeline : null,
    $cadence,
    $autoFollowUp ? 1 : 0,
    $maxFollowUps,
    $status,
    $initialSentAt,
    $nextFollowUp,
]);

echo json_encode([
    'status' => 200,
    'message' => 'Outreach scheduled',
    'data' => [
        'slug' => $slug,
        'contactEmail' => $contactEmail,
        'sendInitial' => $sendInitial,
        'autoFollowUp' => $autoFollowUp,
        'cadence' => $cadence,
        'nextFollowUpAt' => $nextFollowUp,
        'status' => $status,
    ],
], JSON_UNESCAPED_SLASHES) . "\n";
