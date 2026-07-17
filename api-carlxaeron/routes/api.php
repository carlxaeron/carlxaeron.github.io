<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\OutreachController;
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
Route::get('/content/{section}', [PortfolioApiController::class, 'content'])
    ->middleware('throttle:120,1');
Route::post('/contact', [PortfolioApiController::class, 'contact'])
    ->middleware('throttle:8,60');
Route::post('/quotation', [PortfolioApiController::class, 'quotation'])
    ->middleware('throttle:8,60');
Route::post('/outreachSchedule', [OutreachController::class, 'schedule'])
    ->middleware('throttle:60,60');
Route::post('/outreachPause', [OutreachController::class, 'pause'])
    ->middleware('throttle:60,60');

Route::post('/admin/login', [AdminController::class, 'login'])
    ->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/admin/logout', [AdminController::class, 'logout']);
    Route::get('/admin/summary', [AdminController::class, 'summary']);
    Route::get('/admin/contacts', [AdminController::class, 'contacts']);
    Route::get('/admin/quotations', [AdminController::class, 'quotations']);
    Route::get('/admin/outreach', [AdminController::class, 'outreach']);
    Route::post('/admin/outreachPause', [AdminController::class, 'outreachPause']);
    Route::get('/admin/content/{section}', [AdminController::class, 'contentShow']);
    Route::put('/admin/content/{section}', [AdminController::class, 'contentUpdate']);
});
