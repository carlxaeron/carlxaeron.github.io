<?php

declare(strict_types=1);

/**
 * DEPRECATED wrapper — follow-ups now run via Laravel Artisan:
 *
 *   cd /home/carlxaeron/public_html/api-carlxaeron && /usr/local/bin/php artisan outreach:followups
 *
 * This script shells out to artisan so old crontab entries keep working.
 *
 * Preferred crontab (UTC ~09:00 PH):
 *   0 1 * * * cd /home/carlxaeron/public_html/api-carlxaeron && /usr/local/bin/php artisan outreach:followups >> /home/carlxaeron/public_html/api-carlxaeron/storage/logs/outreach-cron.log 2>&1
 */

$laravelRoot = dirname(__DIR__, 2);
$artisan = $laravelRoot . '/artisan';
$php = '/usr/local/bin/php';
if (!is_file($php)) {
    $php = PHP_BINARY ?: 'php';
}

if (!is_file($artisan)) {
    fwrite(STDERR, "artisan not found at {$artisan}\n");
    exit(1);
}

$logDir = $laravelRoot . '/storage/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

$started = date('c');
echo "[{$started}] deprecated hosting-php cron → artisan outreach:followups\n";

$cmd = escapeshellarg($php) . ' ' . escapeshellarg($artisan) . ' outreach:followups';
passthru($cmd, $exitCode);
exit($exitCode);
