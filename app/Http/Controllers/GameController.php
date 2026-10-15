<?php

namespace App\Http\Controllers;

use App\Support\PlayerProgress;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function play(Request $request, int $number)
    {
        abort_unless(in_array($number, [1, 2]), 404);
        if ($request->user() && !PlayerProgress::canPlay($request->user(), $number)) {
            return redirect()->route('main-menu')->with('status', 'Selesaikan level sebelumnya untuk membuka misi ini.');
        }
        $summary = PlayerProgress::summary($request->user());
        $progress = $summary['levels'][$number];
        return view('game.prototype', [
            'levelNumber' => $number,
            'resumeChallenge' => $progress['completed'] ? 1 : min($progress['challenges'] + 1, $progress['total_challenges']),
            'saveProgress' => (bool) $request->user(),
            'earnedAchievementKeys' => array_column(array_filter($summary['achievements'], fn ($achievement) => $achievement['earned']), 'key'),
        ]);
    }
}
