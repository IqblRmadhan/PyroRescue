<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route sementara untuk memeriksa tampilan prototype.
Route::view('/game-test', 'game.prototype')->name('game.test');

Route::view('/game/1', 'game.prototype')->name('game.level1');
