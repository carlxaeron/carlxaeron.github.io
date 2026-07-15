<?php

declare(strict_types=1);

/**
 * Weekly portfolio visit report — MySQL visits/preview_feedback + Private Email SMTP.
 */

function weekly_report_recipients(): string
{
    return env('WEEKLY_REPORT_TO', 'info@carlmanuel.com,carllouismanuel09@gmail.com')
        ?? 'info@carlmanuel.com,carllouismanuel09@gmail.com';
}

function weekly_report_ensure_table(): void
{
    db()->exec(
        "CREATE TABLE IF NOT EXISTS analytics_reports (
          report_id VARCHAR(32) NOT NULL PRIMARY KEY,
          sent_at DATETIME NOT NULL,
          stats_json LONGTEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

/**
 * @return array{weekLabel:string,weekStart:string,totalEvents:int,pageViews:int,sectionViews:int,previewViews:int,uniqueVisitors:int,uniqueSessions:int,totalLikes:int,totalDislikes:int,topSections:list<array{0:string,1:int}>,topPreviews:list<array{0:string,1:int}>,topReferrers:list<array{0:string,1:int}>,devices:list<array{0:string,1:int}>}
 */
function weekly_report_aggregate(?DateTimeImmutable $now = null, int $days = 7): array
{
    $now = $now ?? new DateTimeImmutable('now');
    $weekAgo = $now->modify("-{$days} days");
    $weekStart = $weekAgo->format('Y-m-d');
    $weekLabel = $weekAgo->format('Y-m-d') . ' → ' . $now->format('Y-m-d');

    $pdo = db();
    $from = $weekAgo->format('Y-m-d H:i:s');
    $to = $now->format('Y-m-d H:i:s');

    $stmt = $pdo->prepare(
        'SELECT visitor_id, session_id, event_type, section, preview_slug, referrer, device, ip_hash, created_at
         FROM visits
         WHERE created_at >= ? AND created_at < ?'
    );
    $stmt->execute([$from, $to]);
    $rows = $stmt->fetchAll();

    $visitors = [];
    $sessions = [];
    $topSections = [];
    $topPreviews = [];
    $topReferrers = [];
    $devices = [];
    $pageViews = 0;
    $sectionViews = 0;
    $previewViews = 0;
    $totalEvents = 0;

    foreach ($rows as $row) {
        if (is_excluded_record($row['ip_hash'] ?? null, $row['visitor_id'] ?? null)) {
            continue;
        }
        $totalEvents++;
        if (!empty($row['visitor_id'])) {
            $visitors[$row['visitor_id']] = true;
        }
        if (!empty($row['session_id'])) {
            $sessions[$row['session_id']] = true;
        }
        $type = (string) ($row['event_type'] ?? '');
        if ($type === 'pageview') {
            $pageViews++;
        }
        if ($type === 'section_view') {
            $sectionViews++;
        }
        if ($type === 'preview_view') {
            $previewViews++;
        }
        weekly_report_inc($topSections, (string) ($row['section'] ?? ''));
        weekly_report_inc($topPreviews, (string) ($row['preview_slug'] ?? ''));
        weekly_report_inc($topReferrers, (string) (($row['referrer'] ?? '') !== '' ? $row['referrer'] : 'Direct / none'));
        weekly_report_inc($devices, (string) (($row['device'] ?? '') !== '' ? $row['device'] : 'Unknown'));
    }

    // Feedback in window when created_at exists; else all-time window filter by id absence → use created_at if column exists
    $totalLikes = 0;
    $totalDislikes = 0;
    try {
        $fb = $pdo->prepare(
            'SELECT visitor_id, sentiment, ip_hash FROM preview_feedback
             WHERE created_at >= ? AND created_at < ?'
        );
        $fb->execute([$from, $to]);
        foreach ($fb->fetchAll() as $row) {
            if (is_excluded_record($row['ip_hash'] ?? null, $row['visitor_id'] ?? null)) {
                continue;
            }
            if (($row['sentiment'] ?? '') === 'like') {
                $totalLikes++;
            }
            if (($row['sentiment'] ?? '') === 'dislike') {
                $totalDislikes++;
            }
        }
    } catch (Throwable $e) {
        // Older schemas without created_at on feedback — skip dated feedback.
        error_log('weekly_report feedback query: ' . $e->getMessage());
    }

    return [
        'weekLabel' => $weekLabel,
        'weekStart' => $weekStart,
        'totalEvents' => $totalEvents,
        'pageViews' => $pageViews,
        'sectionViews' => $sectionViews,
        'previewViews' => $previewViews,
        'uniqueVisitors' => count($visitors),
        'uniqueSessions' => count($sessions),
        'totalLikes' => $totalLikes,
        'totalDislikes' => $totalDislikes,
        'topSections' => weekly_report_top($topSections),
        'topPreviews' => weekly_report_top($topPreviews),
        'topReferrers' => weekly_report_top($topReferrers),
        'devices' => weekly_report_top($devices),
    ];
}

/** @param array<string,int> $map */
function weekly_report_inc(array &$map, string $key): void
{
    $key = $key !== '' ? $key : '—';
    $map[$key] = ($map[$key] ?? 0) + 1;
}

/**
 * @param array<string,int> $map
 * @return list<array{0:string,1:int}>
 */
function weekly_report_top(array $map, int $limit = 8): array
{
    arsort($map, SORT_NUMERIC);
    $out = [];
    $i = 0;
    foreach ($map as $k => $v) {
        $out[] = [$k, $v];
        if (++$i >= $limit) {
            break;
        }
    }
    return $out;
}

/** @param list<array{0:string,1:int}> $entries */
function weekly_report_format_list(array $entries): string
{
    if ($entries === []) {
        return '<li>No data yet</li>';
    }
    $html = '';
    foreach ($entries as [$label, $count]) {
        $html .= '<li><strong>' . h((string) $label) . '</strong> — ' . (int) $count . '</li>';
    }
    return $html;
}

/**
 * @param array<string,mixed> $stats
 * @return array{subject:string,html:string,text:string,replyTo:string}
 */
function weekly_report_build_mail(array $stats): array
{
    $weekLabel = (string) ($stats['weekLabel'] ?? '');
    $subject = "Weekly portfolio visit report — {$weekLabel}";
    $html = '<h2>Portfolio weekly visit report</h2>'
        . '<p><strong>Period:</strong> ' . h($weekLabel) . '</p>'
        . '<ul>'
        . '<li><strong>Total events:</strong> ' . (int) ($stats['totalEvents'] ?? 0) . '</li>'
        . '<li><strong>Page views:</strong> ' . (int) ($stats['pageViews'] ?? 0) . '</li>'
        . '<li><strong>Section views:</strong> ' . (int) ($stats['sectionViews'] ?? 0) . '</li>'
        . '<li><strong>Preview views:</strong> ' . (int) ($stats['previewViews'] ?? 0) . '</li>'
        . '<li><strong>Unique visitors:</strong> ' . (int) ($stats['uniqueVisitors'] ?? 0) . '</li>'
        . '<li><strong>Unique sessions:</strong> ' . (int) ($stats['uniqueSessions'] ?? 0) . '</li>'
        . '<li><strong>Preview likes:</strong> ' . (int) ($stats['totalLikes'] ?? 0) . '</li>'
        . '<li><strong>Preview dislikes:</strong> ' . (int) ($stats['totalDislikes'] ?? 0) . '</li>'
        . '</ul>'
        . '<h3>Top sections</h3><ul>' . weekly_report_format_list($stats['topSections'] ?? []) . '</ul>'
        . '<h3>Top preview slugs</h3><ul>' . weekly_report_format_list($stats['topPreviews'] ?? []) . '</ul>'
        . '<h3>Top referrers</h3><ul>' . weekly_report_format_list($stats['topReferrers'] ?? []) . '</ul>'
        . '<h3>Devices</h3><ul>' . weekly_report_format_list($stats['devices'] ?? []) . '</ul>'
        . '<p style="margin-top:24px;color:#666;font-size:12px;">Excluded owner IPs and visitor IDs are omitted from reports.</p>';

    $textLines = [
        'Portfolio weekly visit report',
        '',
        'Period: ' . $weekLabel,
        'Total events: ' . (int) ($stats['totalEvents'] ?? 0),
        'Preview likes: ' . (int) ($stats['totalLikes'] ?? 0),
        'Preview dislikes: ' . (int) ($stats['totalDislikes'] ?? 0),
        '',
        'Top preview slugs:',
    ];
    foreach ($stats['topPreviews'] ?? [] as [$k, $v]) {
        $textLines[] = "- {$k}: {$v}";
    }

    return [
        'subject' => $subject,
        'html' => $html,
        'text' => implode("\n", $textLines),
        'replyTo' => 'info@carlmanuel.com',
    ];
}

/**
 * @return array{ok:bool,skipped?:bool,reportId?:string,error?:string}
 */
function weekly_report_run(bool $force = false): array
{
    weekly_report_ensure_table();
    $stats = weekly_report_aggregate();
    $reportId = $stats['weekStart'];

    if (!$force) {
        $check = db()->prepare('SELECT report_id FROM analytics_reports WHERE report_id = ? LIMIT 1');
        $check->execute([$reportId]);
        if ($check->fetch()) {
            return ['ok' => true, 'skipped' => true, 'reportId' => $reportId];
        }
    }

    $mail = weekly_report_build_mail($stats);
    try {
        send_smtp_mail(
            weekly_report_recipients(),
            $mail['subject'],
            $mail['html'],
            $mail['text'],
            $mail['replyTo'],
            '' // no BCC duplicate
        );
    } catch (Throwable $e) {
        return ['ok' => false, 'reportId' => $reportId, 'error' => $e->getMessage()];
    }

    $ins = db()->prepare(
        'INSERT INTO analytics_reports (report_id, sent_at, stats_json)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE sent_at = VALUES(sent_at), stats_json = VALUES(stats_json)'
    );
    $ins->execute([
        $reportId,
        (new DateTimeImmutable('now'))->format('Y-m-d H:i:s'),
        json_encode([
            'totalEvents' => $stats['totalEvents'],
            'uniqueVisitors' => $stats['uniqueVisitors'],
            'uniqueSessions' => $stats['uniqueSessions'],
            'pageViews' => $stats['pageViews'],
            'sectionViews' => $stats['sectionViews'],
            'previewViews' => $stats['previewViews'],
            'totalLikes' => $stats['totalLikes'],
            'totalDislikes' => $stats['totalDislikes'],
        ], JSON_UNESCAPED_SLASHES),
    ]);

    return ['ok' => true, 'skipped' => false, 'reportId' => $reportId];
}
