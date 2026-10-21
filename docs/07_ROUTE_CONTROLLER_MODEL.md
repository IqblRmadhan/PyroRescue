# Route, Controller, dan Model

Contoh dibuat sesederhana mungkin.

## Implementasi aktif

Menu petualangan berada di `/main-menu`. Profil pemain berada di `/profile` dan menampilkan identitas, progres, pencapaian, serta pengaturan. `ProfileController` menerima perubahan nama/email dan kata sandi untuk akun masuk; penghapusan akun memerlukan kata sandi saat ini dan konfirmasi `HAPUS`. Tautan profil bagi tamu mengarah ke pendaftaran; akses langsung ke `/profile` juga dialihkan ke `/register`. Tamu tidak dapat mengubah atau menghapus akun. Preferensi audio dan tampilan disimpan di browser; progres dan pencapaian akun dihitung dari `PlayerProgress` di database. Route permainan aktif adalah `/game/1`, `/game/2`, dan `/game/3`; progres challenge disimpan melalui `/progress/challenge`.

Contoh di bawah adalah rancangan awal, bukan daftar route aktif.

## `routes/web.php`

```php
<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->group(function () {
    Route::get('/levels', [GameController::class, 'levelSelect'])
        ->name('levels');

    Route::get('/game/{level}', [GameController::class, 'play'])
        ->name('game.play');

    Route::post('/progress/complete', [ProgressController::class, 'complete'])
        ->name('progress.complete');

    Route::get('/progress', [ProgressController::class, 'index'])
        ->name('progress');
});
```

## `GameController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Level;

class GameController extends Controller
{
    public function levelSelect()
    {
        $levels = Level::orderBy('level_number')->get();

        return view('level-select', compact('levels'));
    }

    public function play(Level $level)
    {
        $level->load('challenges');

        return view('game.play', compact('level'));
    }
}
```

## `ProgressController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\UserLevelProgress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function index(Request $request)
    {
        $progress = UserLevelProgress::where(
            'user_id',
            $request->user()->id
        )->with('level')->get();

        return view('progress', compact('progress'));
    }

    public function complete(Request $request)
    {
        $data = $request->validate([
            'level_id' => ['required', 'exists:levels,id'],
        ]);

        UserLevelProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'level_id' => $data['level_id'],
            ],
            [
                'status' => 'completed',
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Progress berhasil disimpan.'
        ]);
    }
}
```

## `Level.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = [
        'level_number',
        'title',
        'material',
        'learning_objective',
        'is_active',
    ];

    public function challenges()
    {
        return $this->hasMany(Challenge::class)
            ->orderBy('order_number');
    }
}
```

## `Challenge.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $fillable = [
        'level_id',
        'order_number',
        'title',
        'instruction',
        'concept',
        'starter_code',
        'expected_data',
        'hint_1',
        'hint_2',
    ];

    protected function casts(): array
    {
        return [
            'expected_data' => 'array',
        ];
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
```

## `UserLevelProgress.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLevelProgress extends Model
{
    protected $fillable = [
        'user_id',
        'level_id',
        'status',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

## Catatan

Jangan memecah aplikasi ke banyak service atau repository dulu. Controller dan model sederhana sudah cukup untuk MVP.
