<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\MainMenuController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ProgressController;
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
    Route::get('/download-modul', function () {
        return response()->download(
            public_path('assets/modules/Modul-PyroRescue.pdf'),
            'Modul-PyroRescue.pdf'
        );
    })->name('module.download');
    Route::get('/game/1', [GameController::class, 'play'])->defaults('number', 1)->name('game.level1');
    Route::get('/game/2', [GameController::class, 'play'])->defaults('number', 2)->name('game.level2');
    Route::get('/game/3', [GameController::class, 'play'])->defaults('number', 3)->name('game.level3');
    Route::post('/progress/challenge', [ProgressController::class, 'store'])->name('progress.challenge');
});
