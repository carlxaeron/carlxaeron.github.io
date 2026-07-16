<?php

namespace App\Services;

use App\Models\PreviewFeedback;
use App\Models\Visit;
use Illuminate\Support\Carbon;

class AnalyticsSummaryService
{
    public function __construct(
        private AnalyticsExclusion $analytics,
    ) {}

    /**
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
        $previewLikes = [];
        $previewDislikes = [];

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
            array_keys($previewDislikes)
        ));
        $previewStats = [];
        foreach ($slugs as $slug) {
            $previewStats[] = [
                'slug' => $maskSlugs ? $this->analytics->maskClientSlug($slug) : $slug,
                'views' => $previewViews[$slug] ?? 0,
                'likes' => $previewLikes[$slug] ?? 0,
                'dislikes' => $previewDislikes[$slug] ?? 0,
            ];
        }
        usort($previewStats, static fn ($a, $b) => $b['views'] <=> $a['views']);

        return [
            'clientSites' => (int) config('portfolio.client_sites_count', 11),
            'totalPreviewViews' => $totalPreviewViews,
            'uniquePreviewVisitorsWeek' => count($visitors),
            'totalLikes' => $totalLikes,
            'totalDislikes' => $totalDislikes,
            'visitsByDay' => array_values($visitsByDay),
            'previewStats' => $previewStats,
            'generatedAt' => Carbon::now('UTC')->toIso8601String(),
        ];
    }
}
