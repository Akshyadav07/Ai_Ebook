<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\AIController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::prefix('books')->group(function () {
        Route::get('/', [BookController::class, 'index']);
        Route::post('/', [BookController::class, 'store']);
        Route::get('/{id}', [BookController::class, 'show']);
        Route::put('/{id}', [BookController::class, 'update']);
        Route::delete('/{id}', [BookController::class, 'destroy']);
        Route::post('/{id}/generate', [BookController::class, 'generate']);
        Route::post('/{id}/duplicate', [BookController::class, 'duplicate']);
    });

    Route::prefix('books/{bookId}/chapters')->group(function () {
        Route::get('/', [ChapterController::class, 'index']);
        Route::post('/', [ChapterController::class, 'store']);
        Route::get('/{id}', [ChapterController::class, 'show']);
        Route::put('/{id}', [ChapterController::class, 'update']);
        Route::delete('/{id}', [ChapterController::class, 'destroy']);
        Route::post('/reorder', [ChapterController::class, 'reorder']);
        Route::post('/{id}/regenerate', [ChapterController::class, 'regenerate']);
    });

    Route::prefix('ai')->group(function () {
        Route::post('/improve', [AIController::class, 'improve']);
        Route::post('/rewrite', [AIController::class, 'rewrite']);
        Route::post('/summarize', [AIController::class, 'summarize']);
        Route::post('/expand', [AIController::class, 'expand']);
        Route::post('/simplify', [AIController::class, 'simplify']);
        Route::post('/fix-grammar', [AIController::class, 'fixGrammar']);
        Route::post('/generate-examples', [AIController::class, 'generateExamples']);
        Route::post('/continue-writing', [AIController::class, 'continueWriting']);
    });
});
