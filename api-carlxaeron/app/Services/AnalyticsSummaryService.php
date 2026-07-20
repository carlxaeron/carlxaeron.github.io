<?php

namespace App\Services;

use App\Models\OutreachJob;
use App\Models\PreviewFeedback;
use App\Models\Visit;
use Illuminate\Support\Carbon;

class AnalyticsSummaryService
{
    public function __construct(
        private AnalyticsExclusion $analytics,
    ) {}

    /**
     * Public Insights + admin Overview (backward-compatible shape).
     *
     * @return array<string, mixed>
     */
    public function build(bool $maskSlugs = true): array
    {
        $weekAgo = Carbon::now()->subDays(7);

        $visits = Visit::query()
            ->where('created_at', '>=', $weekAgo)
            ->get(['visitor_id', 'event_type', 'preview_slug', 'ip_hash', 'created_at']);

        $allFeedback = PreviewFeedback::query()
            ->get(['visitor_id', 'preview_slug', 'sentiment', 'ip_hash']);

        $visitors = [];
        $previewViews = [];
        $visitDates = [];
        $totalPreviewViews = 0;
        $totalLikes = 0;
        $totalDislikes = 0;
        $totalAgrees = 0;
        $previewLikes = [];
        $previewDislikes = [];
        $previewAgrees = [];

        foreach (Visit::query()->where('event_type', 'preview_view')->get(['visitor_id', 'ip_hash']) as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            $totalPreviewViews++;
        }

        foreach ($visits as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            if ($row->event_type !== 'preview_view') {
                continue;
            }
            if ($row->visitor_id) {
                $visitors[$row->visitor_id] = true;
            }
            if ($row->created_at) {
                $visitDates[] = $row->created_at->format('Y-m-d');
            }
            $slug = (string) ($row->preview_slug ?? '');
            if ($slug !== '') {
                $previewViews[$slug] = ($previewViews[$slug] ?? 0) + 1;
            }
        }

        foreach ($allFeedback as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            $slug = (string) ($row->preview_slug ?? '');
            if ($slug === '') {
                continue;
            }
            if ($row->sentiment === 'like') {
                $totalLikes++;
                $previewLikes[$slug] = ($previewLikes[$slug] ?? 0) + 1;
            }
            if ($row->sentiment === 'dislike') {
                $totalDislikes++;
                $previewDislikes[$slug] = ($previewDislikes[$slug] ?? 0) + 1;
            }
            if ($row->sentiment === 'agree') {
                $totalAgrees++;
                $previewAgrees[$slug] = ($previewAgrees[$slug] ?? 0) + 1;
            }
        }

        $visitsByDay = [];
        $today = Carbon::today();
        for ($i = 6; $i >= 0; $i--) {
            $key = $today->copy()->subDays($i)->format('Y-m-d');
            $visitsByDay[$key] = ['date' => $key, 'count' => 0];
        }
        foreach ($visitDates as $d) {
            if (isset($visitsByDay[$d])) {
                $visitsByDay[$d]['count']++;
            }
        }

        $slugs = array_unique(array_merge(
            array_keys($previewViews),
            array_keys($previewLikes),
            array_keys($previewDislikes),
            array_keys($previewAgrees)
        ));
        $previewStats = [];
        foreach ($slugs as $slug) {
            $previewStats[] = [
                'slug' => $maskSlugs ? $this->analytics->maskClientSlug($slug) : $slug,
                'views' => $previewViews[$slug] ?? 0,
                'likes' => $previewLikes[$slug] ?? 0,
                'dislikes' => $previewDislikes[$slug] ?? 0,
                'agrees' => $previewAgrees[$slug] ?? 0,
            ];
        }
        usort($previewStats, static fn ($a, $b) => $b['views'] <=> $a['views']);

        return [
            'clientSites' => (int) config('portfolio.client_sites_count', 11),
            'totalPreviewViews' => $totalPreviewViews,
            'uniquePreviewVisitorsWeek' => count($visitors),
            'totalLikes' => $totalLikes,
            'totalDislikes' => $totalDislikes,
            'totalAgrees' => $totalAgrees,
            'visitsByDay' => array_values($visitsByDay),
            'previewStats' => $previewStats,
            'generatedAt' => Carbon::now('UTC')->toIso8601String(),
        ];
    }

