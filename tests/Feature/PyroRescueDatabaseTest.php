<?php

namespace Tests\Feature;

use App\Models\Challenge;
use App\Models\Level;
use App\Models\User;
use App\Models\UserLevelProgress;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PyroRescueDatabaseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_seeder_can_run_again_without_duplicating_levels(): void
    {
        $levelIds = Level::orderBy('level_number')->pluck('id')->all();

        $this->seed();

        $this->assertDatabaseCount('levels', 3);
        $this->assertSame($levelIds, Level::orderBy('level_number')->pluck('id')->all());
        $this->assertSame([
            ['level_number' => 1, 'title' => 'Tepi Sungai Terbakar', 'material' => 'variable'],
            ['level_number' => 2, 'title' => 'Hutan Gambut Berasap', 'material' => 'loop'],
            ['level_number' => 3, 'title' => 'Suaka Bekantan', 'material' => 'if_else'],
        ], Level::orderBy('level_number')->get(['level_number', 'title', 'material'])->toArray());
        $this->assertTrue(Level::firstOrFail()->is_active);
        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('challenges', 0);
        $this->assertDatabaseCount('user_level_progress', 0);
    }

    public function test_challenges_are_ordered_and_expected_data_is_restored_as_an_array(): void
    {
        $level = Level::firstOrFail();
        $expectedData = ['water' => 3, 'must_use_variable' => true];

        foreach ([2, 1] as $orderNumber) {
            $level->challenges()->create([
                'order_number' => $orderNumber,
                'title' => 'Challenge uji',
                'instruction' => 'Siapkan jumlah air.',
                'concept' => 'variable',
                'expected_data' => $expectedData,
            ]);
        }

        $challenges = $level->challenges;

        $this->assertSame([1, 2], $challenges->pluck('order_number')->all());
        $this->assertSame($expectedData, $challenges->first()->expected_data);
        $this->assertTrue($challenges->first()->level->is($level));
    }

    public function test_progress_relations_defaults_and_completion_date(): void
    {
        $user = User::factory()->create();
        $level = Level::firstOrFail();
        $progress = $user->userLevelProgress()->create(['level_id' => $level->id])->refresh();

        $this->assertSame('locked', $progress->status);
        $this->assertNull($progress->completed_at);
        $this->assertTrue($progress->user->is($user));
        $this->assertTrue($progress->level->is($level));
        $this->assertTrue($level->userLevelProgress->first()->is($progress));

        $progress->update(['status' => 'unlocked']);
        $this->assertSame('unlocked', $progress->fresh()->status);

        $progress->update(['status' => 'completed', 'completed_at' => '2026-09-12 12:00:00']);
        $this->assertSame('2026-09-12 12:00:00', $progress->fresh()->completed_at->toDateTimeString());
    }

    public function test_progress_cannot_be_duplicated_for_the_same_user_and_level(): void
    {
        $attributes = [
            'user_id' => User::factory()->create()->id,
            'level_id' => Level::firstOrFail()->id,
        ];

        UserLevelProgress::create($attributes);

        $this->expectException(QueryException::class);

        UserLevelProgress::create($attributes);
    }

    public function test_deleting_a_level_removes_its_challenges_and_progress(): void
    {
        $level = Level::firstOrFail();
        $user = User::factory()->create();
        $challenge = $level->challenges()->create([
            'order_number' => 1,
            'title' => 'Challenge uji',
            'instruction' => 'Siapkan jumlah air.',
            'concept' => 'variable',
            'expected_data' => ['water' => 3],
        ]);
        $progress = $user->userLevelProgress()->create(['level_id' => $level->id]);

        $level->delete();

        $this->assertModelMissing($challenge);
        $this->assertModelMissing($progress);
        $this->assertModelExists($user);
        $this->assertSame(0, Challenge::count());
    }
}
