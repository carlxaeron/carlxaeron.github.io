<?php

use App\Http\Controllers\Api\PortfolioApiController;
use Illuminate\Support\Facades\Route;

// Mirror hosting-php rate limits (maxAttempts,decayMinutes) for future Laravel cutover.
Route::get('/health', [PortfolioApiController::class, 'health']);
Route::post('/trackVisit', [PortfolioApiController::class, 'trackVisit'])
    ->middleware('throttle:120,1');
Route::post('/previewFeedback', [PortfolioApiController::class, 'previewFeedback'])
    ->middleware('throttle:30,60');
Route::get('/analyticsSummary', [PortfolioApiController::class, 'analyticsSummary'])
    ->middleware('throttle:60,1');
Route::post('/contact', [PortfolioApiController::class, 'contact'])
    ->middleware('throttle:8,60');
Route::post('/quotation', [PortfolioApiController::class, 'quotation'])
    ->middleware('throttle:8,60');
