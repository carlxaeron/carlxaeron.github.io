<?php

namespace App\Services;

use App\Mail\PreviewUnlockRequestMail;
use App\Models\PreviewAccessToken;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Mint / redeem / revoke one-time Netlify preview access tokens.
 */
final class PreviewAccessService
{
    public const UNLOCK_MARKER = '1';

    public function __construct(
        private PushNotificationService $push,
    ) {}

    /**
     * Create unused site and/or admin tokens. Optionally revoke prior unused tokens for the same slug+scopes.
     *
     * @param  list<string>  $scopes
     * @return list<PreviewAccessToken>
     */
    public function mint(
        string $slug,
        string $netlifyHost,
        array $scopes = PreviewAccessToken::SCOPES,
        ?string $contactEmail = null,
        ?int $outreachJobId = null,
        bool $revokeExistingUnused = true,
    ): array {
        $slug = substr(trim($slug), 0, 64);
        $host = PreviewAccessToken::normalizeHost($netlifyHost);
        if ($slug === '' || $host === '') {
            throw new \InvalidArgumentException('Missing slug or netlifyHost');
        }

        $scopes = array_values(array_unique(array_filter(
            $scopes,
            static fn (string $s): bool => in_array($s, PreviewAccessToken::SCOPES, true),
        )));
        if ($scopes === []) {
            $scopes = PreviewAccessToken::SCOPES;
        }

        $email = $contactEmail !== null ? strtolower(trim($contactEmail)) : null;
        if ($email === '') {
            $email = null;
        }

        return DB::transaction(function () use ($slug, $host, $scopes, $email, $outreachJobId, $revokeExistingUnused): array {
            if ($revokeExistingUnused) {
                PreviewAccessToken::query()
                    ->where('slug', $slug)
                    ->whereIn('scope', $scopes)
                    ->where('status', PreviewAccessToken::STATUS_UNUSED)
                    ->update(['status' => PreviewAccessToken::STATUS_REVOKED]);
            }

            $now = now();
            $created = [];
            foreach ($scopes as $scope) {
                $created[] = PreviewAccessToken::query()->create([
                    'token' => PreviewAccessToken::generateToken(),
                    'slug' => $slug,
                    'netlify_host' => $host,
                    'scope' => $scope,
                    'status' => PreviewAccessToken::STATUS_UNUSED,
                    'expires_at' => $now->copy()->addDays(PreviewAccessToken::EXPIRY_DAYS),
                    'outreach_job_id' => $outreachJobId,
                    'contact_email' => $email,
                    'unlock_request_count' => 0,
                ]);
            }

            return $created;
        });
    }

    /**
     * Mint site + admin and return access URLs keyed by scope.
     *
     * @return array{site?:string,admin?:string,tokens:list<PreviewAccessToken>}
     */
    public function mintPair(
        string $slug,
        string $netlifyHost,
        ?string $contactEmail = null,
        ?int $outreachJobId = null,
    ): array {
        $tokens = $this->mint($slug, $netlifyHost, PreviewAccessToken::SCOPES, $contactEmail, $outreachJobId, true);
        $urls = ['tokens' => $tokens];
        foreach ($tokens as $token) {
            $urls[$token->scope] = $token->accessUrl();
        }

        return $urls;
    }

