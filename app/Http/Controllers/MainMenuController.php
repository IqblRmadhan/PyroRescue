<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Support\PlayerProgress;

class MainMenuController extends Controller
{
    public function index(): View
    {
        return view('game.main-menu', [
            'playerName' => Auth::user()?->name ?? 'Pemain Tamu',
            'isGuest' => !Auth::check(),
            ...PlayerProgress::summary(Auth::user()),
        ]);
    }
}
