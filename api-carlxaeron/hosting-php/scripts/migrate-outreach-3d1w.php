<?php
/**
 * One-shot: migrate all active outreach jobs to 3d → 1w sequence.
 * Run: php scripts/migrate-outreach-3d1w.php
 */
declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/src/bootstrap.php';
require_once $root . '/src/outreach.php';

outreach_ensure_table();
$pdo = db();

$rows = $pdo->query(
    "SELECT id, slug, contact_email, follow_up_count, max_followups, initial_sent_at, last_follow_up_at, status, auto_followup
     FROM outreach_jobs
     WHERE auto_followup = 1
       AND status IN ('sent', 'waiting_followup', 'followup_sent')
       AND follow_up_count < max_followups"
)->fetchAll();

$updated = 0;
$now = new DateTimeImmutable('now');

foreach ($rows as $row) {
    $count = (int) $row['follow_up_count'];
    if ($count === 0 && !empty($row['initial_sent_at'])) {
        $anchor = new DateTimeImmutable((string) $row['initial_sent_at']);
    } elseif ($count >= 1 && !empty($row['last_follow_up_at'])) {
        $anchor = new DateTimeImmutable((string) $row['last_follow_up_at']);
    } elseif (!empty($row['initial_sent_at'])) {
        $anchor = new DateTimeImmutable((string) $row['initial_sent_at']);
    } else {
        $anchor = $now;
    }

    $days = outreach_days_until_next('3d1w', $count);
    $next = $anchor->modify("+{$days} days");
    $nextStr = $next->format('Y-m-d H:i:s');

    $stmt = $pdo->prepare(
        "UPDATE outreach_jobs
         SET cadence = '3d1w',
             next_follow_up_at = ?,
             status = IF(status IN ('sent', 'followup_sent'), 'waiting_followup', status),
             last_error = NULL
         WHERE id = ?"
    );
    $stmt->execute([$nextStr, (int) $row['id']]);
    $updated++;
    echo sprintf(
        "id=%d %s <%s> count=%d next=%s (+%dd from %s)\n",
        (int) $row['id'],
        $row['slug'],
        $row['contact_email'],
        $count,
        $nextStr,
        $days,
        $anchor->format('Y-m-d H:i:s')
    );
}

echo "Updated {$updated} job(s) to cadence 3d1w.\n";
