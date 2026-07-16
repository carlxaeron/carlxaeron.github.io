<?php

declare(strict_types=1);

/**
 * Minimal SMTPS (implicit SSL) mailer for Private Email / Namecheap SMTP.
 *
 * @param string|null $bccCsv Comma-separated BCC list. When null, uses MAIL_BCC env
 *                            (default info@carlmanuel.com) for outreach copies.
 *                            Pass '' to disable BCC for a given send.
 */

/** Normalize portfolio quote currency to PHP or USD; unknown/empty → null. */
function normalize_quote_currency(mixed $value): ?string
{
    $code = strtoupper(trim((string) $value));
    if ($code === '') {
        return null;
    }

    return in_array($code, ['PHP', 'USD'], true) ? $code : null;
}

/** Strip display-name / brackets → bare address for SMTP envelope. */
function mail_bare_address(string $addr): string
{
    $addr = trim($addr);
    if (preg_match('/<([^>]+)>/', $addr, $m)) {
        return trim($m[1]);
    }
    return $addr;
}

/** RFC 5322 From / Reply-To: "Display Name" <email@domain>. */
function mail_format_mailbox(string $email, ?string $name = null): string
{
    $email = mail_bare_address($email);
    $name = $name !== null ? trim($name) : '';
    if ($name === '') {
        return $email;
    }
    // Escape quotes in display name; keep ASCII-simple for deliverability.
    $safe = str_replace(['\\', '"'], ['\\\\', '\\"'], $name);
    return "\"{$safe}\" <{$email}>";
}

function mail_message_id(string $domain = 'carlmanuel.com'): string
{
    return sprintf('<%s.%s@%s>', bin2hex(random_bytes(8)), bin2hex(random_bytes(4)), $domain);
}

function send_smtp_mail(
    string $toCsv,
    string $subject,
    string $html,
    string $text,
    ?string $replyTo = null,
    ?string $bccCsv = null
): void {
    $host = env('SMTP_HOST', 'mail.privateemail.com');
    $port = (int) env('SMTP_PORT', '465');
    $user = env('SMTP_USER');
    $pass = env('SMTP_PASS');
    $fromRaw = env('DEFAULT_FROM', $user ?: 'info@carlmanuel.com') ?: 'info@carlmanuel.com';
    $fromEmail = mail_bare_address($fromRaw);
    $fromName = trim((string) (env('DEFAULT_FROM_NAME') ?: env('MAIL_FROM_NAME') ?: 'Carl Louis Manuel'));

    if (!$user || !$pass) {
        throw new RuntimeException('SMTP not configured');
    }

    $recipients = array_values(array_filter(array_map('trim', explode(',', $toCsv))));
    if (!$recipients) {
        throw new RuntimeException('No recipients');
    }

    if ($bccCsv === null) {
        $bccCsv = env('MAIL_BCC', 'info@carlmanuel.com') ?? 'info@carlmanuel.com';
    }
    $bccList = array_values(array_filter(array_map('trim', explode(',', (string) $bccCsv))));
    $toLower = array_map('strtolower', $recipients);
    $bccList = array_values(array_filter(
        $bccList,
        static fn (string $addr): bool => $addr !== '' && !in_array(strtolower($addr), $toLower, true)
    ));

    $remote = "ssl://{$host}:{$port}";
    $fp = @stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT);
    if (!$fp) {
        throw new RuntimeException("SMTP connect failed: {$errstr} ({$errno})");
    }
    stream_set_timeout($fp, 30);

    $expect = static function ($fp, array $codes): string {
        $data = '';
        while ($line = fgets($fp, 515)) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        $code = (int) substr($data, 0, 3);
        if (!in_array($code, $codes, true)) {
            throw new RuntimeException('SMTP unexpected reply: ' . trim($data));
        }
        return $data;
    };

    $cmd = static function ($fp, string $line, array $codes) use ($expect): string {
        fwrite($fp, $line . "\r\n");
        return $expect($fp, $codes);
    };

    $expect($fp, [220]);
    $cmd($fp, 'EHLO api.carlmanuel.com', [250]);
    $cmd($fp, 'AUTH LOGIN', [334]);
    $cmd($fp, base64_encode($user), [334]);
    $cmd($fp, base64_encode($pass), [235]);
    // Envelope sender must be bare address (Private Email / SPF).
    $cmd($fp, "MAIL FROM:<{$fromEmail}>", [250]);
    foreach ($recipients as $to) {
        $cmd($fp, 'RCPT TO:<' . mail_bare_address($to) . '>', [250, 251]);
    }
    // Envelope BCC — not listed in To: so the client does not see them
    foreach ($bccList as $bcc) {
        $cmd($fp, 'RCPT TO:<' . mail_bare_address($bcc) . '>', [250, 251]);
    }
    $cmd($fp, 'DATA', [354]);

    $boundary = 'b_' . bin2hex(random_bytes(8));
    $headers = [];
    $headers[] = 'From: ' . mail_format_mailbox($fromEmail, $fromName);
    $headers[] = 'To: ' . implode(', ', $recipients);
    if ($replyTo) {
        $headers[] = 'Reply-To: ' . mail_format_mailbox(mail_bare_address($replyTo));
    }
    $headers[] = "Subject: {$subject}";
    $headers[] = 'Message-ID: ' . mail_message_id();
    $headers[] = 'Date: ' . date('r');
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
    // Mailto unsubscribe hint for filters (no HTTPS one-click endpoint yet).
    $headers[] = 'List-Unsubscribe: <mailto:' . $fromEmail . '?subject=unsubscribe>';

    $payload = implode("\r\n", $headers) . "\r\n\r\n";
    $payload .= "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n{$text}\r\n";
    $payload .= "--{$boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n{$html}\r\n";
    $payload .= "--{$boundary}--";
    // Dot-stuff body lines only — never the SMTP DATA terminator.
    $payload = preg_replace('/^\./m', '..', $payload) ?? $payload;
    fwrite($fp, $payload . "\r\n.\r\n");
    $expect($fp, [250]);
    $cmd($fp, 'QUIT', [221]);
    fclose($fp);
}

