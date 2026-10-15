<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Level3PageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_can_open_level_three_with_temporary_story_and_no_saved_progress(): void
    {
        $this->get('/game/3')->assertRedirect(route('login'));
        $this->post(route('login.guest'));
        $this->get('/main-menu')->assertOk()->assertSee(route('game.level3'), false);
        $this->get('/game/3')->assertOk()->assertSee('Suaka Bekantan')
            ->assertSee('data-level="3"', false)->assertSee('data-progress-url=""', false)
            ->assertSee('assets/story/level2/1.png')->assertSee('assets/story/level2/4.png')
            ->assertSee('api_padam')->assertSee('status_bekantan')->assertSee('id="bekantan-status"', false)
            ->assertDontSee('Lanjut Level 4');
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4])->assertOk()->assertJsonPath('saved', false);
        $this->assertDatabaseCount('user_level_progress', 0);
    }

    public function test_level_three_unlock_resume_order_and_completion_are_saved(): void
    {
        $this->actingAs(User::factory()->create());
        $this->get('/game/3')->assertRedirect(route('main-menu'));
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 1])->assertForbidden();
        foreach ([1 => 3, 2 => 4] as $level => $total) {
            for ($challenge = 1; $challenge <= $total; $challenge++) {
                $this->postJson('/progress/challenge', compact('level', 'challenge'))->assertOk();
            }
        }
        $this->get('/game/2')->assertSee('Lanjut Level 3');
        $this->get('/game/3')->assertOk()->assertSee('data-resume-challenge="1"', false);
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4])->assertUnprocessable();
        for ($challenge = 1; $challenge <= 3; $challenge++) {
            $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => $challenge])->assertOk()
                ->assertJsonPath('levels.3.completed', false)->assertJsonPath('totalStars', 6);
            $next = $challenge + 1;
            $this->get('/game/3')->assertSee('data-resume-challenge="'.$next.'"', false);
        }
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4])->assertOk()
            ->assertJsonPath('levels.3.completed', true)->assertJsonPath('totalStars', 9)->assertJsonPath('completedLevels', 3);
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4])->assertOk()->assertJsonPath('totalStars', 9);
        $this->get('/game/3')->assertSee('data-resume-challenge="1"', false);
    }
}
