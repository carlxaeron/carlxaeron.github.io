<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\OutreachJob;
use App\Models\Quotation;
use App\Models\User;
use App\Services\AnalyticsSummaryService;
use App\Services\PortfolioContentService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class AdminController extends Controller
{
    public function __construct(
        private AnalyticsSummaryService $analyticsSummary,
        private PortfolioContentService $portfolioContent,
    ) {}

    public function login(Request $request): JsonResponse
    {
        $email = trim((string) $request->input('email', ''));
        $password = (string) $request->input('password', '');

        if ($email === '' || $password === '') {
            return ApiResponse::error('Missing email or password', [], 401);
        }

        $user = User::query()->where('email', $email)->first();
        if ($user === null || ! Hash::check($password, $user->password)) {
            return ApiResponse::error('Invalid credentials', [], 401);
        }

        $token = $user->createToken('admin')->plainTextToken;

        return ApiResponse::success('OK', [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return ApiResponse::success('Logged out');
    }

    public function summary(): JsonResponse
    {
        return ApiResponse::success('OK', $this->analyticsSummary->build(maskSlugs: false));
    }

    public function analytics(Request $request): JsonResponse
    {
        $days = (int) $request->input('days', 30);
        if (! in_array($days, [7, 14, 30, 90], true)) {
            $days = 30;
        }

        return ApiResponse::success(
            'OK',
            $this->analyticsSummary->buildDetailed(days: $days, maskSlugs: false)
        );
    }

    public function contacts(Request $request): JsonResponse
    {
        $perPage = min(100, max(1, (int) $request->input('perPage', 25)));
        $page = Contact::query()
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return ApiResponse::success('OK', [
            'items' => $page->items(),
            'pagination' => [
                'currentPage' => $page->currentPage(),
                'lastPage' => $page->lastPage(),
                'perPage' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function quotations(Request $request): JsonResponse
    {
        $perPage = min(100, max(1, (int) $request->input('perPage', 25)));
        $page = Quotation::query()
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return ApiResponse::success('OK', [
            'items' => $page->items(),
            'pagination' => [
                'currentPage' => $page->currentPage(),
                'lastPage' => $page->lastPage(),
                'perPage' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function outreach(): JsonResponse
    {
        $jobs = OutreachJob::query()
            ->orderByDesc('updated_at')
            ->get();

        return ApiResponse::success('OK', [
            'items' => $jobs,
        ]);
    }

    public function outreachPause(Request $request): JsonResponse
    {
        $slug = substr(trim((string) $request->input('slug', '')), 0, 64);
        $email = trim((string) $request->input('contactEmail', ''));

        if ($slug === '') {
            return ApiResponse::error('Missing slug');
        }

        $query = OutreachJob::query()->where('slug', $slug);
        if ($email !== '') {
            $query->where('contact_email', $email);
        }

        $updated = $query->update([
            'auto_followup' => false,
            'status' => 'paused',
            'next_follow_up_at' => null,
        ]);

        return ApiResponse::success('Outreach paused', [
            'slug' => $slug,
            'updated' => $updated,
        ]);
    }

    public function contentShow(string $section): JsonResponse
    {
        if (! $this->portfolioContent->isAllowedSection($section)) {
            return ApiResponse::error('Unknown content section', [], 404);
        }

        return ApiResponse::success('OK', $this->portfolioContent->read($section));
    }

    public function contentUpdate(Request $request, string $section): JsonResponse
    {
        if (! $this->portfolioContent->isAllowedSection($section)) {
            return ApiResponse::error('Unknown content section', [], 404);
        }

        if (! $request->has('content')) {
            return ApiResponse::error('Missing content payload');
        }

        try {
            $result = $this->portfolioContent->upsert($section, $request->input('content'));
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success('Content saved', $result);
    }
}
