<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlayerCanPlay
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() || $request->session()->has('guest_player')) {
            return $next($request);
        }

        return redirect()
            ->route('login')
            ->with('status', 'Masuk atau pilih mode tamu untuk memulai misi.');
    }
}
