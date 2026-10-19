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
        $resumeChallenge = $request->boolean('replay') || $progress['completed']
            || $progress['challenges'] >= $progress['total_challenges'] ? 1
            : $progress['challenges'] + 1;
        $level3Checkpoint = null;
        if ($number === 3 && $request->user() && !$request->boolean('replay') && !$progress['completed']) {
            $level3Checkpoint = $request->user()->userLevelProgress()
                ->whereHas('level', fn ($query) => $query->where('level_number', 3))
                ->first()?->level3_checkpoint;
            if ((int) ($level3Checkpoint['challenge'] ?? 0) !== $resumeChallenge) {
                $level3Checkpoint = null;
            }
        }
        return view('game.prototype', [
            'levelNumber' => $number,
            'level3Checkpoint' => $level3Checkpoint,
            'resumeChallenge' => $resumeChallenge,
            'saveProgress' => (bool) $request->user(),
            'achievements' => $summary['achievements'],
            'earnedAchievementKeys' => array_values(array_column(array_filter(
                $summary['achievements'], fn ($achievement) => $achievement['earned']
            ), 'key')),
        ]);
    }
}
