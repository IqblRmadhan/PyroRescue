<?php

namespace App\Http\Controllers;

use App\Support\PlayerProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ProfileController extends Controller
{
    public function show(Request $request): View|RedirectResponse
    {
        if (! $request->user()) {
            return redirect()->route('register');
        }

        return view('game.profile', [
            'player' => $request->user(),
            ...PlayerProgress::summary($request->user()),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);
        $user->update($data);

        return redirect()->route('profile')->with('status', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        $user->update(['password' => $data['password']]);

        return redirect()->route('profile')->with('status', 'Kata sandi berhasil diubah.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user, 403);
        $request->validate([
            'password' => ['required', 'current_password'],
            'confirmation' => ['required', 'in:HAPUS'],
        ]);
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('status', 'Akun dan progresmu telah dihapus.');
    }
}
