<?php

declare(strict_types=1);

require_once __DIR__ . '/outreach-signature.php';

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

/**
 * Default sequence: 3d → 7d → 7d → 7d (up to 4 follow-ups).
 * Legacy single intervals (`3d` / `1w`) still work if explicitly set.
 */
function outreach_normalize_cadence(string $cadence): string
{
    $c = strtolower(trim($cadence));
    if ($c === '3d' || $c === '1w') {
        return $c;
    }
    // 3d1w | seq | empty | anything else → fixed sequence
    return '3d1w';
}

/** Days until the *next* follow-up, given how many follow-ups already sent. */
function outreach_days_until_next(string $cadence, int $followUpsAlreadySent): int
{
    $cadence = outreach_normalize_cadence($cadence);
    if ($cadence === '3d1w') {
        // 1st wait = 3d; all later waits = 7d (→ 3d, 7d, 7d, 7d with max 4)
        return $followUpsAlreadySent === 0 ? 3 : 7;
    }
    return $cadence === '3d' ? 3 : 7;
}

function outreach_default_max_followups(): int
{
    return 4;
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

/**
 * Additive % off original quoted amount per follow-up index (0-based).
 * FU1 3d: +10% · FU2 7d: +10% · FU3 7d: +10% · FU4 7d: +20% → max 50%.
 *
 * @return list<int>
 */
function outreach_followup_discount_steps(): array
{
    return [10, 10, 10, 20];
}

/** Percent added by the follow-up about to send (given how many already sent). */
function outreach_followup_discount_step(int $followUpsAlreadySent): int
{
    $steps = outreach_followup_discount_steps();
    return $steps[$followUpsAlreadySent] ?? 0;
}

/** Cumulative discount % after including the follow-up about to send (capped at 50). */
function outreach_followup_discount_total(int $followUpsAlreadySent): int
{
    $steps = outreach_followup_discount_steps();
    $total = 0;
    $upto = min($followUpsAlreadySent + 1, count($steps));
    for ($i = 0; $i < $upto; $i++) {
        $total += $steps[$i];
    }
    return min(50, $total);
}

function outreach_parse_amount_pesos(string $amount): ?int
{
    if (!preg_match('/(\d[\d,]*)/', $amount, $m)) {
        return null;
    }
    return (int) str_replace(',', '', $m[1]);
}

function outreach_format_pesos(int $n): string
{
    return '₱' . number_format($n);
}

/**
 * Build discount + optional commission block for a follow-up.
 *
 * @param array<string,mixed> $job
 * @return array{html:string,text:string,totalPct:int,stepPct:int,discounted:?string}
 */
function outreach_followup_offer_copy(array $job, int $followUpsAlreadySent): array
{
    $stepPct = outreach_followup_discount_step($followUpsAlreadySent);
    $totalPct = outreach_followup_discount_total($followUpsAlreadySent);
    $amountRaw = trim((string) ($job['quoted_amount'] ?? ''));
    $pesos = $amountRaw !== '' ? outreach_parse_amount_pesos($amountRaw) : null;
    $discounted = null;
    if ($pesos !== null && $totalPct > 0) {
        $discounted = outreach_format_pesos((int) round($pesos * (100 - $totalPct) / 100));
    }

    $priceHtml = '';
    $priceText = '';
    if ($totalPct > 0) {
        $priceHtml = 'This check-in includes a <strong>' . h((string) $totalPct) . '% discount</strong>'
            . ($stepPct > 0 && $followUpsAlreadySent > 0
                ? ' (another <strong>' . h((string) $stepPct) . '%</strong> off)'
                : '')
            . ' from the original package'
            . ($amountRaw !== '' ? ' of ' . h($amountRaw) : '')
            . ($discounted !== null ? ' — now <strong>' . h($discounted) . '</strong> total' : '')
            . '. Maximum goodwill discount is 50% off.';
        $priceText = "This check-in includes a {$totalPct}% discount"
            . ($stepPct > 0 && $followUpsAlreadySent > 0 ? " (another {$stepPct}% off)" : '')
            . ' from the original package'
            . ($amountRaw !== '' ? " of {$amountRaw}" : '')
            . ($discounted !== null ? " — now {$discounted} total" : '')
            . '. Maximum goodwill discount is 50% off.';
    }

    $commissionHtml = 'I can also offer a <strong>commission</strong> if you refer clients or want a partner arrangement — '
        . 'just message me and we can discuss a fair split.';
    $commissionText = 'I can also offer a commission if you refer clients or want a partner arrangement — '
        . 'just message me and we can discuss a fair split.';

    $html = ($priceHtml !== '' ? '<p>' . $priceHtml . '</p>' : '')
        . '<p>' . $commissionHtml . '</p>';
    $text = ($priceText !== '' ? $priceText . "\n\n" : '')
        . $commissionText;

    return [
        'html' => $html,
        'text' => $text,
        'totalPct' => $totalPct,
        'stepPct' => $stepPct,
        'discounted' => $discounted,
    ];
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
          cadence VARCHAR(8) NOT NULL DEFAULT '3d1w',
          auto_followup TINYINT(1) NOT NULL DEFAULT 1,
          max_followups TINYINT UNSIGNED NOT NULL DEFAULT 4,
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
function outreach_system_label(array $job): string
{
    return trim((string) ($job['system_label'] ?? ''));
}

/** @param array<string,mixed> $job */
function outreach_system_pain(array $job): string
{
    return trim((string) ($job['system_pain'] ?? ''));
}

/** @param array<string,mixed> $job */
function outreach_system_hook_sentence(array $job, bool $html = true): string
{
    $label = outreach_system_label($job);
    $pain = outreach_system_pain($job);
    $biz = (string) $job['business_name'];

    if ($label !== '' && $pain !== '') {
        if ($html) {
            return 'I prepared a sample <strong>' . h($label) . '</strong> for <strong>' . h($biz) . '</strong>. '
                . '<strong>' . h($pain) . '</strong>';
        }

        return "I prepared a sample {$label} for {$biz}. {$pain}";
    }

    if ($label !== '') {
        if ($html) {
            return 'I prepared a sample <strong>' . h($label) . '</strong> for <strong>' . h($biz) . '</strong> '
                . '— so day-to-day work lives in one place instead of scattered chats and notes.';
        }

        return "I prepared a sample {$label} for {$biz} — so day-to-day work lives in one place instead of scattered chats and notes.";
    }

    if ($html) {
        return 'I prepared a sample <strong>business admin system and website</strong> for <strong>' . h($biz) . '</strong> '
            . '— operations first, with a marketing site as the public face.';
    }

    return "I prepared a sample business admin system and website for {$biz} — operations first, with a marketing site as the public face.";
}

/** @param array<string,mixed> $job */
function outreach_admin_browse_html(array $job): string
{
    $label = outreach_system_label($job);
    $adminName = $label !== '' ? $label : 'admin demo';

    return '<p><strong>Start with the admin (desktop &amp; mobile):</strong> the preview opens on your '
        . '<strong>' . h($adminName) . '</strong> — already logged in at <code>/admin/</code>. '
        . 'Scroll inside the frames and click Dashboard, Bookings/Calendar, and other sample pages.</p>';
}

/** @param array<string,mixed> $job */
function outreach_admin_browse_text(array $job): string
{
    $label = outreach_system_label($job);
    $adminName = $label !== '' ? $label : 'admin demo';

    return "Start with the admin (desktop & mobile): {$adminName} at /admin/ — scroll inside the frames and browse the sample pages.\n\n";
}

/**
 * Quoted amounts (₱15k / ₱18k) are website-only; admin preview is a sample; production system is extra.
 *
 * @return array{0:string,1:string}
 */
function outreach_website_pricing_block(string $pkg, string $amount, string $payment, string $timeline): array
{
    $amountHtml = $amount !== ''
        ? '<strong>Investment (website only):</strong> ' . h($amount) . '<br>'
        : '';
    $amountText = $amount !== '' ? "Investment (website only): {$amount}\n" : '';

    $html = '<p><strong>Package:</strong> ' . h($pkg) . ' <em>(website only)</em><br>'
        . $amountHtml
        . '<strong>Payment:</strong> ' . h($payment) . '<br>'
        . '<strong>Timeline:</strong> ' . h($timeline) . '</p>'
        . '<p><strong>Admin system:</strong> the preview includes a <em>sample</em> so you can explore how day-to-day operations could look. '
        . 'A production business system is <strong>priced separately</strong> if you want that built for real.</p>'
        . '<p><em>To start the website, only the upfront portion is due — not the full website amount.</em></p>';

    $text = "Package: {$pkg} (website only)\n"
        . $amountText
        . "Payment: {$payment}\n"
        . "Timeline: {$timeline}\n\n"
        . "Admin system: the preview includes a sample so you can explore operations. "
        . "A production business system is priced separately if you want that built for real.\n"
        . "To start the website, only the upfront portion is due — not the full website amount.\n";

    return [$html, $text];
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
    $label = outreach_system_label($job);
    $hook = outreach_system_hook_sentence($job, true);
    $hookText = outreach_system_hook_sentence($job, false);
    [$pricingHtml, $pricingText] = outreach_website_pricing_block($pkg, $amount, $payment, $timeline);

    $subject = $label !== ''
        ? "{$label} + website sample for {$biz}"
        : "Business system + website sample for {$biz}";

    $title = $label !== ''
        ? h($label) . ' + website sample'
        : 'Business system + website sample';

    $html = '<h2>' . $title . ' for ' . h($biz) . '</h2>'
        . '<p>Hi ' . h($name) . ',</p>'
        . '<p>' . $hook . '</p>'
        . outreach_admin_browse_html($job)
        . '<p><strong>Then the marketing site:</strong> desktop and mobile pages at <code>/</code> show '
        . 'how ' . h($biz) . ' could look online.</p>'
        . '<p><strong>Preview link:</strong> <a href="' . h($preview) . '">' . h($preview) . '</a></p>'
        . $pricingHtml
        . '<p>Reply if the admin and site previews look right, you want changes, or you are ready to proceed '
        . '(website now, and/or a custom quote for a live system).</p>'
        . outreach_facebook_contact_html()
        . outreach_signature_html();
    $text = "Hi {$name},\n\n{$hookText}\n"
        . outreach_admin_browse_text($job)
        . "Then the marketing site at / on desktop and mobile.\n"
        . "Preview: {$preview}\n\n"
        . $pricingText . "\n"
        . "Reply if the admin and site previews look right, you want changes, or you are ready to proceed "
        . "(website now, and/or a custom quote for a live system).\n\n"
        . outreach_facebook_contact_text()
        . outreach_signature_text();

    return [$subject, $html, $text];
}

/** @param array<string,mixed> $job */
function outreach_build_followup_email(array $job): array
{
    $name = (string) $job['contact_name'];
    $biz = (string) $job['business_name'];
    $preview = (string) $job['preview_url'];
    $pkg = (string) ($job['package_name'] ?: 'Starter Business Website');
    $payment = outreach_payment_terms($job);
    $count = (int) ($job['follow_up_count'] ?? 0);
    $label = outreach_system_label($job);
    $systemPhrase = $label !== '' ? $label : 'admin system';
    // Sequence: 1st FU = soft 3d; 2nd+ = 1w “still interested?” + stacking discounts
    $isWeekFollowUp = $count >= 1;
    $offer = outreach_followup_offer_copy($job, $count);
    $totalPct = $offer['totalPct'];
    $discounted = $offer['discounted'];

    $pricingAside = 'Quoted figures are for the <strong>website only</strong>. The admin preview is a sample — a production system is priced separately if you want one.';
    $pricingAsideText = 'Quoted figures are for the website only. The admin preview is a sample — a production system is priced separately if you want one.';

    if ($isWeekFollowUp) {
        $subject = $totalPct > 0
            ? "Still interested? {$totalPct}% off website — {$biz} {$systemPhrase} + website preview"
            : "Still interested? {$biz} {$systemPhrase} + website preview";
        $ask = 'Did you <strong>browse the admin</strong> preview and like the sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?'
            . '<br><br>Website payment stays <strong>' . h($payment) . '</strong>'
            . ($discounted !== null
                ? ' on the discounted <strong>website</strong> total of <strong>' . h($discounted) . '</strong>'
                : '')
            . '. Only the upfront half is due to start the website.';
        $askText = 'Did you browse the admin preview and like the sample, want revisions, or is it not a fit right now?'
            . "\n\nWebsite payment stays {$payment}"
            . ($discounted !== null ? " on the discounted website total of {$discounted}" : '')
            . '. Only the upfront half is due to start the website.';
    } else {
        $subject = $totalPct > 0
            ? "Quick check-in + {$totalPct}% off website — your {$biz} {$systemPhrase} + website preview"
            : "Quick check-in — your {$biz} {$systemPhrase} + website preview";
        $ask = 'Did the <strong>admin</strong> preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with the <strong>website</strong> package (<strong>'
            . h($pkg) . '</strong>'
            . ($discounted !== null ? ' at <strong>' . h($discounted) . '</strong>' : '')
            . ')? Only the upfront portion is due to begin — not the full website amount. Want a live system too? I can quote that separately.';
        $askText = "Did the admin preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with the website package ({$pkg}"
            . ($discounted !== null ? " at {$discounted}" : '')
            . ')? Only the upfront portion is due to begin — not the full website amount. Want a live system too? I can quote that separately.';
    }

    $html = '<p>Hi ' . h($name) . ',</p>'
        . '<p>Checking in about the sample <strong>' . h($systemPhrase) . '</strong> and website for <strong>' . h($biz) . '</strong>.</p>'
        . '<p><strong>Preview (admin + site):</strong> <a href="' . h($preview) . '">' . h($preview) . '</a></p>'
        . '<p>' . $ask . '</p>'
        . '<p><em>' . $pricingAside . '</em></p>'
        . $offer['html']
        . '<p>No pressure — a short reply is enough.</p>'
        . outreach_facebook_contact_html()
        . outreach_signature_html();
    $text = "Hi {$name},\n\nChecking in about the {$systemPhrase} and website for {$biz}.\nPreview: {$preview}\n\n{$askText}\n\n"
        . "{$pricingAsideText}\n\n"
        . $offer['text'] . "\n\n"
        . outreach_facebook_contact_text()
        . outreach_signature_text();

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
        outreach_notify_admins_push($kind, $job);
        return ['ok' => true];
    } catch (Throwable $e) {
        return ['ok' => false, 'error' => $e->getMessage()];
    }
}

/**
 * Notify admin Web Push subscribers after a successful outreach email.
 * Calls Laravel POST /pushNotifyAdmins (same host) with OUTREACH_SECRET.
 *
 * @param array<string,mixed> $job
 */
function outreach_notify_admins_push(string $kind, array $job): void
{
    $secret = env('OUTREACH_SECRET');
    if (!$secret) {
        return;
    }

    $business = trim((string) ($job['business_name'] ?? 'Client'));
    $email = trim((string) ($job['contact_email'] ?? ''));
    $slug = trim((string) ($job['slug'] ?? ''));
    $count = (int) ($job['follow_up_count'] ?? 0);

    if ($kind === 'initial') {
        $title = 'Outreach email sent';
        $body = "Quotation sent to {$email} ({$business})";
        $type = 'outreach_initial';
    } else {
        $fuNum = $count + 1;
        $title = 'Outreach follow-up sent';
        $body = "Follow-up #{$fuNum} sent to {$email} ({$business})";
        $type = 'outreach_followup';
    }

    $payload = json_encode([
        'secret' => $secret,
        'title' => $title,
        'body' => $body,
        'data' => [
            'type' => $type,
            'slug' => $slug,
            'url' => '/#admin',
        ],
    ], JSON_UNESCAPED_SLASHES);
    if ($payload === false) {
        return;
    }

    $url = rtrim((string) (env('PUSH_NOTIFY_URL') ?: 'https://api.carlmanuel.com/pushNotifyAdmins'), '/');

    try {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            if ($ch === false) {
                return;
            }
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'X-Outreach-Secret: ' . $secret,
                ],
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 8,
                CURLOPT_CONNECTTIMEOUT => 4,
            ]);
            curl_exec($ch);
            curl_close($ch);
        }
    } catch (Throwable $e) {
        // Never fail the outreach send because of push.
    }
}

function route_outreach_schedule(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    rate_limit_route('outreach');

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
    $cadence = outreach_normalize_cadence((string) ($body['cadence'] ?? '3d1w'));
    $sendInitial = !empty($body['sendInitial']);
    $autoFollowUp = array_key_exists('autoFollowUp', $body) ? (bool) $body['autoFollowUp'] : true;
    $maxFollowUps = max(0, min(8, (int) ($body['maxFollowUps'] ?? outreach_default_max_followups())));
    $systemLabel = trim((string) ($body['systemLabel'] ?? ''));
    $systemPain = trim((string) ($body['systemPain'] ?? ''));

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
        'system_label' => $systemLabel,
        'system_pain' => $systemPain,
    ];

    if ($sendInitial) {
        $result = outreach_send_to_prospect($job, 'initial');
        if (!$result['ok']) {
            send_error('Initial email failed: ' . ($result['error'] ?? 'unknown'), [], 500);
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
    rate_limit_route('outreach');
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
            // After FU #1 (count=1) wait 1w; legacy 3d/1w keep constant interval
            $days = outreach_days_until_next($cadence, $count);
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
