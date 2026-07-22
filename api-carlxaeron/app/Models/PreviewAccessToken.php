<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PreviewAccessToken extends Model
{
    public const STATUS_UNUSED = 'unused';

    public const STATUS_USED = 'used';

    public const STATUS_REVOKED = 'revoked';

    public const STATUS_EXPIRED = 'expired';

    public const SCOPE_SITE = 'site';

    public const SCOPE_ADMIN = 'admin';

    public const EXPIRY_DAYS = 14;

    /** @var list<string> */
    public const SCOPES = [self::SCOPE_SITE, self::SCOPE_ADMIN];

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_UNUSED,
        self::STATUS_USED,
        self::STATUS_REVOKED,
        self::STATUS_EXPIRED,
    ];

    protected $table = 'preview_access_tokens';

    protected $fillable = [
        'token',
        'slug',
        'netlify_host',
        'scope',
        'status',
        'expires_at',
        'used_at',
        'used_ip',
        'used_ua',
        'outreach_job_id',
        'contact_email',
        'unlock_request_count',
        'last_unlock_requested_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
            'last_unlock_requested_at' => 'datetime',
            'unlock_request_count' => 'integer',
            'outreach_job_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public static function generateToken(): string
    {
        return Str::random(64);
    }

    public static function normalizeHost(string $host): string
    {
        $host = strtolower(trim($host));
        $host = preg_replace('#^https?://#', '', $host) ?? $host;
        $host = explode('/', $host, 2)[0];
        $host = explode(':', $host, 2)[0];

        return $host;
    }

    /**
     * Derive scope from request path (/admin… → admin, else site).
     */
    public static function scopeFromPath(string $path): string
    {
        $path = '/'.ltrim(trim($path), '/');
        if ($path === '/admin' || str_starts_with($path, '/admin/')) {
            return self::SCOPE_ADMIN;
        }

        return self::SCOPE_SITE;
    }

    public function accessUrl(): string
    {
        $host = self::normalizeHost((string) $this->netlify_host);
        if ($this->scope === self::SCOPE_ADMIN) {
            return 'https://'.$host.'/admin/?access='.$this->token;
        }

        return 'https://'.$host.'/?access='.$this->token;
    }

    public function isExpired(): bool
    {
        if ($this->status === self::STATUS_EXPIRED) {
            return true;
        }

        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Persist expired status when the unused link has passed expires_at.
     */
    public function syncExpiredStatus(): void
    {
        if ($this->status !== self::STATUS_UNUSED) {
            return;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            $this->status = self::STATUS_EXPIRED;
            $this->save();
        }
    }

    /** @return array<string, mixed> */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'token' => $this->token,
            'slug' => $this->slug,
            'netlifyHost' => $this->netlify_host,
            'scope' => $this->scope,
            'status' => $this->status,
            'expiresAt' => $this->expires_at?->toIso8601String(),
            'usedAt' => $this->used_at?->toIso8601String(),
            'usedIp' => $this->used_ip,
            'usedUa' => $this->used_ua,
            'outreachJobId' => $this->outreach_job_id,
            'contactEmail' => $this->contact_email,
            'unlockRequestCount' => $this->unlock_request_count,
            'lastUnlockRequestedAt' => $this->last_unlock_requested_at?->toIso8601String(),
            'accessUrl' => $this->accessUrl(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
