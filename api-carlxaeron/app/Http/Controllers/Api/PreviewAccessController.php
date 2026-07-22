<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PreviewAccessToken;
use App\Services\PreviewAccessService;
use App\Support\ApiResponse;
use App\Support\BrowserOriginGate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class PreviewAccessController extends Controller
{
    public function __construct(
        private PreviewAccessService $previewAccess,
    ) {}

    /**
     * Edge-only: consume one unused token for a matching host + path scope.
     */
    public function redeem(Request $request): JsonResponse
    {
        if (! $this->secretConfigured()) {
            return ApiResponse::error('PREVIEW_ACCESS_SECRET not configured', ['ok' => false, 'reason' => 'misconfigured'], 500);
        }
        if (! $this->secretMatches($request)) {
            return ApiResponse::error('Unauthorized', ['ok' => false, 'reason' => 'unauthorized'], 401);
        }

        $token = (string) $request->input('token', '');
        $host = (string) $request->input('host', $request->input('netlifyHost', ''));
        $path = (string) $request->input('path', '/');
        $clientIp = trim((string) $request->input('clientIp', $request->input('ip', '')));
        $clientUa = trim((string) $request->input('clientUa', $request->input('userAgent', $request->userAgent() ?? '')));

        $result = $this->previewAccess->redeem(
            $token,
            $host,
            $path,
            $clientIp !== '' ? $clientIp : $request->ip(),
            $clientUa !== '' ? $clientUa : null,
        );

        if (! ($result['ok'] ?? false)) {
            return ApiResponse::error('Access denied', $result, 403);
        }

        return ApiResponse::success('OK', $result);
    }

    /**
     * Lock-page Notify Carl button (browser-initiated from Netlify or portfolio).
     */
    public function requestUnlock(Request $request): JsonResponse
    {
        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        $host = trim((string) $request->input('host', $request->input('netlifyHost', '')));
        $token = trim((string) $request->input('token', ''));
        $message = substr(trim((string) $request->input('message', '')), 0, 2000);
        $label = trim((string) $request->input('label', $request->input('businessName', '')));

        if ($slug === '' && $host === '' && $token === '') {
            return ApiResponse::error('Missing slug, host, or token');
        }

        if (! $this->browserMayRequestUnlock($request, $host !== '' ? $host : null)) {
            return ApiResponse::error('Forbidden', [], 403);
        }

        $rateKey = 'preview-unlock:'.($request->ip() ?: 'unknown').':'.($slug !== '' ? $slug : PreviewAccessToken::normalizeHost($host));
        if (RateLimiter::tooManyAttempts($rateKey, 5)) {
            return ApiResponse::error('Too many unlock requests. Try again later.', [], 429);
        }
        RateLimiter::hit($rateKey, 3600);

        try {
            $result = $this->previewAccess->requestUnlock(
                $slug,
                $host !== '' ? $host : null,
                $token !== '' ? $token : null,
                $message !== '' ? $message : null,
                $label !== '' ? $label : null,
            );
        } catch (\InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success('Unlock request sent', $result);
    }

    public function store(Request $request): JsonResponse
    {
        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        $host = trim((string) $request->input('netlifyHost', $request->input('host', '')));
        $contactEmail = trim((string) $request->input('contactEmail', $request->input('contact_email', '')));
        $scopesRaw = $request->input('scopes', PreviewAccessToken::SCOPES);
        $revokeExisting = $request->boolean('revokeExisting', true);

        if ($slug === '') {
            return ApiResponse::error('Missing slug');
        }
        if ($host === '') {
            return ApiResponse::error('Missing netlifyHost');
        }

        $scopes = is_array($scopesRaw) ? $scopesRaw : PreviewAccessToken::SCOPES;
        $scopes = array_map(static fn ($s): string => (string) $s, $scopes);

        try {
            $tokens = $this->previewAccess->mint(
                $slug,
                $host,
                $scopes,
                $contactEmail !== '' ? $contactEmail : null,
                null,
                $revokeExisting,
            );
        } catch (\InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success('Preview access minted', [
            'items' => array_map(
                static fn (PreviewAccessToken $t): array => $t->toAdminArray(),
                $tokens,
            ),
            'urls' => [
                'site' => collect($tokens)->firstWhere('scope', PreviewAccessToken::SCOPE_SITE)?->accessUrl(),
                'admin' => collect($tokens)->firstWhere('scope', PreviewAccessToken::SCOPE_ADMIN)?->accessUrl(),
            ],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        if ($slug === '') {
            return ApiResponse::error('Missing slug');
        }

        $query = PreviewAccessToken::query()
            ->where('slug', $slug)
            ->orderByDesc('created_at');

        $status = trim((string) $request->input('status', ''));
        if ($status !== '') {
            $query->where('status', $status);
        }

        $scope = trim((string) $request->input('scope', ''));
        if ($scope !== '') {
            $query->where('scope', $scope);
        }

        $perPage = min(100, max(1, (int) $request->input('perPage', 25)));
        $page = $query->paginate($perPage);

        return ApiResponse::success('OK', [
            'items' => array_map(
                static fn (PreviewAccessToken $row): array => $row->toAdminArray(),
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

    public function revoke(int $id): JsonResponse
    {
        $token = PreviewAccessToken::query()->find($id);
        if ($token === null) {
            return ApiResponse::error('Token not found', [], 404);
        }

        $updated = $this->previewAccess->revoke($token);

        return ApiResponse::success('Token revoked', $updated->toAdminArray());
    }

    private function secretConfigured(): bool
    {
        return trim((string) config('portfolio.preview_access_secret', '')) !== '';
    }

    private function secretMatches(Request $request): bool
    {
        $expected = (string) config('portfolio.preview_access_secret', '');
        $given = trim((string) (
            $request->header('X-Preview-Access-Secret')
            ?? $request->input('secret', '')
        ));

        return $given !== '' && hash_equals($expected, $given);
    }

    /**
     * Allow portfolio origins, or Origin/Referer host matching the Netlify host being unlocked.
     */
    private function browserMayRequestUnlock(Request $request, ?string $expectedHost): bool
    {
        if (BrowserOriginGate::hasAllowedBrowserOrigin($request)) {
            return true;
        }

        $originHost = $this->hostFromHeader($request->header('Origin'))
            ?? $this->hostFromHeader($request->header('Referer'));

        if ($originHost === null) {
            return false;
        }

        if ($expectedHost !== null && $expectedHost !== '') {
            return $originHost === PreviewAccessToken::normalizeHost($expectedHost);
        }

        // Host omitted — allow if Origin is any known minted netlify host.
        return PreviewAccessToken::query()
            ->where('netlify_host', $originHost)
            ->exists();
    }

    private function hostFromHeader(?string $value): ?string
    {
        $origin = BrowserOriginGate::normalizeOriginUrl($value);
        if ($origin === null) {
            return null;
        }

        $parts = parse_url($origin);

        return isset($parts['host']) ? PreviewAccessToken::normalizeHost((string) $parts['host']) : null;
    }
}