function mail_recipients(): string
{
    return env('MAIL_TO', 'info@carlmanuel.com') ?? '';
}

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function send_contact_email(string $name, string $email, string $message): void
{
    $subject = "Portfolio contact from {$name}";
    $html = '<h2>New portfolio contact message</h2>'
        . '<p><strong>Name:</strong> ' . h($name) . '</p>'
        . '<p><strong>Email:</strong> ' . h($email) . '</p>'
        . '<p><strong>Message:</strong></p><p>' . nl2br(h($message)) . '</p>';
    $text = "New portfolio contact message\n\nName: {$name}\nEmail: {$email}\n\n{$message}";
    // Inbound leads already go to MAIL_TO — skip BCC to avoid duplicate.
    send_smtp_mail(mail_recipients(), $subject, $html, $text, $email, '');
}

function send_quotation_email(array $q): void
{
    $services = is_array($q['services'] ?? null) ? implode(', ', $q['services']) : '—';
    $subject = 'New portfolio quote request';
    $html = '<h2>New portfolio quote request</h2>'
        . '<p><strong>Name:</strong> ' . h($q['name']) . '</p>'
        . '<p><strong>Company:</strong> ' . h($q['company'] ?: '—') . '</p>'
        . '<p><strong>Email:</strong> ' . h($q['email']) . '</p>'
        . '<p><strong>Phone:</strong> ' . h($q['phone'] ?: '—') . '</p>'
        . '<p><strong>Project type:</strong> ' . h($q['projectType'] ?: '—') . '</p>'
        . '<p><strong>Services:</strong> ' . h($services) . '</p>'
        . '<p><strong>Currency:</strong> ' . h($q['currency'] ?: '—') . '</p>'
        . '<p><strong>Budget:</strong> ' . h($q['budgetRange'] ?: '—') . '</p>'
        . '<p><strong>Timeline:</strong> ' . h($q['timeline'] ?: '—') . '</p>'
        . '<p><strong>Project details:</strong></p><p>' . nl2br(h($q['details'])) . '</p>';
    $text = "New portfolio quote request\n\n"
        . "Name: {$q['name']}\nCompany: " . ($q['company'] ?: '—') . "\n"
        . "Email: {$q['email']}\nPhone: " . ($q['phone'] ?: '—') . "\n"
        . "Project type: " . ($q['projectType'] ?: '—') . "\nServices: {$services}\n"
        . "Currency: " . ($q['currency'] ?: '—') . "\n"
        . "Budget: " . ($q['budgetRange'] ?: '—') . "\nTimeline: " . ($q['timeline'] ?: '—') . "\n\n"
        . "Project details:\n{$q['details']}";
    send_smtp_mail(mail_recipients(), $subject, $html, $text, $q['email'], '');
}
