<?php

namespace App\Http\Controllers;

use App\Support\PlayerProgress;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function play(Request $request, int $number)
    {
        abort_unless(in_array($number, [1, 2, 3]), 404);
        if ($request->user() && !PlayerProgress::canPlay($request->user(), $number)) {
            return redirect()->route('main-menu')->with('status', 'Selesaikan level sebelumnya untuk membuka misi ini.');
        }
        $summary = PlayerProgress::summary($request->user());
        $progress = $summary['levels'][$number];
        return view('game.prototype', [
            'levelNumber' => $number,
            'resumeChallenge' => $request->boolean('replay') || $progress['completed']
                || $progress['challenges'] >= $progress['total_challenges'] ? 1
                : $progress['challenges'] + 1,
            'saveProgress' => (bool) $request->user(),
            'earnedAchievementKeys' => array_column(array_filter($summary['achievements'], fn ($achievement) => $achievement['earned']), 'key'),
        ]);
    }
}
