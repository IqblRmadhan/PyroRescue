<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\UserLevelProgress;
use App\Support\PlayerProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Level3CheckpointController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->user()) return response()->json(['saved' => false, 'guest' => true]);
        abort_unless(PlayerProgress::canPlay($request->user(), 3), 403);

        $data = $request->validate([
            'checkpoint' => ['required', 'array:challenge,step,column,row,water,sprays,rescued,following,routeSafe,evaluationPassed,attempts,hintsUsed'],
            'checkpoint.challenge' => ['required', 'integer', 'between:1,4'],
            'checkpoint.step' => ['required', 'integer', 'min:0',
                'max:'.($request->integer('checkpoint.challenge') === 4 ? 3 : 5)],
            'checkpoint.column' => ['required', 'integer', 'between:0,39'],
            'checkpoint.row' => ['required', 'integer', 'between:0,29'],
            'checkpoint.water' => ['required', 'integer', 'between:0,5'],
            'checkpoint.sprays' => ['required', 'array:1,2,4'],
            'checkpoint.sprays.1' => ['required', 'integer', 'between:0,2'],
            'checkpoint.sprays.2' => ['required', 'integer', 'between:0,3'],
            'checkpoint.sprays.4' => ['required', 'integer', 'between:0,4'],
            'checkpoint.rescued' => ['present', 'array', 'list', 'max:3'],
            'checkpoint.rescued.*' => ['integer', 'in:1,2,4', 'distinct'],
            'checkpoint.following' => ['present', 'nullable', 'integer', 'in:1,2,4'],
            'checkpoint.routeSafe' => ['required', 'boolean'],
            'checkpoint.evaluationPassed' => ['required', 'boolean'],
            'checkpoint.attempts' => ['required', 'integer', 'between:0,1000000'],
            'checkpoint.hintsUsed' => ['required', 'integer', 'between:0,1000000'],
        ]);

        $saved = DB::transaction(function () use ($request, $data) {
            $user = $request->user()->newQuery()->lockForUpdate()->findOrFail($request->user()->id);
            $level = Level::where('level_number', 3)->firstOrFail();
            $progress = UserLevelProgress::firstOrNew(['user_id' => $user->id, 'level_id' => $level->id]);
            // Pengulangan level yang sudah tuntas tidak mengaktifkan checkpoint lama.
            if ($progress->status === 'completed') return false;
            // Kunci user sama dengan penyimpanan challenge agar kiriman lama tidak menimpa tahap baru.
            $activeChallenge = ($progress->completed_challenges ?? 0) + 1;
            abort_unless((int) $data['checkpoint']['challenge'] === $activeChallenge, 422,
                'Checkpoint harus sesuai dengan challenge aktif.');
            $progress->status = 'unlocked';
            $progress->level3_checkpoint = $data['checkpoint'];
            $progress->save();
            return true;
        });

        return response()->json(['saved' => $saved, 'completed' => !$saved]);
    }
}
