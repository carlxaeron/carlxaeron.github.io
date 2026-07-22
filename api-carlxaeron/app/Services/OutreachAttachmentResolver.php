<?php

namespace App\Services;

/**
 * Resolves optional outreach email attachments from URL or base64 payloads.
 *
 * Agents/admin pass website + admin preview screenshots on initial send:
 *   attachments: [
 *     { "filename": "website-preview.jpg", "url": "https://…" },
 *     { "filename": "admin-preview.jpg", "contentBase64": "…" }
 *   ]
 */
final class OutreachAttachmentResolver
{
    public const MAX_ATTACHMENTS = 4;

    public const MAX_BYTES = 5 * 1024 * 1024;

    /** @var list<string> */
    private const ALLOWED_MIME = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    /**
     * @return list<array{filename:string,mime:string,content:string}>
     */
    public function resolve(mixed $raw): array
    {
        if ($raw === null || $raw === '') {
            return [];
        }
        if (! is_array($raw)) {
            throw new \InvalidArgumentException('attachments must be an array');
        }

        $out = [];
        foreach (array_values($raw) as $i => $item) {
            if ($i >= self::MAX_ATTACHMENTS) {
                throw new \InvalidArgumentException('Too many attachments (max '.self::MAX_ATTACHMENTS.')');
            }
            if (! is_array($item)) {
                throw new \InvalidArgumentException('Each attachment must be an object');
            }
            $out[] = $this->resolveOne($item, $i);
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array{filename:string,mime:string,content:string}
     */
    private function resolveOne(array $item, int $index): array
    {
        $filename = $this->sanitizeFilename((string) ($item['filename'] ?? ''), $index);
        $url = trim((string) ($item['url'] ?? ''));
        $b64 = trim((string) ($item['contentBase64'] ?? $item['base64'] ?? ''));

        if ($url !== '' && $b64 !== '') {
            throw new \InvalidArgumentException("Attachment {$filename}: provide url or contentBase64, not both");
        }
        if ($url === '' && $b64 === '') {
            throw new \InvalidArgumentException("Attachment {$filename}: missing url or contentBase64");
        }

        if ($b64 !== '') {
            $content = $this->decodeBase64($b64, $filename);
        } else {
            $content = $this->downloadUrl($url, $filename);
        }

        $len = strlen($content);
        if ($len === 0) {
            throw new \InvalidArgumentException("Attachment {$filename}: empty content");
        }
        if ($len > self::MAX_BYTES) {
            throw new \InvalidArgumentException("Attachment {$filename}: exceeds ".self::MAX_BYTES.' bytes');
        }

        $mime = $this->detectMime($content, (string) ($item['contentType'] ?? $item['mime'] ?? ''));
        if (! in_array($mime, self::ALLOWED_MIME, true)) {
            throw new \InvalidArgumentException("Attachment {$filename}: unsupported type {$mime}");
        }

        $filename = $this->ensureExtension($filename, $mime);

        return [
            'filename' => $filename,
            'mime' => $mime,
            'content' => $content,
        ];
    }

    private function sanitizeFilename(string $name, int $index): string
    {
        $name = basename(str_replace(["\0", '\\'], '', trim($name)));
        $name = preg_replace('/[^A-Za-z0-9._-]+/', '-', $name) ?? '';
        $name = trim($name, '.-');
        if ($name === '' || $name === '.' || $name === '..') {
            return 'preview-'.($index + 1).'.jpg';
        }
        if (strlen($name) > 120) {
            $name = substr($name, 0, 120);
        }

        return $name;
    }

    private function decodeBase64(string $b64, string $filename): string
    {
        if (preg_match('/^data:([^;]+);base64,(.+)$/s', $b64, $m)) {
            $b64 = $m[2];
        }
        $b64 = preg_replace('/\s+/', '', $b64) ?? '';
        $decoded = base64_decode($b64, true);
        if ($decoded === false) {
            throw new \InvalidArgumentException("Attachment {$filename}: invalid base64");
        }

        return $decoded;
    }

    private function downloadUrl(string $url, string $filename): string
    {
        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            throw new \InvalidArgumentException("Attachment {$filename}: invalid url");
        }
        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
        if (! in_array($scheme, ['http', 'https'], true)) {
            throw new \InvalidArgumentException("Attachment {$filename}: url must be http(s)");
        }

        $ctx = stream_context_create([
            'http' => [
                'timeout' => 20,
                'follow_location' => 1,
                'max_redirects' => 3,
                'user_agent' => 'carlmanuel-outreach-attachments/1.0',
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
            ],
        ]);

        $data = @file_get_contents($url, false, $ctx);
        if ($data === false) {
            throw new \InvalidArgumentException("Attachment {$filename}: failed to download url");
        }

        return $data;
    }

    private function detectMime(string $content, string $hint): string
    {
        $hint = strtolower(trim($hint));
        if (in_array($hint, self::ALLOWED_MIME, true)) {
            return $hint;
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detected = (string) $finfo->buffer($content);
        if (in_array($detected, self::ALLOWED_MIME, true)) {
            return $detected;
        }

        // Fallback magic bytes
        if (str_starts_with($content, "\xff\xd8\xff")) {
            return 'image/jpeg';
        }
        if (str_starts_with($content, "\x89PNG\r\n\x1a\n")) {
            return 'image/png';
        }
        if (str_starts_with($content, 'GIF87a') || str_starts_with($content, 'GIF89a')) {
            return 'image/gif';
        }
        if (str_starts_with($content, 'RIFF') && str_contains(substr($content, 0, 16), 'WEBP')) {
            return 'image/webp';
        }

        return $detected !== '' ? $detected : 'application/octet-stream';
    }

    private function ensureExtension(string $filename, string $mime): string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
        ];
        $ext = $map[$mime] ?? 'bin';
        if (! preg_match('/\.(jpe?g|png|gif|webp)$/i', $filename)) {
            return $filename.'.'.$ext;
        }

        return $filename;
    }
}
