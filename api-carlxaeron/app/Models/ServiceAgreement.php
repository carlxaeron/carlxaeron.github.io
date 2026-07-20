<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ServiceAgreement extends Model
{
    public const STATUS_DRAFT = 'draft';

    public const STATUS_SENT = 'sent';

    public const STATUS_VIEWED = 'viewed';

    public const STATUS_SIGNED = 'signed';

    public const STATUS_EXPIRED = 'expired';

    public const STATUS_REVOKED = 'revoked';

    public const EXPIRY_DAYS = 14;

    public const SIGN_BASE_URL = 'https://carlmanuel.com/?sign=';

    protected $table = 'service_agreements';

    protected $fillable = [
        'token',
        'slug',
        'business_name',
        'client_email',
        'client_name',
        'form_json',
        'filled_html',
        'status',
        'client_signatory_name',
        'client_signatory_title',
        'client_signed_at',
        'client_signature_data',
        'client_ip',
        'user_agent',
        'sent_at',
        'viewed_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'form_json' => 'array',
            'client_signed_at' => 'datetime',
            'sent_at' => 'datetime',
            'viewed_at' => 'datetime',
            'expires_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public static function generateToken(): string
    {
        return Str::random(64);
    }

    public function signUrl(): string
    {
        return self::SIGN_BASE_URL.$this->token;
    }

    public function isExpired(): bool
    {
        if ($this->status === self::STATUS_SIGNED) {
            return false;
        }

        if ($this->status === self::STATUS_EXPIRED) {
            return true;
        }

        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isSignable(): bool
    {
        if ($this->status === self::STATUS_REVOKED || $this->status === self::STATUS_SIGNED) {
            return false;
        }

        if ($this->isExpired()) {
            return false;
        }

        return in_array($this->status, [self::STATUS_SENT, self::STATUS_VIEWED, self::STATUS_DRAFT], true);
    }

    /**
     * Persist expired status when the link has passed expires_at.
     */
    public function syncExpiredStatus(): void
    {
        if ($this->status === self::STATUS_SIGNED || $this->status === self::STATUS_REVOKED) {
            return;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast() && $this->status !== self::STATUS_EXPIRED) {
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
            'businessName' => $this->business_name,
            'clientEmail' => $this->client_email,
            'clientName' => $this->client_name,
            'formJson' => $this->form_json ?? [],
            'filledHtml' => $this->filled_html,
            'status' => $this->status,
            'clientSignatoryName' => $this->client_signatory_name,
            'clientSignatoryTitle' => $this->client_signatory_title,
            'clientSignedAt' => $this->client_signed_at?->toIso8601String(),
            'clientSignatureData' => $this->client_signature_data,
            'clientIp' => $this->client_ip,
            'userAgent' => $this->user_agent,
            'sentAt' => $this->sent_at?->toIso8601String(),
            'viewedAt' => $this->viewed_at?->toIso8601String(),
            'expiresAt' => $this->expires_at?->toIso8601String(),
            'signUrl' => $this->signUrl(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Public payload for the portfolio sign page (no IP/UA audit fields).
     *
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        return [
            'token' => $this->token,
            'slug' => $this->slug,
            'businessName' => $this->business_name,
            'clientName' => $this->client_name,
            'filledHtml' => $this->filled_html,
            'status' => $this->status,
            'signable' => $this->isSignable(),
            'clientSignatoryName' => $this->client_signatory_name,
            'clientSignatoryTitle' => $this->client_signatory_title,
            'clientSignedAt' => $this->client_signed_at?->toIso8601String(),
            'clientSignatureData' => $this->status === self::STATUS_SIGNED
                ? $this->client_signature_data
                : null,
            'expiresAt' => $this->expires_at?->toIso8601String(),
            'viewedAt' => $this->viewed_at?->toIso8601String(),
        ];
    }
}
