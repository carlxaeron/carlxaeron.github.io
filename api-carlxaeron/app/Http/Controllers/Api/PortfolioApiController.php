<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\PreviewFeedback;
use App\Models\Quotation;
use App\Models\Visit;
use App\Services\AnalyticsExclusion;
use App\Services\AnalyticsSummaryService;
use App\Services\PortfolioContentService;
use App\Services\PortfolioMailer;
use App\Services\PushNotificationService;
use App\Support\ApiResponse;
use App\Support\FormAntiSpam;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PortfolioApiController extends Controller
{
    public function __construct(
        private AnalyticsExclusion $analytics,
        private AnalyticsSummaryService $analyticsSummary,
        private PortfolioContentService $portfolioContent,
        private PortfolioMailer $mailer,
        private PushNotificationService $push,
    ) {}

    public function health(): JsonResponse
    {
        return ApiResponse::success('OK', ['ok' => true, 'service' => 'api-carlxaeron']);
    }

    public function trackVisit(Request $request): JsonResponse
    {
        $visitorId = trim((string) $request->input('visitorId', ''));
        $sessionId = trim((string) $request->input('sessionId', ''));
        if ($visitorId === '' || $sessionId === '') {
            return ApiResponse::error('Missing required fields');
        }

        if ($this->analytics->isExcludedRequest($visitorId)) {
            return ApiResponse::success('Visit skipped (excluded)');
        }

        $userAgent = $request->has('userAgent')
            ? substr((string) $request->input('userAgent'), 0, 512)
            : null;

        Visit::query()->create([
            'visitor_id' => substr($visitorId, 0, 64),
            'session_id' => substr($sessionId, 0, 64),
            'event_type' => substr(trim((string) $request->input('eventType', 'pageview')), 0, 32),
            'section' => $this->nullableString($request->input('section'), 32),
            'preview_slug' => $this->nullableString($request->input('previewSlug'), 64),
            'path' => $request->has('path') ? substr((string) $request->input('path'), 0, 512) : null,
            'referrer' => $request->has('referrer') ? substr((string) $request->input('referrer'), 0, 512) : null,
            'user_agent' => $userAgent,
            'language' => $request->has('language') ? substr((string) $request->input('language'), 0, 32) : null,
            'screen_json' => $request->input('screen'),
            'viewport_json' => $request->input('viewport'),
            'device' => $this->analytics->parseDevice($userAgent),
            'ip_hash' => $this->analytics->hashIp($this->analytics->clientIp()),
            'created_at' => now(),
        ]);

        return ApiResponse::success('Visit recorded');
    }

    public function previewFeedback(Request $request): JsonResponse
    {
        $visitorId = trim((string) $request->input('visitorId', ''));
        $sessionId = trim((string) $request->input('sessionId', ''));
        $previewSlug = trim((string) $request->input('previewSlug', ''));
        $sentiment = strtolower(trim((string) $request->input('sentiment', '')));
        $comment = trim((string) $request->input('comment', ''));

        if ($visitorId === '' || $sessionId === '' || $previewSlug === '' || $sentiment === '') {
            return ApiResponse::error('Missing required fields');
        }
        if ($sentiment !== 'like' && $sentiment !== 'dislike') {
            return ApiResponse::error('Invalid sentiment');
        }
        if ($sentiment === 'dislike' && $comment === '') {
            return ApiResponse::error('Comment is required when disliking');
        }

        $vid = substr($visitorId, 0, 64);
        $slug = substr($previewSlug, 0, 64);

        if ($this->analytics->isExcludedRequest($vid)) {
            return ApiResponse::success('Feedback skipped (excluded)');
        }

        if (PreviewFeedback::query()->where('visitor_id', $vid)->where('preview_slug', $slug)->exists()) {
            return ApiResponse::error('You already submitted feedback for this preview');
        }

        try {
            PreviewFeedback::query()->create([
                'visitor_id' => $vid,
                'session_id' => substr($sessionId, 0, 64),
                'preview_slug' => $slug,
                'preview_label' => $request->has('previewLabel')
                    ? substr((string) $request->input('previewLabel'), 0, 128)
                    : null,
                'sentiment' => $sentiment,
                'comment' => $comment !== '' ? substr($comment, 0, 1000) : null,
                'ip_hash' => $this->analytics->hashIp($this->analytics->clientIp()),
                'created_at' => now(),
            ]);
        } catch (QueryException $e) {
            if ($this->isUniqueViolation($e)) {
                return ApiResponse::error('You already submitted feedback for this preview');
            }
            throw $e;
        }

        return ApiResponse::success('Feedback recorded');
    }

    public function analyticsSummary(): JsonResponse
    {
        return ApiResponse::success('OK', $this->analyticsSummary->build(maskSlugs: true));
    }

    public function contact(Request $request): JsonResponse
    {
        if (FormAntiSpam::rejectReason($request) !== null) {
            return ApiResponse::success(FormAntiSpam::silentOkMessage('contact'));
        }

        $name = trim((string) $request->input('name', ''));
        $email = trim((string) $request->input('email', ''));
        $message = trim((string) $request->input('message', ''));
        if ($name === '' || $email === '' || $message === '') {
            return ApiResponse::error('Missing required fields');
        }

        Contact::query()->create([
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'created_at' => now(),
        ]);

        $this->mailer->trySend(
            fn () => $this->mailer->sendContact($name, $email, $message),
            'contact'
        );

        $this->tryPushToAdmins(
            'New contact message',
            "{$name} — {$email}",
            ['type' => 'contact', 'url' => 'https://carlmanuel.com/#admin']
        );

        return ApiResponse::success('Contact request received');
    }

    public function quotation(Request $request): JsonResponse
    {
        if (FormAntiSpam::rejectReason($request) !== null) {
            return ApiResponse::success(FormAntiSpam::silentOkMessage('quotation'));
        }

        $name = trim((string) $request->input('name', ''));
        $email = trim((string) $request->input('email', ''));
        $details = trim((string) $request->input('details', ''));
        if ($name === '' || $email === '' || $details === '') {
            return ApiResponse::error('Missing required fields');
        }

        $company = trim((string) $request->input('company', ''));
        $phone = trim((string) $request->input('phone', ''));
        $projectType = trim((string) $request->input('projectType', ''));
        $budgetRange = trim((string) $request->input('budgetRange', ''));
        $currency = $this->normalizeQuoteCurrency($request->input('currency'));
        $timeline = trim((string) $request->input('timeline', ''));
        $services = is_array($request->input('services'))
            ? array_values(array_filter(array_map(
                static fn ($s) => trim((string) $s),
                $request->input('services')
            )))
            : [];

        Quotation::query()->create([
            'name' => $name,
            'company' => $company,
            'email' => $email,
            'phone' => $phone,
            'project_type' => $projectType,
            'budget_range' => $budgetRange,
            'currency' => $currency,
            'timeline' => $timeline,
            'services_json' => $services,
            'details' => $details,
            'created_at' => now(),
        ]);

        $quote = [
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
        ];

        $this->mailer->trySend(
            fn () => $this->mailer->sendQuotation($quote),
            'quotation'
        );

        $pushLabel = $company !== '' ? "{$name} ({$company})" : "{$name} — {$email}";
        $this->tryPushToAdmins(
            'New quote request',
            $pushLabel,
            ['type' => 'quotation', 'url' => 'https://carlmanuel.com/#admin']
        );

        return ApiResponse::success('Quote request received');
    }

    public function content(string $section): JsonResponse
    {
        if (! $this->portfolioContent->isAllowedSection($section)) {
            return ApiResponse::error('Unknown content section', [], 404);
        }

        return ApiResponse::success('OK', $this->portfolioContent->read($section));
    }

    private function normalizeQuoteCurrency(mixed $value): ?string
    {
        $code = strtoupper(trim((string) $value));
        if ($code === '') {
            return null;
        }

        return in_array($code, ['PHP', 'USD'], true) ? $code : null;
    }

    private function nullableString(mixed $value, int $max): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return substr((string) $value, 0, $max);
    }

    private function isUniqueViolation(QueryException $e): bool
    {
        $sqlState = $e->errorInfo[0] ?? null;

        return $sqlState === '23000' || (int) $e->getCode() === 23000;
    }

    private function tryPushToAdmins(string $title, string $body, array $data): void
    {
        try {
            $this->push->sendToAdmins($title, $body, $data);
        } catch (\Throwable $e) {
            Log::warning('Push notification failed', [
                'title' => $title,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