    /**
     * Admin Analytics tab — visits, feedback, devices, outreach funnel.
     *
     * @return array<string, mixed>
     */
    public function buildDetailed(int $days = 30, bool $maskSlugs = false): array
    {
        $days = max(1, min(90, $days));
        $now = Carbon::now();
        $from = $now->copy()->subDays($days);
        $today = Carbon::today();

        $visits = Visit::query()
            ->where('created_at', '>=', $from)
            ->get([
                'visitor_id',
                'session_id',
                'event_type',
                'section',
                'preview_slug',
                'referrer',
                'device',
                'ip_hash',
                'created_at',
            ]);

        $feedbackInRange = PreviewFeedback::query()
            ->where('created_at', '>=', $from)
            ->orderByDesc('created_at')
            ->get([
                'visitor_id',
                'preview_slug',
                'preview_label',
                'sentiment',
                'comment',
                'ip_hash',
                'created_at',
            ]);

        $allFeedback = PreviewFeedback::query()
            ->get(['visitor_id', 'preview_slug', 'sentiment', 'ip_hash']);

        $visitors = [];
        $sessions = [];
        $pageViews = 0;
        $sectionViews = 0;
        $previewViews = 0;
        $totalEvents = 0;
        $sections = [];
        $previews = [];
        $referrers = [];
        $devices = [];
        $byDay = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $key = $today->copy()->subDays($i)->format('Y-m-d');
            $byDay[$key] = [
                'date' => $key,
                'pageViews' => 0,
                'sectionViews' => 0,
                'previewViews' => 0,
                'total' => 0,
            ];
        }

        foreach ($visits as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            $totalEvents++;
            if ($row->visitor_id) {
                $visitors[$row->visitor_id] = true;
            }
            if ($row->session_id) {
                $sessions[$row->session_id] = true;
            }

            $type = (string) ($row->event_type ?? '');
            $dayKey = $row->created_at?->format('Y-m-d');

            if ($type === 'pageview') {
                $pageViews++;
            } elseif ($type === 'section_view') {
                $sectionViews++;
            } elseif ($type === 'preview_view') {
                $previewViews++;
            }

            if ($dayKey !== null && isset($byDay[$dayKey])) {
                $byDay[$dayKey]['total']++;
                if ($type === 'pageview') {
                    $byDay[$dayKey]['pageViews']++;
                } elseif ($type === 'section_view') {
                    $byDay[$dayKey]['sectionViews']++;
                } elseif ($type === 'preview_view') {
                    $byDay[$dayKey]['previewViews']++;
                }
            }

            $section = trim((string) ($row->section ?? ''));
            if ($section !== '') {
                $sections[$section] = ($sections[$section] ?? 0) + 1;
            }

            $slug = trim((string) ($row->preview_slug ?? ''));
            if ($slug !== '' && $type === 'preview_view') {
                $previews[$slug] = ($previews[$slug] ?? 0) + 1;
            }

            $ref = trim((string) ($row->referrer ?? ''));
            $refLabel = $ref !== '' ? $this->shortReferrer($ref) : 'Direct / none';
            $referrers[$refLabel] = ($referrers[$refLabel] ?? 0) + 1;

            $device = trim((string) ($row->device ?? ''));
            $deviceLabel = $device !== '' ? $device : 'Unknown';
            $devices[$deviceLabel] = ($devices[$deviceLabel] ?? 0) + 1;
        }

        $likesInRange = 0;
        $dislikesInRange = 0;
        $agreesInRange = 0;
        $recentFeedback = [];
        $previewLikesRange = [];
        $previewDislikesRange = [];
        $previewAgreesRange = [];

        foreach ($feedbackInRange as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            $slug = (string) ($row->preview_slug ?? '');
            if ($slug === '') {
                continue;
            }
            $displaySlug = $maskSlugs ? $this->analytics->maskClientSlug($slug) : $slug;

            if ($row->sentiment === 'like') {
                $likesInRange++;
                $previewLikesRange[$slug] = ($previewLikesRange[$slug] ?? 0) + 1;
            } elseif ($row->sentiment === 'dislike') {
                $dislikesInRange++;
                $previewDislikesRange[$slug] = ($previewDislikesRange[$slug] ?? 0) + 1;
            } elseif ($row->sentiment === 'agree') {
                $agreesInRange++;
                $previewAgreesRange[$slug] = ($previewAgreesRange[$slug] ?? 0) + 1;
            }

            if (count($recentFeedback) < 25) {
                $recentFeedback[] = [
                    'slug' => $displaySlug,
                    'previewLabel' => $row->preview_label,
                    'sentiment' => $row->sentiment,
                    'comment' => $row->comment,
                    'createdAt' => $row->created_at?->toIso8601String(),
                ];
            }
        }

