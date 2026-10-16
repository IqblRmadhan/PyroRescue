<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\UserLevelProgress;
use App\Support\PlayerProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    public function store(Request $request)
    {
        // Tamu tidak membuat catatan progres, termasuk ketika endpoint dipanggil langsung.
        if (!$request->user()) return response()->json(['saved' => false, 'guest' => true]);
        $data = $request->validate([
            'level' => ['required', 'integer', 'in:1,2,3'],
            'challenge' => ['required', 'integer', 'min:1', 'max:4'],
            'score' => ['required_if:challenge,4', 'integer', 'min:0', 'max:100'],
        ]);
        $number = (int) $data['level'];
        $challenge = (int) $data['challenge'];
        abort_unless(PlayerProgress::canPlay($request->user(), $number), 403);
        $totalChallenges = 4;
        abort_if($challenge > $totalChallenges, 422);

        DB::transaction(function () use ($request, $number, $challenge, $totalChallenges, $data) {
            $user = $request->user()->newQuery()->lockForUpdate()->findOrFail($request->user()->id);
            $level = Level::where('level_number', $number)->firstOrFail();
            $progress = UserLevelProgress::firstOrNew(['user_id' => $user->id, 'level_id' => $level->id]);
            $previous = $progress->status === 'completed' ? $totalChallenges : ($progress->completed_challenges ?? 0);
            abort_if($challenge > $previous + 1, 422, 'Selesaikan challenge secara berurutan.');
            $progress->completed_challenges = max($previous, $challenge);
            if ($challenge === $totalChallenges) {
                $score = (int) $data['score'];
                $previousScore = ($progress->score ?? 0) ?: ($progress->status === 'completed' && $progress->stars === 3 ? 100 : 0);
                $progress->score = max($previousScore, $score);
                $earnedStars = $score < 70 ? 0 : ($score < 85 ? 1 : ($score < 100 ? 2 : 3));
                $progress->stars = max($progress->stars ?? 0, $earnedStars);
            }
            $finished = $progress->completed_challenges === $totalChallenges;
            $progress->status = $finished ? 'completed' : 'unlocked';
            if ($finished) $progress->completed_at ??= now();
            $progress->save();
        });
        return response()->json(['saved' => true, ...PlayerProgress::summary($request->user())]);
    }
}
