<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminPushController;
use App\Http\Controllers\Api\OutreachController;
use App\Http\Controllers\Api\PortfolioApiController;
use App\Http\Controllers\Api\ServiceAgreementController;
use Illuminate\Support\Facades\Route;

// Per-route named limiters (AppServiceProvider) — do not use bare throttle:max,decay
// (that shares one IP key across every throttled route).
Route::get('/health', [PortfolioApiController::class, 'health']);
Route::post('/trackVisit', [PortfolioApiController::class, 'trackVisit'])
    ->middleware('throttle:trackVisit');
Route::post('/previewFeedback', [PortfolioApiController::class, 'previewFeedback'])
    ->middleware('throttle:previewFeedback');
Route::get('/analyticsSummary', [PortfolioApiController::class, 'analyticsSummary'])
    ->middleware('throttle:analyticsSummary');
Route::get('/content/{section}', [PortfolioApiController::class, 'content'])
    ->middleware('throttle:content');
Route::post('/contact', [PortfolioApiController::class, 'contact'])
    ->middleware('throttle:contact');
Route::post('/quotation', [PortfolioApiController::class, 'quotation'])
    ->middleware('throttle:quotation');
Route::post('/outreachSchedule', [OutreachController::class, 'schedule'])
    ->middleware('throttle:outreach');
Route::post('/outreachPause', [OutreachController::class, 'pause'])
    ->middleware('throttle:outreach');
Route::post('/pushNotifyAdmins', [OutreachController::class, 'pushNotify'])
    ->middleware('throttle:outreach');

Route::get('/agreements/{token}', [ServiceAgreementController::class, 'publicShow'])
    ->middleware('throttle:agreementsShow');
Route::post('/agreements/{token}/sign', [ServiceAgreementController::class, 'publicSign'])
    ->middleware('throttle:agreementsSign');

Route::post('/admin/login', [AdminController::class, 'login'])
    ->middleware('throttle:adminLogin');

Route::middleware(['auth:sanctum', 'throttle:adminApi'])->group(function (): void {
    Route::post('/admin/logout', [AdminController::class, 'logout']);
    Route::get('/admin/summary', [AdminController::class, 'summary']);
    Route::get('/admin/analytics', [AdminController::class, 'analytics']);
    Route::get('/admin/contacts', [AdminController::class, 'contacts']);
    Route::get('/admin/quotations', [AdminController::class, 'quotations']);
    Route::get('/admin/outreach', [AdminController::class, 'outreach']);
    Route::post('/admin/outreachPause', [AdminController::class, 'outreachPause']);
    Route::get('/admin/content/{section}', [AdminController::class, 'contentShow']);
    Route::put('/admin/content/{section}', [AdminController::class, 'contentUpdate']);
    Route::get('/admin/push/vapidPublicKey', [AdminPushController::class, 'vapidPublicKey']);
    Route::post('/admin/push/subscribe', [AdminPushController::class, 'subscribe']);
    Route::delete('/admin/push/subscribe', [AdminPushController::class, 'unsubscribe']);
    Route::post('/admin/push/sendPing', [AdminPushController::class, 'test']);

    Route::post('/admin/agreements', [ServiceAgreementController::class, 'store']);
    Route::get('/admin/agreements', [ServiceAgreementController::class, 'index']);
    Route::get('/admin/agreements/{id}', [ServiceAgreementController::class, 'show'])
        ->whereNumber('id');
    Route::post('/admin/agreements/{id}/resend', [ServiceAgreementController::class, 'resend'])
        ->whereNumber('id');
    Route::post('/admin/agreements/{id}/revoke', [ServiceAgreementController::class, 'revoke'])
        ->whereNumber('id');
});
