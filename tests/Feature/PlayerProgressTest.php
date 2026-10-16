<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserLevelProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlayerProgressTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_new_account_starts_at_level_one_and_cannot_skip_levels_or_challenges(): void
    {
        $this->actingAs(User::factory()->create());
        $this->get('/main-menu')->assertOk()->assertSee('Raih minimal 1 bintang di Level 1')->assertSee('Raih minimal 1 bintang di Level 2');
        $this->get('/game/2')->assertRedirect(route('main-menu'));
        $this->postJson('/progress/challenge', ['level' => 2, 'challenge' => 1])->assertForbidden();
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 3])->assertUnprocessable();
        $this->assertDatabaseCount('user_level_progress', 0);
    }

    public function test_progress_resumes_and_achievements_and_unlocks_follow_actual_completed_tasks(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 1])->assertOk()
            ->assertJsonPath('achievements.0.earned', true)->assertJsonPath('achievements.1.earned', false);
        $this->get('/game/1')->assertOk()->assertSee('data-resume-challenge="2"', false);
        foreach ([2, 3] as $challenge) $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => $challenge])->assertOk();
        $this->get('/game/2')->assertRedirect(route('main-menu'));
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 4, 'score' => 100])->assertOk();
        $this->get('/game/2')->assertOk();
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 1])->assertOk()->assertJsonPath('totalStars', 3);
        $this->assertDatabaseCount('user_level_progress', 1);
        foreach ([1, 2, 3, 4] as $challenge) {
            $response = $this->postJson('/progress/challenge', ['level' => 2, 'challenge' => $challenge,
                ...($challenge === 4 ? ['score' => 100] : [])])->assertOk();
        }
        $response->assertJsonPath('levels.3.unlocked', true)->assertJsonPath('totalStars', 6)->assertJsonPath('earnedAchievements', 4);
        $this->assertSame(2, UserLevelProgress::where('user_id', $user->id)->where('status', 'completed')->count());
        $this->get('/main-menu')->assertOk()->assertSee('<strong>6</strong><span>/ 9</span>', false)->assertDontSee('Raih minimal 1 bintang di Level 2');
        $this->post('/logout');
        $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect(route('main-menu'));
        $this->get('/main-menu')->assertOk()->assertSee('<strong>6</strong><span>/ 9</span>', false);
        $this->actingAs(User::factory()->create());
        $this->get('/game/2')->assertRedirect(route('main-menu'));
        $this->get('/main-menu')->assertOk()->assertSee('<strong>0</strong><span>/ 9</span>', false);
    }

    public function test_finish_needs_evaluation_and_at_least_one_star_to_unlock_next_level(): void
    {
        $this->actingAs(User::factory()->create());
        foreach ([1, 2, 3] as $challenge) {
            $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => $challenge])->assertOk();
        }
        $this->get('/game/2')->assertRedirect(route('main-menu'));
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 4])->assertUnprocessable();
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 4, 'score' => 69])
            ->assertOk()->assertJsonPath('levels.2.unlocked', false)->assertJsonPath('levels.1.stars', 0);
        $this->get('/game/1')->assertOk()->assertSee('data-resume-challenge="1"', false);
        $this->get('/game/2')->assertRedirect(route('main-menu'));
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 4, 'score' => 70])
            ->assertOk()->assertJsonPath('levels.2.unlocked', true)->assertJsonPath('levels.1.stars', 1);
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 4, 'score' => 85])
            ->assertOk()->assertJsonPath('levels.1.stars', 2);
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 4, 'score' => 100])
            ->assertOk()->assertJsonPath('levels.1.stars', 3);
        foreach ([1, 2, 3] as $challenge) {
            $this->postJson('/progress/challenge', ['level' => 2, 'challenge' => $challenge])->assertOk();
        }
        $this->postJson('/progress/challenge', ['level' => 2, 'challenge' => 4, 'score' => 69])
            ->assertOk()->assertJsonPath('levels.3.unlocked', false);
        $this->postJson('/progress/challenge', ['level' => 2, 'challenge' => 4, 'score' => 70])
            ->assertOk()->assertJsonPath('levels.3.unlocked', true)->assertJsonPath('levels.2.stars', 1);
    }

    public function test_guests_have_no_level_locks_and_never_write_progress(): void
    {
        $this->post('/login/guest');
        $this->get('/main-menu')->assertOk()->assertDontSee('Raih minimal 1 bintang di Level 1')->assertDontSee('Raih minimal 1 bintang di Level 2')->assertSee('Mode Bebas');
        $this->get('/game/2')->assertOk()->assertSee('data-progress-url=""', false);
        $this->postJson('/progress/challenge', ['level' => 2, 'challenge' => 4])->assertOk()->assertJsonPath('saved', false);
        $this->assertDatabaseCount('user_level_progress', 0);
    }

    public function test_switching_from_an_account_to_guest_does_not_keep_the_account_identity(): void
    {
        $this->actingAs(User::factory()->create());
        $this->post('/login/guest');
        $this->assertGuest();
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 1])->assertJsonPath('saved', false);
        $this->assertDatabaseCount('user_level_progress', 0);
    }
}
