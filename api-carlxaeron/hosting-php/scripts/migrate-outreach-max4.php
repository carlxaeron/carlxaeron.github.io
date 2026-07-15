<?php
/**
 * Bump all outreach jobs to max 4 follow-ups (3d → 7d → 7d → 7d).
 * Reopen completed jobs that still have remaining retries.
 */
declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/src/bootstrap.php';
require_once $root . '/src/outreach.php';

outreach_ensure_table();
$pdo = db();
$max = outreach_default_max_followups(); // 4
$now = new DateTimeImmutable('now');

$rows = $pdo->query(
    "SELECT id, slug, contact_email, follow_up_count, max_followups, status,
            auto_followup, initial_sent_at, last_follow_up_at, next_follow_up_at, cadence
     FROM outreach_jobs
     WHERE auto_followup = 1
       AND status NOT IN ('paused', 'won', 'lost')"
)->fetchAll();

$updated = 0;
foreach ($rows as $row) {
    $count = (int) $row['follow_up_count'];
    $id = (int) $row['id'];

    if ($count >= $max) {
        $stmt = $pdo->prepare(
            "UPDATE outreach_jobs SET cadence = '3d1w', max_followups = ?, status = 'completed', next_follow_up_at = NULL WHERE id = ?"
        );
        $stmt->execute([$max, $id]);
        echo "id={$id} {$row['slug']} already at/over max — marked completed\n";
        $updated++;
        continue;
    }

    // Keep existing next if still in future and awaiting; otherwise recompute
    $nextStr = null;
    $status = (string) $row['status'];
    if ($status === 'completed' || empty($row['next_follow_up_at'])) {
        if ($count === 0 && !empty($row['initial_sent_at'])) {
            $anchor = new DateTimeImmutable((string) $row['initial_sent_at']);
        } elseif (!empty($row['last_follow_up_at'])) {
            $anchor = new DateTimeImmutable((string) $row['last_follow_up_at']);
        } elseif (!empty($row['initial_sent_at'])) {
            $anchor = new DateTimeImmutable((string) $row['initial_sent_at']);
        } else {
            $anchor = $now;
        }
        $days = outreach_days_until_next('3d1w', $count);
        $nextStr = $anchor->modify("+{$days} days")->format('Y-m-d H:i:s');
        $status = 'waiting_followup';
    } else {
        $nextStr = (string) $row['next_follow_up_at'];
        if (in_array($status, ['sent', 'followup_sent', 'completed'], true)) {
            $status = 'waiting_followup';
        }
    }

    $stmt = $pdo->prepare(
        "UPDATE outreach_jobs
         SET cadence = '3d1w', max_followups = ?, next_follow_up_at = ?, status = ?, last_error = NULL
         WHERE id = ?"
    );
    $stmt->execute([$max, $nextStr, $status, $id]);
    $updated++;
    echo sprintf(
        "id=%d %s <%s> count=%d/%d next=%s status=%s\n",
        $id,
        $row['slug'],
        $row['contact_email'],
        $count,
        $max,
        $nextStr,
        $status
    );
}

echo "Updated {$updated} job(s) to max_followups={$max} (3d→7d×3).\n";
