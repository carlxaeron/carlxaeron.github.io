<?php

declare(strict_types=1);

/**
 * Portfolio ChatAgent → OpenAI, Firebase-compatible choices envelope.
 */

function assistant_context_path(): string
{
    return dirname(__DIR__) . '/data/assistant-context.json';
}

/** @return array<string,mixed> */
function assistant_load_context(): array
{
    $path = assistant_context_path();
    if (!is_file($path)) {
        throw new RuntimeException('assistant-context.json missing — run scripts/build-assistant-context.js');
    }
    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        throw new RuntimeException('assistant-context.json empty');
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('assistant-context.json invalid JSON');
    }
    return $decoded;
}

function assistant_system_prompt(array $context): string
{
    return 'You are Carl Louis Manuel assistant and you will only answer from these data and answer it professionally: '
        . json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

/**
 * Normalize OpenAI-style chat messages from the client.
 * @param mixed $messages
 * @return list<array{role:string,content:string}>
 */
function assistant_normalize_messages(mixed $messages): array
{
    if (!is_array($messages) || $messages === []) {
        return [];
    }
    $out = [];
    foreach ($messages as $m) {
        if (!is_array($m)) {
            continue;
        }
        $role = trim((string) ($m['role'] ?? ''));
        $content = trim((string) ($m['content'] ?? ''));
        if ($role === '' || $content === '') {
            continue;
        }
        if (!in_array($role, ['system', 'user', 'assistant'], true)) {
            continue;
        }
        // Cap each message to keep OpenAI payload reasonable.
        $out[] = [
            'role' => $role,
            'content' => mb_substr($content, 0, 4000),
        ];
        if (count($out) >= 40) {
            break;
        }
    }
    return $out;
}

/**
 * @param list<array{role:string,content:string}> $messages
 * @return list<array{message:array{role:string,content:string}}>
 */
function assistant_openai_chat(array $messages, string $apiKey): array
{
    $context = assistant_load_context();
    $payload = [
        'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo') ?? 'gpt-3.5-turbo',
        'messages' => array_merge(
            [['role' => 'system', 'content' => assistant_system_prompt($context)]],
            $messages
        ),
    ];

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    if ($ch === false) {
        throw new RuntimeException('curl_init failed');
    }
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
    ]);
    $raw = curl_exec($ch);
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($errno !== 0 || $raw === false) {
        throw new RuntimeException('OpenAI request failed: ' . $err);
    }
    $json = json_decode($raw, true);
    if (!is_array($json)) {
        throw new RuntimeException('OpenAI returned invalid JSON');
    }
    if ($code >= 400 || empty($json['choices']) || !is_array($json['choices'])) {
        $detail = is_string($json['error']['message'] ?? null) ? $json['error']['message'] : ('HTTP ' . $code);
        throw new RuntimeException('OpenAI error: ' . $detail);
    }

    // Match Firebase envelope: data = choices array (ChatAgent reads data[0].message.content)
    return $json['choices'];
}

function route_assistant(): void
{
    handle_preflight();
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        send_error('Method not allowed');
    }
    require_browser_origin();
    rate_limit_route('assistant');

    $apiKey = env('OPENAI_API_KEY');
    if (!$apiKey) {
        send_error('OPENAI_API_KEY not configured', [], 500);
    }

    $body = json_body();
    $messages = assistant_normalize_messages($body['messages'] ?? null);
    if ($messages === []) {
        send_error('Missing required fields');
    }

    try {
        $choices = assistant_openai_chat($messages, $apiKey);
        send_success('', $choices);
    } catch (Throwable $e) {
        error_log('assistant: ' . $e->getMessage());
        send_error('Error sending request to AI assistant', [], 500);
    }
}
