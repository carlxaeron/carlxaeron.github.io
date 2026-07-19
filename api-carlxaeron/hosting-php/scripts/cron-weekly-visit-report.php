<?php

declare(strict_types=1);

/**
 * Weekly visit report cron — Monday 08:00 Asia/Manila (set TZ in crontab or server).
 *
 * cPanel:
 *   0 8 * * 1 /usr/local/bin/php /home/carlxaeron/public_html/api-carlxaeron/hosting-php/scripts/cron-weekly-visit-report.php >> /home/carlxaeron/public_html/api-carlxaeron/storage/weekly-report-cron.log 2>&1
 *
 * Force resend: append --force (CLI) or ?force=1&key=SECRET (HTTP)
 */

$root = dirname(__DIR__);
require_once $root . '/src/bootstrap.php';
require_once $root . '/src/weekly_report.php';

if (PHP_SAPI !== 'cli') {
    $key = $_GET['key'] ?? '';
    $expected = env('CRON_SECRET') ?: env('OUTREACH_SECRET');
    if (!$expected || !hash_equals($expected, (string) $key)) {
        http_response_code(403);
        echo "Forbidden\n";
        exit(1);
    }
}

$force = false;
if (PHP_SAPI === 'cli') {
    $force = in_array('--force', $argv ?? [], true);
} else {
    $force = !empty($_GET['force']);
}

$logDir = $root . '/storage';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

$started = date('c');
echo "[{$started}] weekly visit report cron start force=" . ($force ? '1' : '0') . "\n";

try {
    $result = weekly_report_run($force);
    if (!empty($result['skipped'])) {
        $line = '[' . date('c') . '] skipped already-sent reportId=' . ($result['reportId'] ?? '') . "\n";
        echo $line;
        file_put_contents($logDir . '/weekly-report-cron.log', $line, FILE_APPEND);
        exit(0);
    }
    if (empty($result['ok'])) {
        $line = '[' . date('c') . '] FATAL: ' . ($result['error'] ?? 'unknown') . "\n";
        echo $line;
        file_put_contents($logDir . '/weekly-report-cron.log', $line, FILE_APPEND);
        exit(1);
    }
    $line = '[' . date('c') . '] sent reportId=' . ($result['reportId'] ?? '') . "\n";
    echo $line;
    file_put_contents($logDir . '/weekly-report-cron.log', $line, FILE_APPEND);
    exit(0);
} catch (Throwable $e) {
    $msg = '[' . date('c') . '] FATAL: ' . $e->getMessage() . "\n";
    echo $msg;
    file_put_contents($logDir . '/weekly-report-cron.log', $msg, FILE_APPEND);
    exit(1);
}
