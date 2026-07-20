<?php

declare(strict_types=1);

function route_health(): void
{
    handle_preflight('GET, OPTIONS');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        send_error('Method not allowed');
    }
    send_success('OK', ['ok' => true, 'service' => 'api-carlxaeron']);
}

function route_track_visit(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    require_browser_origin();
    rate_limit_route('trackVisit');

    $body = json_body();
    $visitorId = trim((string) ($body['visitorId'] ?? ''));
    $sessionId = trim((string) ($body['sessionId'] ?? ''));
    if ($visitorId === '' || $sessionId === '') {
        send_error('Missing required fields');
    }

    if (is_excluded_analytics_request($visitorId)) {
        send_success('Visit skipped (excluded)');
    }

    $userAgent = isset($body['userAgent']) ? substr((string) $body['userAgent'], 0, 512) : null;
    $stmt = db()->prepare(
        'INSERT INTO visits
        (visitor_id, session_id, event_type, section, preview_slug, path, referrer, user_agent, language, screen_json, viewport_json, device, ip_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        substr($visitorId, 0, 64),
        substr($sessionId, 0, 64),
        substr(trim((string) ($body['eventType'] ?? 'pageview')), 0, 32),
        isset($body['section']) && $body['section'] !== null ? substr((string) $body['section'], 0, 32) : null,
        isset($body['previewSlug']) && $body['previewSlug'] !== null ? substr((string) $body['previewSlug'], 0, 64) : null,
        isset($body['path']) ? substr((string) $body['path'], 0, 512) : null,
        isset($body['referrer']) ? substr((string) $body['referrer'], 0, 512) : null,
        $userAgent,
        isset($body['language']) ? substr((string) $body['language'], 0, 32) : null,
        isset($body['screen']) ? json_encode($body['screen']) : null,
        isset($body['viewport']) ? json_encode($body['viewport']) : null,
        parse_device($userAgent),
        hash_ip(client_ip()),
    ]);

    send_success('Visit recorded');
}

