<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::post('/login', [AuthController::class, 'authenticate']);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/users',[UserController::class, 'index']);
    Route::post('/users',[UserController::class, 'store']);
    // Route::get('/users/search', [UserController::class, 'search']);
    Route::put('/users/{id}',[UserController::class, 'update']);
    Route::delete('/users/{id}',[UserController::class, 'destroy']);
    Route::put('/users/toggle-active/{id}',[UserController::class, 'toggleActive']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/products',[ProductController::class, 'index']);
    Route::post('/products',[ProductController::class, 'store']);
    Route::get('/products/search', [ProductController::class, 'search']);
});
