<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\LigneCommandeController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminControllers\AdminProduitController;
use App\Http\Controllers\AdminControllers\AdminCategorieController;
use App\Http\Controllers\AdminControllers\AdminClientController;
use App\Http\Controllers\AdminControllers\AdminCommandeController;
use App\Http\Controllers\AdminControllers\AdminStatsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register',[AuthController::class,'register']);

Route::post('/login',[AuthController::class,'login']);

 


 
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/categories', [CategorieController::class, 'index']);

//  Client  deja connecterr

Route::middleware('auth:sanctum')->group(function () { 

    Route::post('/logout',[AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/commandes',[CommandeController::class, 'index']);
    Route::post('/commandes',[CommandeController::class, 'store']);
    Route::get('/commandes/{id}',[CommandeController::class, 'show']);
    Route::post('/commandes/{id}/valider', [CommandeController::class, 'valider']);
    Route::post('/commandes/{id}/lignes', [LigneCommandeController::class, 'store']);
    Route::put('/commandes/{id}/lignes/{ligne}', [LigneCommandeController::class, 'update']);
    Route::delete('/commandes/{id}/lignes/{ligne}', [LigneCommandeController::class, 'destroy']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);

    Route::put('/profile', [ProfileController::class, 'update']);
});

// adminnnnnn
Route::middleware(['auth:sanctum', 'isAdmin'])->prefix('admin')->group(function () {
    Route::apiResource('/produits', AdminProduitController::class);
    Route::apiResource('/categories', AdminCategorieController::class);

    Route::get('/clients', [AdminClientController::class, 'index']);
    Route::get('/clients/{id}', [AdminClientController::class, 'show']);
    Route::put('/clients/{id}', [AdminClientController::class, 'update']);
    Route::delete('/clients/{id}', [AdminClientController::class, 'destroy']);

    Route::get('/commandes', [AdminCommandeController::class, 'index']);
    Route::put('/commandes/{id}', [AdminCommandeController::class, 'update']);

    Route::get('/stats', [AdminStatsController::class, 'index']);
});