        $totalLikesAll = 0;
        $totalDislikesAll = 0;
        $totalAgreesAll = 0;
        $previewLikesAll = [];
        $previewDislikesAll = [];
        $previewAgreesAll = [];

        foreach ($allFeedback as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            $slug = (string) ($row->preview_slug ?? '');
            if ($slug === '') {
                continue;
            }
            if ($row->sentiment === 'like') {
                $totalLikesAll++;
                $previewLikesAll[$slug] = ($previewLikesAll[$slug] ?? 0) + 1;
            } elseif ($row->sentiment === 'dislike') {
                $totalDislikesAll++;
                $previewDislikesAll[$slug] = ($previewDislikesAll[$slug] ?? 0) + 1;
            } elseif ($row->sentiment === 'agree') {
                $totalAgreesAll++;
                $previewAgreesAll[$slug] = ($previewAgreesAll[$slug] ?? 0) + 1;
            }
        }

        $totalPreviewViewsAll = 0;
        foreach (Visit::query()->where('event_type', 'preview_view')->get(['visitor_id', 'ip_hash']) as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }
            $totalPreviewViewsAll++;
        }

        $previewStats = [];
        $statSlugs = array_unique(array_merge(
            array_keys($previews),
            array_keys($previewLikesAll),
            array_keys($previewDislikesAll),
            array_keys($previewAgreesAll)
        ));
        foreach ($statSlugs as $slug) {
            $previewStats[] = [
                'slug' => $maskSlugs ? $this->analytics->maskClientSlug($slug) : $slug,
                'views' => $previews[$slug] ?? 0,
                'likes' => $previewLikesAll[$slug] ?? 0,
                'dislikes' => $previewDislikesAll[$slug] ?? 0,
                'agrees' => $previewAgreesAll[$slug] ?? 0,
                'likesInRange' => $previewLikesRange[$slug] ?? 0,
                'dislikesInRange' => $previewDislikesRange[$slug] ?? 0,
                'agreesInRange' => $previewAgreesRange[$slug] ?? 0,
            ];
        }
        usort($previewStats, static fn ($a, $b) => $b['views'] <=> $a['views']);

        return [
            'rangeDays' => $days,
            'rangeStart' => $from->toIso8601String(),
            'rangeEnd' => $now->toIso8601String(),
            'totalEvents' => $totalEvents,
            'pageViews' => $pageViews,
            'sectionViews' => $sectionViews,
            'previewViews' => $previewViews,
            'uniqueVisitors' => count($visitors),
            'uniqueSessions' => count($sessions),
            'likesInRange' => $likesInRange,
            'dislikesInRange' => $dislikesInRange,
            'agreesInRange' => $agreesInRange,
            'totalPreviewViews' => $totalPreviewViewsAll,
            'totalLikes' => $totalLikesAll,
            'totalDislikes' => $totalDislikesAll,
            'totalAgrees' => $totalAgreesAll,
            'visitsByDay' => array_values($byDay),
            'topSections' => $this->topMap($sections, 12),
            'topPreviews' => $this->topMap($previews, 12, $maskSlugs),
            'topReferrers' => $this->topMap($referrers, 8),
            'devices' => $this->topMap($devices, 8),
            'previewStats' => $previewStats,
            'recentFeedback' => $recentFeedback,
            'outreachFunnel' => $this->outreachFunnel(),
            'generatedAt' => Carbon::now('UTC')->toIso8601String(),
        ];
    }

    /**
     * Admin Analytics — paginated recent visit events (detail rows).
     *
     * Privacy: only salted truncated `ip_hash` is stored/returned — never raw IP.
     *
     * @return array<string, mixed>
     */
    public function buildRecentVisits(
        int $days = 30,
        int $page = 1,
        int $perPage = 25,
        ?string $eventType = null,
        ?string $device = null,
        bool $maskSlugs = false,
    ): array {
        $days = in_array($days, [7, 14, 30, 90], true) ? $days : 30;
        $perPage = max(1, min(50, $perPage));
        $page = max(1, $page);
        $from = Carbon::now()->subDays($days);

        $allowedEvents = ['pageview', 'section_view', 'preview_view'];
        $eventFilter = is_string($eventType) && in_array($eventType, $allowedEvents, true)
            ? $eventType
            : null;

        $allowedDevices = ['Desktop', 'Mobile', 'Tablet'];
        $deviceFilter = is_string($device) && in_array($device, $allowedDevices, true)
            ? $device
            : null;

        $query = Visit::query()
            ->where('created_at', '>=', $from)
            ->orderByDesc('created_at');

        if ($eventFilter !== null) {
            $query->where('event_type', $eventFilter);
        }
        if ($deviceFilter !== null) {
            $query->where('device', $deviceFilter);
        }

        $rows = $query->get([
            'visitor_id',
            'event_type',
            'section',
            'preview_slug',
            'path',
            'referrer',
            'user_agent',
            'language',
            'device',
            'ip_hash',
            'created_at',
        ]);

        $items = [];
        foreach ($rows as $row) {
            if ($this->analytics->isExcludedRecord($row->ip_hash, $row->visitor_id)) {
                continue;
            }

            $ua = $row->user_agent;
            $slug = trim((string) ($row->preview_slug ?? ''));
            $section = trim((string) ($row->section ?? ''));
            $ref = trim((string) ($row->referrer ?? ''));

            $items[] = [
                'createdAt' => $row->created_at?->toIso8601String(),
                'visitorId' => $this->shortVisitorId($row->visitor_id),
                'eventType' => (string) ($row->event_type ?? ''),
                'section' => $section !== '' ? $section : null,
                'previewSlug' => $slug !== ''
                    ? ($maskSlugs ? $this->analytics->maskClientSlug($slug) : $slug)
                    : null,
                'path' => $row->path,
                'device' => trim((string) ($row->device ?? '')) !== ''
                    ? (string) $row->device
                    : $this->analytics->parseDevice($ua),
                'browser' => $this->analytics->parseBrowser($ua),
                'os' => $this->analytics->parseOs($ua),
                'referrer' => $ref !== '' ? $this->shortReferrer($ref) : null,
                'language' => $row->language,
                'ipHash' => $this->analytics->formatIpHash($row->ip_hash),
            ];
        }

        $total = count($items);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $slice = array_slice($items, ($page - 1) * $perPage, $perPage);

        return [
            'rangeDays' => $days,
            'items' => array_values($slice),
            'pagination' => [
                'currentPage' => $page,
                'lastPage' => $lastPage,
                'perPage' => $perPage,
                'total' => $total,
            ],
            'filters' => [
                'eventType' => $eventFilter,
                'device' => $deviceFilter,
            ],
            'ipPrivacy' => 'hashed',
            'privacyNote' => 'Raw IP addresses are not stored. Only a salted truncated hash (ip_hash) is kept and shown truncated.',
        ];
    }

    private function shortVisitorId(?string $visitorId): ?string
    {
        $id = trim((string) $visitorId);
        if ($id === '') {
            return null;
        }
        if (strlen($id) <= 10) {
            return $id;
        }

        return substr($id, 0, 8).'…';
    }

    /**
     * @return array<string, int|bool>
     */
    private function outreachFunnel(): array
    {
        $jobs = OutreachJob::query()->get([
            'status',
            'auto_followup',
            'follow_up_count',
            'initial_sent_at',
        ]);

        $byStatus = [];
        $autoFollowUp = 0;
        $withInitial = 0;
        $totalFollowUps = 0;

        foreach ($jobs as $job) {
            $status = strtolower(trim((string) ($job->status ?? 'unknown'))) ?: 'unknown';
            $byStatus[$status] = ($byStatus[$status] ?? 0) + 1;
            if ($job->auto_followup) {
                $autoFollowUp++;
            }
            if ($job->initial_sent_at) {
                $withInitial++;
            }
            $totalFollowUps += (int) ($job->follow_up_count ?? 0);
        }

        return [
            'total' => $jobs->count(),
            'byStatus' => $byStatus,
            'autoFollowUp' => $autoFollowUp,
            'withInitialSent' => $withInitial,
            'totalFollowUpsSent' => $totalFollowUps,
        ];
    }

    /**
     * @param  array<string, int>  $map
     * @return list<array{label: string, count: int}>
     */
    private function topMap(array $map, int $limit, bool $maskSlugs = false): array
    {
        arsort($map);
        $out = [];
        $i = 0;
        foreach ($map as $label => $count) {
            if ($i >= $limit) {
                break;
            }
            if ($label === '') {
                continue;
            }
            $out[] = [
                'label' => $maskSlugs ? $this->analytics->maskClientSlug($label) : $label,
                'count' => $count,
            ];
            $i++;
        }

        return $out;
    }

    private function shortReferrer(string $url): string
    {
        $host = parse_url($url, PHP_URL_HOST);
        if (is_string($host) && $host !== '') {
            return $host;
        }

        return mb_substr($url, 0, 64);
    }
}
