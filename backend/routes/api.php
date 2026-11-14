<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectCategoryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\SocialLinkController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\AuthController;

// Login
Route::post('/login', [AuthController::class, 'login']);

// Public Routes
Route::get('/profile', [ProfileController::class, 'index']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);

Route::get('/categories', [ProjectCategoryController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/social-links', [SocialLinkController::class, 'index']);
Route::get('/settings', [SiteSettingController::class, 'index']);

Route::post('/messages', [MessageController::class, 'store']);

// Protected Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);

    // Projects
    Route::get('/admin/projects', [ProjectController::class, 'adminIndex']);

    Route::apiResource('projects', ProjectController::class)
        ->except(['index', 'show']);

    // Categories
    Route::apiResource('categories', ProjectCategoryController::class)
        ->except(['index']);

    // Services
    Route::apiResource('services', ServiceController::class)
        ->except(['index']);

    // Skills
    Route::apiResource('skills', SkillController::class)
        ->except(['index']);

    // Social Links
    Route::get('/admin/social-links', [SocialLinkController::class, 'adminIndex']);
    Route::apiResource('social-links', SocialLinkController::class)
        ->except(['index']);
// Messages
Route::apiResource('messages', MessageController::class)
    ->only(['index', 'show', 'destroy']);

Route::get('/admin/messages', [MessageController::class, 'index']);
Route::patch('/admin/messages/{id}/read', [MessageController::class, 'update']);
Route::delete('/admin/messages/{message}', [MessageController::class, 'destroy']);
    // Settings
        Route::get('/admin/settings', [SiteSettingController::class, 'adminIndex']);
        Route::put('/admin/settings', [SiteSettingController::class, 'updateAll']);
    
    
});
