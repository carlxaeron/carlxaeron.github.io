<?php

declare(strict_types=1);

/**
 * Daily cron: auto-send due quotation follow-ups via Private Email SMTP.
 *
 * cPanel example (09:00 Asia/Manila):
 *   0 1 * * * /usr/local/bin/php /home/carlxaeron/public_html/api-carlxaeron/hosting-php/scripts/cron-outreach-followups.php
 *
 * (1:00 UTC ≈ 9:00 PH if server is UTC — adjust as needed)
 */

$root = dirname(__DIR__);
require_once $root . '/src/bootstrap.php';
require_once $root . '/src/outreach.php';

if (PHP_SAPI !== 'cli') {
    $key = $_GET['key'] ?? '';
    $expected = env('OUTREACH_SECRET');
    if (!$expected || !hash_equals($expected, (string) $key)) {
        http_response_code(403);
        echo "Forbidden\n";
        exit(1);
    }
}

$logDir = $root . '/storage';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

$started = date('c');
echo "[{$started}] outreach follow-up cron start\n";

try {
    $summary = outreach_process_due_followups();
    $line = sprintf(
        "[%s] processed=%d sent=%d errors=%d\n",
        date('c'),
        $summary['processed'],
        $summary['sent'],
        count($summary['errors'])
    );
    echo $line;
    foreach ($summary['errors'] as $e) {
        echo "  ERR: {$e}\n";
    }
    file_put_contents($logDir . '/outreach-cron.log', $line, FILE_APPEND);
    exit(count($summary['errors']) > 0 && $summary['sent'] === 0 ? 1 : 0);
} catch (Throwable $e) {
    $msg = '[' . date('c') . '] FATAL: ' . $e->getMessage() . "\n";
    echo $msg;
    file_put_contents($logDir . '/outreach-cron.log', $msg, FILE_APPEND);
    exit(1);
}
