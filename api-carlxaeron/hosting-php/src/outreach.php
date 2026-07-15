<?php

declare(strict_types=1);

/**
 * Client quotation outreach — schedule + auto follow-ups (hosting cron).
 * Initial send only via POST /outreachSchedule after Cursor gets user approval.
 */

function outreach_require_secret(array $body): void
{
    $expected = env('OUTREACH_SECRET');
    if (!$expected) {
        send_error('OUTREACH_SECRET not configured', [], 500);
    }
    $given = trim((string) ($body['secret'] ?? $_SERVER['HTTP_X_OUTREACH_SECRET'] ?? ''));
    if ($given === '' || !hash_equals($expected, $given)) {
        send_error('Unauthorized', [], 401);
    }
}

function outreach_cadence_days(string $cadence): int
{
    return $cadence === '3d' ? 3 : 7;
}

function outreach_normalize_cadence(string $cadence): string
{
    $c = strtolower(trim($cadence));
    return $c === '3d' ? '3d' : '1w';
}

/** Default payment terms — never imply full package is due upfront. */
function outreach_default_payment_terms(): string
{
    return '50% upfront to begin · 50% on delivery (not the full amount upfront)';
}

/** @param array<string,mixed> $job */
function outreach_payment_terms(array $job): string
{
    $terms = trim((string) ($job['payment_terms'] ?? ''));
    return $terms !== '' ? $terms : outreach_default_payment_terms();
}