function route_preview_feedback(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    require_browser_origin();
    rate_limit_route('previewFeedback');

    $body = json_body();
    $visitorId = trim((string) ($body['visitorId'] ?? ''));
    $sessionId = trim((string) ($body['sessionId'] ?? ''));
    $previewSlug = trim((string) ($body['previewSlug'] ?? ''));
    $sentiment = strtolower(trim((string) ($body['sentiment'] ?? '')));
    $comment = trim((string) ($body['comment'] ?? ''));

    if ($visitorId === '' || $sessionId === '' || $previewSlug === '' || $sentiment === '') {
        send_error('Missing required fields');
    }
    if ($sentiment !== 'like' && $sentiment !== 'dislike' && $sentiment !== 'agree') {
        send_error('Invalid sentiment');
    }
    if ($sentiment === 'dislike' && $comment === '') {
        send_error('Comment is required when disliking');
    }

    $vid = substr($visitorId, 0, 64);
    $slug = substr($previewSlug, 0, 64);

    if (is_excluded_analytics_request($vid)) {
        send_success('Feedback skipped (excluded)');
    }

    $check = db()->prepare('SELECT id FROM preview_feedback WHERE visitor_id = ? AND preview_slug = ? LIMIT 1');
    $check->execute([$vid, $slug]);
    if ($check->fetch()) {
        send_error('You already submitted feedback for this preview');
    }

    $stmt = db()->prepare(
        'INSERT INTO preview_feedback
        (visitor_id, session_id, preview_slug, preview_label, sentiment, comment, ip_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    try {
        $stmt->execute([
            $vid,
            substr($sessionId, 0, 64),
            $slug,
            isset($body['previewLabel']) ? substr((string) $body['previewLabel'], 0, 128) : null,
            $sentiment,
            $comment !== '' ? substr($comment, 0, 1000) : null,
            hash_ip(client_ip()),
        ]);
    } catch (PDOException $e) {
        if ((int) $e->getCode() === 23000) {
            send_error('You already submitted feedback for this preview');
        }
        throw $e;
    }

    send_success('Feedback recorded');
}

function route_analytics_summary(): void
{
    handle_preflight('GET, OPTIONS');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        send_error('Method not allowed');
    }
    require_browser_origin();
    rate_limit_route('analyticsSummary');

    $pdo = db();
    $excludeIp = parse_exclusion_list(env('ANALYTICS_EXCLUDE_IP_HASHES'));
    $excludeVid = parse_exclusion_list(env('ANALYTICS_EXCLUDE_VISITOR_IDS'));

    $weekAgo = (new DateTimeImmutable('-7 days'))->format('Y-m-d H:i:s');

    $visits = $pdo->query(
        "SELECT visitor_id, event_type, preview_slug, ip_hash, created_at
         FROM visits
         WHERE created_at >= " . $pdo->quote($weekAgo)
    )->fetchAll();

    $allFeedback = $pdo->query(
        'SELECT visitor_id, preview_slug, sentiment, ip_hash FROM preview_feedback'
    )->fetchAll();

    $visitors = [];
    $previewViews = [];
    $visitDates = [];
    $totalPreviewViews = 0;
    $totalLikes = 0;
    $totalDislikes = 0;
    $previewLikes = [];
    $previewDislikes = [];

    // All-time preview_view count (respecting exclusions)
    $allPreview = $pdo->query(
        "SELECT visitor_id, ip_hash FROM visits WHERE event_type = 'preview_view'"
    )->fetchAll();
    foreach ($allPreview as $row) {
        if (is_excluded_record($row['ip_hash'] ?? null, $row['visitor_id'] ?? null)) {
            continue;
        }
        $totalPreviewViews++;
    }

    foreach ($visits as $row) {
        if (is_excluded_record($row['ip_hash'] ?? null, $row['visitor_id'] ?? null)) {
            continue;
        }
        if (($row['event_type'] ?? '') !== 'preview_view') {
            continue;
        }
        if (!empty($row['visitor_id'])) {
            $visitors[$row['visitor_id']] = true;
        }
        if (!empty($row['created_at'])) {
            $visitDates[] = substr($row['created_at'], 0, 10);
        }
        $slug = $row['preview_slug'] ?? '';
        if ($slug !== '') {
            $previewViews[$slug] = ($previewViews[$slug] ?? 0) + 1;
        }
    }

    foreach ($allFeedback as $row) {
        if (is_excluded_record($row['ip_hash'] ?? null, $row['visitor_id'] ?? null)) {
            continue;
        }
        $slug = $row['preview_slug'] ?? '';
        if ($slug === '') {
            continue;
        }
        if (($row['sentiment'] ?? '') === 'like') {
            $totalLikes++;
            $previewLikes[$slug] = ($previewLikes[$slug] ?? 0) + 1;
        }
        if (($row['sentiment'] ?? '') === 'dislike') {
            $totalDislikes++;
            $previewDislikes[$slug] = ($previewDislikes[$slug] ?? 0) + 1;
        }
    }

    $visitsByDay = [];
    $now = new DateTimeImmutable('today');
    for ($i = 6; $i >= 0; $i--) {
        $key = $now->modify("-{$i} days")->format('Y-m-d');
        $visitsByDay[$key] = ['date' => $key, 'count' => 0];
    }
    foreach ($visitDates as $d) {
        if (isset($visitsByDay[$d])) {
            $visitsByDay[$d]['count']++;
        }
    }

    $slugs = array_unique(array_merge(
        array_keys($previewViews),
        array_keys($previewLikes),
        array_keys($previewDislikes)
    ));
    $previewStats = [];
    foreach ($slugs as $slug) {
        $previewStats[] = [
            'slug' => mask_client_slug($slug),
            'views' => $previewViews[$slug] ?? 0,
            'likes' => $previewLikes[$slug] ?? 0,
            'dislikes' => $previewDislikes[$slug] ?? 0,
        ];
    }
    usort($previewStats, static fn ($a, $b) => $b['views'] <=> $a['views']);

    $clientSites = (int) (env('CLIENT_SITES_COUNT', '11') ?? '11');

    send_success('OK', [
        'clientSites' => $clientSites,
        'totalPreviewViews' => $totalPreviewViews,
        'uniquePreviewVisitorsWeek' => count($visitors),
        'totalLikes' => $totalLikes,
        'totalDislikes' => $totalDislikes,
        'visitsByDay' => array_values($visitsByDay),
        'previewStats' => $previewStats,
        'generatedAt' => (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format(DateTimeInterface::ATOM),
    ]);
}

function route_contact(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    require_browser_origin();
    rate_limit_route('contact');

    $body = json_body();
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $message = trim((string) ($body['message'] ?? ''));
    if ($name === '' || $email === '' || $message === '') {
        send_error('Missing required fields');
    }

    $stmt = db()->prepare('INSERT INTO contact (name, email, message) VALUES (?, ?, ?)');
    $stmt->execute([$name, $email, $message]);

    try {
        send_contact_email($name, $email, $message);
    } catch (Throwable $e) {
        // Persist succeeded; mirror Firebase (still return success even if SMTP fails)
        error_log('contact SMTP failed: ' . $e->getMessage());
    }

    send_success('Contact request received');
}

function route_quotation(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    require_browser_origin();
    rate_limit_route('quotation');

    $body = json_body();
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $details = trim((string) ($body['details'] ?? ''));
    if ($name === '' || $email === '' || $details === '') {
        send_error('Missing required fields');
    }

    $company = trim((string) ($body['company'] ?? ''));
    $phone = trim((string) ($body['phone'] ?? ''));
    $projectType = trim((string) ($body['projectType'] ?? ''));
    $budgetRange = trim((string) ($body['budgetRange'] ?? ''));
    $currency = normalize_quote_currency($body['currency'] ?? null);
    $timeline = trim((string) ($body['timeline'] ?? ''));
    $services = is_array($body['services'] ?? null)
        ? array_values(array_filter(array_map(static fn ($s) => trim((string) $s), $body['services'])))
        : [];

    $stmt = db()->prepare(
        'INSERT INTO quotations
        (name, company, email, phone, project_type, budget_range, currency, timeline, services_json, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        $company,
        $email,
        $phone,
        $projectType,
        $budgetRange,
        $currency,
        $timeline,
        json_encode($services),
        $details,
    ]);

    try {
        send_quotation_email([
            'name' => $name,
            'company' => $company,
            'email' => $email,
            'phone' => $phone,
            'projectType' => $projectType,
            'budgetRange' => $budgetRange,
            'currency' => $currency,
            'timeline' => $timeline,
            'services' => $services,
            'details' => $details,
        ]);
    } catch (Throwable $e) {
        error_log('quotation SMTP failed: ' . $e->getMessage());
    }

    send_success('Quote request received');
}
