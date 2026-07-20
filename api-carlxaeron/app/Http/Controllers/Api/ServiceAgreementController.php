<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceAgreement;
use App\Services\AgreementMailer;
use App\Support\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceAgreementController extends Controller
{
    public function __construct(
        private AgreementMailer $mailer,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        $businessName = trim((string) $request->input('businessName', $request->input('business_name', '')));
        $clientEmail = strtolower(trim((string) $request->input('clientEmail', $request->input('client_email', ''))));
        $clientName = trim((string) $request->input('clientName', $request->input('client_name', '')));
        $filledHtml = (string) $request->input('filledHtml', $request->input('filled_html', ''));
        $formJson = $request->input('formJson', $request->input('form_json', []));

        if ($slug === '') {
            return ApiResponse::error('Missing slug');
        }
        if ($businessName === '') {
            return ApiResponse::error('Missing businessName');
        }
        if ($clientEmail === '' || ! filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
            return ApiResponse::error('Invalid clientEmail');
        }
        if ($filledHtml === '') {
            return ApiResponse::error('Missing filledHtml');
        }
        if (! is_array($formJson)) {
            return ApiResponse::error('formJson must be an object');
        }

        $now = now();
        $agreement = ServiceAgreement::query()->create([
            'token' => ServiceAgreement::generateToken(),
            'slug' => $slug,
            'business_name' => $businessName,
            'client_email' => $clientEmail,
            'client_name' => $clientName !== '' ? $clientName : $businessName,
            'form_json' => $formJson,
            'filled_html' => $filledHtml,
            'status' => ServiceAgreement::STATUS_SENT,
            'sent_at' => $now,
            'expires_at' => $now->copy()->addDays(ServiceAgreement::EXPIRY_DAYS),
        ]);

        $send = $this->mailer->sendSignRequest($agreement);
        if (! $send['ok']) {
            Log::warning('Agreement sign-request email failed: '.($send['error'] ?? 'unknown'));

            return ApiResponse::error(
                'Agreement saved but email failed: '.($send['error'] ?? 'SMTP error'),
                $agreement->fresh()->toAdminArray(),
                502,
            );
        }

        return ApiResponse::success('Agreement sent', $agreement->fresh()->toAdminArray());
    }

    public function index(Request $request): JsonResponse
    {
        $query = ServiceAgreement::query()->orderByDesc('created_at');

        $status = trim((string) $request->input('status', ''));
        if ($status !== '') {
            $query->where('status', $status);
        }

        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        if ($slug !== '') {
            $query->where('slug', $slug);
        }

        $perPage = min(100, max(1, (int) $request->input('perPage', 25)));
        $page = $query->paginate($perPage);

        return ApiResponse::success('OK', [
            'items' => array_map(
                static fn (ServiceAgreement $row): array => $row->toAdminArray(),
                $page->items(),
            ),
            'pagination' => [
                'currentPage' => $page->currentPage(),
                'lastPage' => $page->lastPage(),
                'perPage' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $agreement = ServiceAgreement::query()->find($id);
        if ($agreement === null) {
            return ApiResponse::error('Agreement not found', [], 404);
        }

        $agreement->syncExpiredStatus();

        return ApiResponse::success('OK', $agreement->fresh()->toAdminArray());
    }

    public function resend(int $id): JsonResponse
    {
        $agreement = ServiceAgreement::query()->find($id);
        if ($agreement === null) {
            return ApiResponse::error('Agreement not found', [], 404);
        }

        $agreement->syncExpiredStatus();
        $agreement->refresh();

        if ($agreement->status === ServiceAgreement::STATUS_SIGNED) {
            return ApiResponse::error('Agreement already signed');
        }
        if ($agreement->status === ServiceAgreement::STATUS_REVOKED) {
            return ApiResponse::error('Agreement revoked');
        }
        if ($agreement->isExpired()) {
            return ApiResponse::error('Agreement expired');
        }

        $send = $this->mailer->sendSignRequest($agreement);
        if (! $send['ok']) {
            return ApiResponse::error('Resend failed: '.($send['error'] ?? 'SMTP error'), [], 502);
        }

        $agreement->sent_at = now();
        $agreement->status = ServiceAgreement::STATUS_SENT;
        $agreement->save();

        return ApiResponse::success('Agreement resent', $agreement->fresh()->toAdminArray());
    }

    public function revoke(int $id): JsonResponse
    {
        $agreement = ServiceAgreement::query()->find($id);
        if ($agreement === null) {
            return ApiResponse::error('Agreement not found', [], 404);
        }

        if ($agreement->status === ServiceAgreement::STATUS_SIGNED) {
            return ApiResponse::error('Cannot revoke a signed agreement');
        }

        $agreement->status = ServiceAgreement::STATUS_REVOKED;
        $agreement->save();

        return ApiResponse::success('Agreement revoked', $agreement->fresh()->toAdminArray());
    }

    public function publicShow(string $token): JsonResponse
    {
        $agreement = $this->findByToken($token);
        if ($agreement === null) {
            return ApiResponse::error('Agreement not found', [], 404);
        }

        $agreement->syncExpiredStatus();
        $agreement->refresh();

        if ($agreement->status === ServiceAgreement::STATUS_REVOKED) {
            return ApiResponse::error('This agreement link has been revoked', [
                'status' => $agreement->status,
            ], 410);
        }

        if ($agreement->isExpired() && $agreement->status !== ServiceAgreement::STATUS_SIGNED) {
            return ApiResponse::error('This agreement link has expired', [
                'status' => ServiceAgreement::STATUS_EXPIRED,
                'expiresAt' => $agreement->expires_at?->toIso8601String(),
            ], 410);
        }

        if (in_array($agreement->status, [ServiceAgreement::STATUS_SENT, ServiceAgreement::STATUS_DRAFT], true)) {
            $agreement->status = ServiceAgreement::STATUS_VIEWED;
            $agreement->viewed_at = $agreement->viewed_at ?? now();
            $agreement->save();
        }

        return ApiResponse::success('OK', $agreement->fresh()->toPublicArray());
    }

    public function publicSign(Request $request, string $token): JsonResponse
    {
        $agreement = $this->findByToken($token);
        if ($agreement === null) {
            return ApiResponse::error('Agreement not found', [], 404);
        }

        $agreement->syncExpiredStatus();
        $agreement->refresh();

        if ($agreement->status === ServiceAgreement::STATUS_REVOKED) {
            return ApiResponse::error('This agreement link has been revoked', [
                'status' => $agreement->status,
            ], 410);
        }

        if ($agreement->status === ServiceAgreement::STATUS_SIGNED) {
            return ApiResponse::error('Agreement already signed', [
                'status' => $agreement->status,
            ], 409);
        }

        if ($agreement->isExpired()) {
            return ApiResponse::error('This agreement link has expired', [
                'status' => ServiceAgreement::STATUS_EXPIRED,
            ], 410);
        }

        $signatoryName = trim((string) $request->input('signatoryName', $request->input('clientSignatoryName', '')));
        $signatoryTitle = trim((string) $request->input('signatoryTitle', $request->input('clientSignatoryTitle', '')));
        $signatureData = trim((string) $request->input('signatureData', $request->input('clientSignatureData', '')));
        $signedAtRaw = trim((string) $request->input('signedAt', $request->input('clientSignedAt', '')));

        if ($signatoryName === '') {
            return ApiResponse::error('Missing signatoryName');
        }
        if ($signatureData === '') {
            return ApiResponse::error('Missing signatureData');
        }
        if (! $this->isValidSignatureDataUrl($signatureData)) {
            return ApiResponse::error('Invalid signatureData (expected PNG/JPEG/SVG data URL)');
        }
        // Cap ~1.5MB base64 payload
        if (strlen($signatureData) > 1_500_000) {
            return ApiResponse::error('signatureData too large');
        }

        $signedAt = now();
        if ($signedAtRaw !== '') {
            try {
                $signedAt = Carbon::parse($signedAtRaw);
            } catch (\Throwable) {
                return ApiResponse::error('Invalid signedAt date');
            }
        }

        $agreement->client_signatory_name = substr($signatoryName, 0, 255);
        $agreement->client_signatory_title = $signatoryTitle !== '' ? substr($signatoryTitle, 0, 255) : null;
        $agreement->client_signed_at = $signedAt;
        $agreement->client_signature_data = $signatureData;
        $agreement->client_ip = substr((string) $request->ip(), 0, 64) ?: null;
        $agreement->user_agent = substr((string) $request->userAgent(), 0, 512) ?: null;
        $agreement->status = ServiceAgreement::STATUS_SIGNED;
        $agreement->save();

        $notify = $this->mailer->sendSignedNotification($agreement);
        if (! $notify['ok']) {
            Log::warning('Agreement signed notify email failed: '.($notify['error'] ?? 'unknown'));
        }

        return ApiResponse::success('Agreement signed', $agreement->fresh()->toPublicArray());
    }

    private function findByToken(string $token): ?ServiceAgreement
    {
        $token = trim($token);
        if ($token === '' || strlen($token) > 64) {
            return null;
        }

        return ServiceAgreement::query()->where('token', $token)->first();
    }

    private function isValidSignatureDataUrl(string $data): bool
    {
        return (bool) preg_match(
            '#^data:image/(png|jpeg|jpg|svg\+xml);base64,[A-Za-z0-9+/=\s]+$#i',
            $data,
        );
    }
}