function outreach_ensure_table(): void
{
    db()->exec(
        "CREATE TABLE IF NOT EXISTS outreach_jobs (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          slug VARCHAR(64) NOT NULL,
          business_name VARCHAR(255) NOT NULL,
          contact_name VARCHAR(255) NOT NULL,
          contact_email VARCHAR(255) NOT NULL,
          preview_url VARCHAR(512) NOT NULL,
          package_name VARCHAR(255) NULL,
          quoted_amount VARCHAR(64) NULL,
          timeline VARCHAR(255) NULL,
          cadence VARCHAR(8) NOT NULL DEFAULT '1w',
          auto_followup TINYINT(1) NOT NULL DEFAULT 1,
          max_followups TINYINT UNSIGNED NOT NULL DEFAULT 2,
          follow_up_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
          status VARCHAR(32) NOT NULL DEFAULT 'sent',
          initial_sent_at DATETIME NULL,
          next_follow_up_at DATETIME NULL,
          last_follow_up_at DATETIME NULL,
          last_error VARCHAR(512) NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_outreach_slug_email (slug, contact_email),
          INDEX idx_outreach_due (auto_followup, status, next_follow_up_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

/** @param array<string,mixed> $job */
function outreach_build_initial_email(array $job): array
{
    $name = (string) $job['contact_name'];
    $biz = (string) $job['business_name'];
    $preview = (string) $job['preview_url'];
    $pkg = (string) ($job['package_name'] ?: 'Starter Business Website');
    $amount = (string) ($job['quoted_amount'] ?: '');
    $timeline = (string) ($job['timeline'] ?: '');
    $payment = outreach_payment_terms($job);

    $subject = "Website proposal for {$biz} — preview your sample site";
    $html = '<h2>Website proposal for ' . h($biz) . '</h2>'
        . '<p>Hi ' . h($name) . ',</p>'
        . '<p>I prepared a <strong>sample one-page website</strong> for <strong>' . h($biz) . '</strong> '
        . 'so you can see how your business could look online on desktop and mobile.</p>'
        . '<p><strong>Preview:</strong> <a href="' . h($preview) . '">' . h($preview) . '</a></p>'
        . '<p><strong>Package:</strong> ' . h($pkg) . '<br>'
        . ($amount !== '' ? '<strong>Investment (total):</strong> ' . h($amount) . '<br>' : '')
        . '<strong>Payment:</strong> ' . h($payment) . '<br>'
        . '<strong>Timeline:</strong> ' . h($timeline) . '</p>'
        . '<p><em>To start, only the upfront portion is due — not the full package amount.</em></p>'
        . '<p>Reply if you like the preview, want changes, or want to proceed.</p>'
        . '<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
        . '<a href="https://carlmanuel.com">carlmanuel.com</a> · info@carlmanuel.com</p>';
    $text = "Hi {$name},\n\nSample website for {$biz}:\n{$preview}\n\n"
        . "Package: {$pkg}\n"
        . ($amount !== '' ? "Investment (total): {$amount}\n" : '')
        . "Payment: {$payment}\n"
        . "To start, only the upfront portion is due — not the full package amount.\n"
        . "Timeline: {$timeline}\n\n"
        . "Reply if you like it, want changes, or want to proceed.\n\n"
        . "Carl Louis Manuel\ncarlmanuel.com · info@carlmanuel.com";

    return [$subject, $html, $text];
}

/** @param array<string,mixed> $job */
function outreach_build_followup_email(array $job): array
{
    $name = (string) $job['contact_name'];
    $biz = (string) $job['business_name'];
    $preview = (string) $job['preview_url'];
    $pkg = (string) ($job['package_name'] ?: 'Starter Business Website');
    $amount = (string) ($job['quoted_amount'] ?: '');
    $payment = outreach_payment_terms($job);
    $count = (int) ($job['follow_up_count'] ?? 0);
    $isWeek = (($job['cadence'] ?? '1w') === '1w') || $count >= 1;
    $priceNote = $amount !== ''
        ? ' (' . h($amount) . ' total · ' . h($payment) . ')'
        : ' (' . h($payment) . ')';
    $priceNoteText = $amount !== ''
        ? " ({$amount} total · {$payment})"
        : " ({$payment})";

    if ($isWeek && $count >= 1) {
        $subject = "Still interested? {$biz} website proposal";
        $ask = 'Did you <strong>like</strong> the sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?'
            . '<br><br><strong>Reminder:</strong> package total'
            . ($amount !== '' ? ' is ' . h($amount) : '')
            . ' — payment is <strong>' . h($payment) . '</strong>. Only the upfront half is due to start.';
        $askText = 'Did you like the sample, want revisions, or is it not a fit right now?'
            . "\n\nReminder: payment is {$payment}. Only the upfront half is due to start"
            . ($amount !== '' ? " (total {$amount})" : '') . '.';
    } else {
        $subject = "Quick check-in — your {$biz} website preview";
        $ask = 'Did the desktop + mobile preview look useful? Anything to change? Ready to proceed with <strong>'
            . h($pkg) . '</strong>' . $priceNote . '? Only the upfront portion is due to begin — not the full amount.';
        $askText = "Did the preview look useful? Anything to change? Ready to proceed with {$pkg}"
            . $priceNoteText . '? Only the upfront portion is due to begin — not the full amount.';
    }

    $html = '<p>Hi ' . h($name) . ',</p>'
        . '<p>Checking in about the sample website for <strong>' . h($biz) . '</strong>.</p>'
        . '<p><strong>Preview:</strong> <a href="' . h($preview) . '">' . h($preview) . '</a></p>'
        . '<p>' . $ask . '</p>'
        . '<p>No pressure — a short reply is enough.</p>'
        . '<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
        . '<a href="https://carlmanuel.com">carlmanuel.com</a> · info@carlmanuel.com</p>';
    $text = "Hi {$name},\n\nChecking in about {$biz}.\nPreview: {$preview}\n\n{$askText}\n\n"
        . "Carl Louis Manuel\ncarlmanuel.com · info@carlmanuel.com";

    return [$subject, $html, $text];
}

/**
 * @param array<string,mixed> $job
 * @return array{ok:bool,error?:string}
 */
function outreach_send_to_prospect(array $job, string $kind): array
{
    $to = (string) $job['contact_email'];
    if ($kind === 'initial') {
        [$subject, $html, $text] = outreach_build_initial_email($job);
    } else {
        [$subject, $html, $text] = outreach_build_followup_email($job);
    }
    try {
        send_smtp_mail($to, $subject, $html, $text, env('DEFAULT_FROM') ?: env('SMTP_USER'));
        return ['ok' => true];
    } catch (Throwable $e) {
        return ['ok' => false, 'error' => $e->getMessage()];
    }
}

function route_outreach_schedule(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }

    $body = json_body();
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
    $cadence = outreach_normalize_cadence((string) ($body['cadence'] ?? '1w'));
    $sendInitial = !empty($body['sendInitial']);
    $autoFollowUp = array_key_exists('autoFollowUp', $body) ? (bool) $body['autoFollowUp'] : true;
    $maxFollowUps = max(0, min(5, (int) ($body['maxFollowUps'] ?? 2)));

    if ($slug === '' || $businessName === '' || $contactName === '' || $contactEmail === '' || $previewUrl === '') {
        send_error('Missing required fields');
    }
    if (!filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
        send_error('Invalid contactEmail');
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
            send_error('Initial email failed: ' . ($result['error'] ?? 'unknown'), [], 500);
        }
        $initialSentAt = $now->format('Y-m-d H:i:s');
        $status = 'sent';
        if ($autoFollowUp && $maxFollowUps > 0) {
            $days = outreach_cadence_days($cadence);
            $nextFollowUp = $now->modify("+{$days} days")->format('Y-m-d H:i:s');
        }
    } elseif ($autoFollowUp && $maxFollowUps > 0) {
        $days = outreach_cadence_days($cadence);
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

    send_success('Outreach scheduled', [
        'slug' => $slug,
        'contactEmail' => $contactEmail,
        'sendInitial' => $sendInitial,
        'autoFollowUp' => $autoFollowUp,
        'cadence' => $cadence,
        'nextFollowUpAt' => $nextFollowUp,
        'status' => $status,
    ]);
}

function route_outreach_pause(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    $body = json_body();
    outreach_require_secret($body);
    outreach_ensure_table();

    $slug = substr(trim((string) ($body['slug'] ?? '')), 0, 64);
    $email = trim((string) ($body['contactEmail'] ?? ''));
    if ($slug === '') {
        send_error('Missing slug');
    }

    if ($email !== '') {
        $stmt = db()->prepare(
            "UPDATE outreach_jobs SET auto_followup = 0, status = 'paused', next_follow_up_at = NULL
             WHERE slug = ? AND contact_email = ?"
        );
        $stmt->execute([$slug, $email]);
    } else {
        $stmt = db()->prepare(
            "UPDATE outreach_jobs SET auto_followup = 0, status = 'paused', next_follow_up_at = NULL WHERE slug = ?"
        );
        $stmt->execute([$slug]);
    }

    send_success('Outreach paused', ['slug' => $slug, 'updated' => $stmt->rowCount()]);
}

/**
 * Process due follow-ups (CLI cron). Returns summary array.
 * @return array{processed:int,sent:int,errors:list<string>}
 */
function outreach_process_due_followups(): array
{
    outreach_ensure_table();
    $pdo = db();
    $now = (new DateTimeImmutable('now'))->format('Y-m-d H:i:s');
    $stmt = $pdo->prepare(
        "SELECT * FROM outreach_jobs
         WHERE auto_followup = 1
           AND next_follow_up_at IS NOT NULL
           AND next_follow_up_at <= ?
           AND follow_up_count < max_followups
           AND status IN ('sent', 'waiting_followup', 'followup_sent')
         ORDER BY next_follow_up_at ASC
         LIMIT 50"
    );
    $stmt->execute([$now]);
    $rows = $stmt->fetchAll();

    $sent = 0;
    $errors = [];
    foreach ($rows as $row) {
        $result = outreach_send_to_prospect($row, 'followup');
        $id = (int) $row['id'];
        if (!$result['ok']) {
            $err = $result['error'] ?? 'send failed';
            $errors[] = "id={$id} {$err}";
            $u = $pdo->prepare('UPDATE outreach_jobs SET last_error = ? WHERE id = ?');
            $u->execute([substr($err, 0, 512), $id]);
            continue;
        }

        $count = (int) $row['follow_up_count'] + 1;
        $max = (int) $row['max_followups'];
        $cadence = outreach_normalize_cadence((string) $row['cadence']);
        $next = null;
        $status = 'followup_sent';
        if ($count < $max) {
            $days = outreach_cadence_days($cadence);
            $next = (new DateTimeImmutable('now'))->modify("+{$days} days")->format('Y-m-d H:i:s');
        } else {
            $status = 'completed';
        }

        $u = $pdo->prepare(
            'UPDATE outreach_jobs SET
                follow_up_count = ?,
                last_follow_up_at = ?,
                next_follow_up_at = ?,
                status = ?,
                last_error = NULL
             WHERE id = ?'
        );
        $u->execute([
            $count,
            (new DateTimeImmutable('now'))->format('Y-m-d H:i:s'),
            $next,
            $status,
            $id,
        ]);
        $sent++;
    }

    return ['processed' => count($rows), 'sent' => $sent, 'errors' => $errors];
}
