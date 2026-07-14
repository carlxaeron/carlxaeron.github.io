<?php

use App\Http\Controllers\Api\PortfolioApiController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [PortfolioApiController::class, 'health']);
Route::post('/trackVisit', [PortfolioApiController::class, 'trackVisit']);
Route::post('/previewFeedback', [PortfolioApiController::class, 'previewFeedback']);
Route::get('/analyticsSummary', [PortfolioApiController::class, 'analyticsSummary']);
Route::post('/contact', [PortfolioApiController::class, 'contact']);
Route::post('/quotation', [PortfolioApiController::class, 'quotation']);