    /**
     * Atomically consume an unused token. Returns ok payload or denied reason.
     *
     * @return array{ok:bool,reason?:string,slug?:string,scope?:string,unlockMarker?:string}
     */
    public function redeem(
        string $token,
        string $host,
        string $path,
        ?string $ip = null,
        ?string $userAgent = null,
    ): array {
        $token = trim($token);
        $host = PreviewAccessToken::normalizeHost($host);
        $scope = PreviewAccessToken::scopeFromPath($path);

        if ($token === '' || strlen($token) > 64 || $host === '') {
            return ['ok' => false, 'reason' => 'invalid'];
        }

        $row = PreviewAccessToken::query()->where('token', $token)->first();
        if ($row === null) {
            return ['ok' => false, 'reason' => 'invalid'];
        }

        $row->syncExpiredStatus();
        $row->refresh();

        if ($row->status === PreviewAccessToken::STATUS_REVOKED) {
            return ['ok' => false, 'reason' => 'revoked', 'slug' => $row->slug, 'scope' => $row->scope];
        }
        if ($row->status === PreviewAccessToken::STATUS_EXPIRED || $row->isExpired()) {
            return ['ok' => false, 'reason' => 'expired', 'slug' => $row->slug, 'scope' => $row->scope];
        }
        if ($row->status === PreviewAccessToken::STATUS_USED) {
            return ['ok' => false, 'reason' => 'used', 'slug' => $row->slug, 'scope' => $row->scope];
        }
        if ($row->status !== PreviewAccessToken::STATUS_UNUSED) {
            return ['ok' => false, 'reason' => 'invalid', 'slug' => $row->slug, 'scope' => $row->scope];
        }

        if (PreviewAccessToken::normalizeHost((string) $row->netlify_host) !== $host) {
            return ['ok' => false, 'reason' => 'host_mismatch', 'slug' => $row->slug, 'scope' => $row->scope];
        }
        if ($row->scope !== $scope) {
            return ['ok' => false, 'reason' => 'scope_mismatch', 'slug' => $row->slug, 'scope' => $row->scope];
        }

        $affected = PreviewAccessToken::query()
            ->where('id', $row->id)
            ->where('status', PreviewAccessToken::STATUS_UNUSED)
            ->where(function ($q): void {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->update([
                'status' => PreviewAccessToken::STATUS_USED,
                'used_at' => now(),
                'used_ip' => $ip !== null && $ip !== '' ? substr($ip, 0, 64) : null,
                'used_ua' => $userAgent !== null && $userAgent !== '' ? substr($userAgent, 0, 512) : null,
                'updated_at' => now(),
            ]);

        if ($affected !== 1) {
            return ['ok' => false, 'reason' => 'used', 'slug' => $row->slug, 'scope' => $row->scope];
        }

        return [
            'ok' => true,
            'slug' => $row->slug,
            'scope' => $row->scope,
            'unlockMarker' => self::UNLOCK_MARKER,
        ];
    }

    public function revoke(PreviewAccessToken $token): PreviewAccessToken
    {
        if ($token->status === PreviewAccessToken::STATUS_USED) {
            // Still allow revoke to block any residual edge confusion; status stays used historically
            // but plan statuses include revoked — prefer marking revoked only when not used.
        }

        if ($token->status === PreviewAccessToken::STATUS_UNUSED) {
            $token->status = PreviewAccessToken::STATUS_REVOKED;
            $token->save();
        }

        return $token->fresh();
    }

    /**
     * Record unlock request, email Carl, and push admins.
     *
     * @return array{ok:bool,slug:string,notified:bool}
     */
    public function requestUnlock(
        string $slug,
        ?string $host = null,
        ?string $token = null,
        ?string $message = null,
        ?string $label = null,
    ): array {
        $slug = substr(trim($slug), 0, 64);
        $hostNorm = $host !== null && trim($host) !== ''
            ? PreviewAccessToken::normalizeHost($host)
            : null;

        $row = null;
        if ($token !== null && trim($token) !== '') {
            $row = PreviewAccessToken::query()->where('token', trim($token))->first();
            if ($row !== null) {
                $slug = $slug !== '' ? $slug : (string) $row->slug;
                $hostNorm = $hostNorm ?? PreviewAccessToken::normalizeHost((string) $row->netlify_host);
            }
        }

        if ($slug === '' && $hostNorm !== null) {
            $byHost = PreviewAccessToken::query()
                ->where('netlify_host', $hostNorm)
                ->orderByDesc('id')
                ->first();
            if ($byHost !== null) {
                $slug = (string) $byHost->slug;
                $row = $row ?? $byHost;
            }
        }

        if ($slug === '') {
            throw new \InvalidArgumentException('Missing slug or host');
        }

        if ($row === null) {
            $row = PreviewAccessToken::query()
                ->where('slug', $slug)
                ->when($hostNorm !== null, fn ($q) => $q->where('netlify_host', $hostNorm))
                ->orderByDesc('id')
                ->first();
        }

        if ($row !== null) {
            $row->unlock_request_count = (int) $row->unlock_request_count + 1;
            $row->last_unlock_requested_at = now();
            $row->save();
            $hostNorm = $hostNorm ?? PreviewAccessToken::normalizeHost((string) $row->netlify_host);
        }

        $business = trim((string) ($label ?: $slug));
        $msg = trim((string) ($message ?? ''));
        $when = now()->toIso8601String();
        $status = $row?->status ?? 'unknown';
        $scope = $row?->scope ?? null;
        $previewUrl = 'https://carlmanuel.com/?preview='.$slug;
        $directUrl = $hostNorm !== null ? 'https://'.$hostNorm.'/' : null;

        $this->sendUnlockEmail($business, $slug, $hostNorm, $status, $scope, $msg, $when, $previewUrl, $directUrl);
        $this->tryPush(
            'Preview unlock request',
            "{$business} asked to unlock the demo again",
            [
                'type' => 'preview_unlock_request',
                'slug' => $slug,
                'host' => $hostNorm,
                'scope' => $scope,
                'url' => '/#admin',
            ],
        );

        return [
            'ok' => true,
            'slug' => $slug,
            'notified' => true,
        ];
    }

    private function sendUnlockEmail(
        string $business,
        string $slug,
        ?string $host,
        string $status,
        ?string $scope,
        string $message,
        string $when,
        string $previewUrl,
        ?string $directUrl,
    ): void {
        $to = $this->mailRecipients();
        if ($to === []) {
            Log::warning('Preview unlock notify skipped: no MAIL_TO recipients');

            return;
        }

        $subject = "Unlock request — {$business}";
        $html = '<h2>Preview unlock request</h2>'
            .'<p>A prospect asked to open the Netlify demo again (one-time link already used or locked).</p>'
            .'<p><strong>Business:</strong> '.e($business).'</p>'
            .'<p><strong>Slug:</strong> '.e($slug).'</p>'
            .($host !== null ? '<p><strong>Host:</strong> '.e($host).'</p>' : '')
            .($scope !== null ? '<p><strong>Last scope:</strong> '.e($scope).'</p>' : '')
            .'<p><strong>Token status:</strong> '.e($status).'</p>'
            .($message !== '' ? '<p><strong>Message:</strong> '.e($message).'</p>' : '')
            .'<p><strong>Portfolio preview:</strong> <a href="'.e($previewUrl).'">'.e($previewUrl).'</a></p>'
            .($directUrl !== null ? '<p><strong>Direct host:</strong> <a href="'.e($directUrl).'">'.e($directUrl).'</a></p>' : '')
            .'<p><strong>Time:</strong> '.e($when).'</p>'
            .'<p>Reissue one-time links from Admin → Preview access (or mint via API) when ready.</p>';

        $text = "Preview unlock request\n\n"
            ."Business: {$business}\n"
            ."Slug: {$slug}\n"
            .($host !== null ? "Host: {$host}\n" : '')
            .($scope !== null ? "Last scope: {$scope}\n" : '')
            ."Token status: {$status}\n"
            .($message !== '' ? "Message: {$message}\n" : '')
            ."Portfolio preview: {$previewUrl}\n"
            .($directUrl !== null ? "Direct host: {$directUrl}\n" : '')
            ."Time: {$when}\n\n"
            ."Reissue one-time links from Admin when ready.\n";

        try {
            $bccList = array_values(array_filter(
                $this->bccRecipients(),
                static fn (string $addr): bool => ! in_array($addr, $to, true),
            ));
            $mail = Mail::to($to);
            if ($bccList !== []) {
                $mail->bcc($bccList);
            }
            $mail->send(new PreviewUnlockRequestMail($subject, $html, $text));
        } catch (Throwable $e) {
            Log::warning('Preview unlock notify SMTP failed: '.$e->getMessage());
        }
    }

    /** @return list<string> */
    private function mailRecipients(): array
    {
        $raw = (string) config('portfolio.mail_to', '');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }

    /** @return list<string> */
    private function bccRecipients(): array
    {
        $raw = (string) config('portfolio.mail_bcc', 'info@carlmanuel.com');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function tryPush(string $title, string $body, array $data): void
    {
        try {
            $this->push->sendToAdmins($title, $body, $data);
        } catch (Throwable) {
            // Push must never block unlock notify.
        }
    }
}
