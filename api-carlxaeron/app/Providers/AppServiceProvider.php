<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Named limiters so each route (or intentional group) has its own bucket.
     * Inline throttle:max,decay shares one IP key across all routes — that
     * caused trackVisit traffic to 429 unrelated endpoints.
     */
    protected function configureRateLimiting(): void
    {
        $byIp = static fn (Request $request): string => (string) $request->ip();

        RateLimiter::for('trackVisit', fn (Request $request) => Limit::perMinute(120)->by($byIp($request)));
        RateLimiter::for('previewFeedback', fn (Request $request) => Limit::perHour(30)->by($byIp($request)));
        RateLimiter::for('analyticsSummary', fn (Request $request) => Limit::perMinute(60)->by($byIp($request)));
        RateLimiter::for('content', fn (Request $request) => Limit::perMinute(120)->by($byIp($request)));
        RateLimiter::for('contact', fn (Request $request) => Limit::perHour(5)->by($byIp($request)));
        RateLimiter::for('quotation', fn (Request $request) => Limit::perHour(5)->by($byIp($request)));
        // Secret agent endpoints share one outreach bucket (matches hosting-php).
        RateLimiter::for('outreach', fn (Request $request) => Limit::perHour(60)->by($byIp($request)));
        RateLimiter::for('agreementsShow', fn (Request $request) => Limit::perMinute(60)->by($byIp($request)));
        RateLimiter::for('agreementsSign', fn (Request $request) => Limit::perHour(10)->by($byIp($request)));
        // Edge redeem: generous per-IP (Netlify edge IPs); auth is PREVIEW_ACCESS_SECRET.
        RateLimiter::for('previewAccessRedeem', fn (Request $request) => Limit::perMinute(120)->by($byIp($request)));
        // Lock-page notify: coarse IP bucket; controller also rate-limits per IP+slug.
        RateLimiter::for('previewAccessRequestUnlock', fn (Request $request) => Limit::perHour(30)->by($byIp($request)));
        RateLimiter::for('adminLogin', fn (Request $request) => Limit::perMinutes(5, 20)->by($byIp($request)));
        RateLimiter::for('adminApi', function (Request $request) {
            $id = $request->user()?->getAuthIdentifier() ?: $request->ip();

            return Limit::perMinute(120)->by((string) $id);
        });
    }
}
