<?php

namespace Tests\Feature;

use App\Models\Level;
use App\Models\User;
use App\Models\UserLevelProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Level3CheckpointTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function checkpoint(): array
    {
        return ['challenge' => 1, 'step' => 2, 'column' => 12, 'row' => 15, 'water' => 3,
            'sprays' => [1 => 2, 2 => 0, 4 => 0], 'rescued' => [], 'following' => null,
            'routeSafe' => false, 'evaluationPassed' => false, 'attempts' => 2, 'hintsUsed' => 1];
    }

    private function unlockedUser(): User
    {
        $user = User::factory()->create();
        foreach ([1, 2] as $number) {
            UserLevelProgress::create(['user_id' => $user->id,
                'level_id' => Level::where('level_number', $number)->value('id'),
                'status' => 'completed', 'completed_challenges' => 4, 'stars' => 1]);
        }
        return $user;
    }

    public function test_checkpoint_is_saved_for_account_and_restored_without_marking_challenge_complete(): void
    {
        $this->actingAs($this->unlockedUser());
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])
            ->assertOk()->assertJsonPath('saved', true);
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', $this->checkpoint());
        $record = UserLevelProgress::whereHas('level', fn ($query) => $query->where('level_number', 3))->firstOrFail();
        $this->assertSame(0, $record->completed_challenges);
        $this->assertSame('unlocked', $record->status);
        $this->get('/game/3?replay=1')->assertOk()->assertViewHas('level3Checkpoint', null);
        $this->actingAs($this->unlockedUser());
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', null);
    }

    public function test_visitors_guests_and_locked_accounts_cannot_write_checkpoint(): void
    {
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertRedirect(route('login'));
        $this->post('/login/guest');
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertOk()->assertJsonPath('saved', false);
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', null);
        $this->actingAs(User::factory()->create());
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertForbidden();
        $this->assertDatabaseCount('user_level_progress', 0);
    }

    public function test_invalid_snapshot_is_rejected_without_overwriting_saved_checkpoint(): void
    {
        $this->actingAs($this->unlockedUser());
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertOk();
        foreach (['water' => 6, 'column' => 40, 'row' => -1, 'challenge' => 5, 'step' => 9,
            'rescued' => [1, 1], 'following' => 3, 'attempts' => -1, 'routeSafe' => 'yes',
            'sprays' => [1 => 3, 2 => 0, 4 => 0], 'extra' => 'unexpected'] as $key => $value) {
            $this->postJson('/progress/level3-checkpoint', ['checkpoint' => array_replace($this->checkpoint(), [$key => $value])])
                ->assertUnprocessable();
        }
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', $this->checkpoint());
    }

    public function test_completed_level_never_resumes_or_overwrites_stale_checkpoint(): void
    {
        $this->actingAs($this->unlockedUser());
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertOk();
        foreach ([1, 2, 3, 4] as $challenge) {
            $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => $challenge, 'score' => 100])->assertOk();
        }
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', null);
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertOk()
            ->assertJsonPath('saved', false)->assertJsonPath('completed', true);
    }

    public function test_checkpoint_requires_current_challenge_and_does_not_resume_stale_snapshot(): void
    {
        $this->actingAs($this->unlockedUser());
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertOk();
        $future = array_replace($this->checkpoint(), ['challenge' => 2]);
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $future])->assertUnprocessable();
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 1])->assertOk();
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', null);
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $future])->assertOk();
        $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $this->checkpoint()])->assertUnprocessable();
        $this->get('/game/3')->assertOk()->assertViewHas('level3Checkpoint', $future);
    }

    public function test_step_must_exist_in_the_current_challenge(): void
    {
        $this->actingAs($this->unlockedUser());
        foreach ([1, 2, 3, 4] as $challenge) {
            $invalidStep = $challenge === 4 ? 4 : 6;
            $snapshot = array_replace($this->checkpoint(), ['challenge' => $challenge, 'step' => $invalidStep]);
            $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $snapshot])->assertUnprocessable();
            $snapshot['step'] = $invalidStep - 1;
            $this->postJson('/progress/level3-checkpoint', ['checkpoint' => $snapshot])->assertOk();
            if ($challenge < 4) {
                $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => $challenge])->assertOk();
            }
        }
    }
}
