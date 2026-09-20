<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\MainMenuController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');
Route::post('/login/guest', [LoginController::class, 'guest'])->name('login.guest');
Route::get('/register', [LoginController::class, 'register'])->name('register');
Route::post('/register', [LoginController::class, 'storeRegistration'])->name('register.store');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Route sementara untuk memeriksa tampilan prototype.
Route::view('/game-test', 'game.prototype')->name('game.test');

Route::middleware('player')->group(function () {
    Route::get('/main-menu', [MainMenuController::class, 'index'])->name('main-menu');
    Route::view('/game/1', 'game.prototype')->name('game.level1');
});
