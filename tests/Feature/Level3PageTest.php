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

    public function test_guest_can_open_level_three_with_rescue_briefing_and_no_saved_progress(): void
    {
        $this->get('/game/3')->assertRedirect(route('login'));
        $this->post(route('login.guest'));
        $this->get('/main-menu')->assertOk()->assertSee(route('game.level3'), false);
        $response = $this->get('/game/3')->assertOk()->assertSee('Suaka Bekantan')
            ->assertSee('data-level="3"', false)->assertSee('data-progress-url=""', false)
            ->assertSee('assets/story/level3/1.png')->assertSee('assets/story/level3/2.png')
            ->assertSee('assets/story/level3/3.png')->assertSee('assets/story/level3/4.png')
            ->assertSee('Komandan menerima laporan bahwa kebakaran hutan semakin meluas dan mulai mengancam habitat bekantan.')
            ->assertSee('Anggota PyroRescue segera menuju lokasi. Dari kejauhan, api terlihat menyebar di antara pepohonan dan menutup beberapa jalur.')
            ->assertSee('Sejumlah bekantan terjebak di tengah kepungan api. Mereka harus segera diselamatkan sebelum keadaan semakin berbahaya.')
            ->assertSee('Padamkan seluruh titik api, selamatkan para bekantan, lalu antar mereka ke Pos Evakuasi dengan aman. Operasi penyelamatan dimulai!')
            ->assertDontSee('assets/maps/level3-map.webp')->assertDontSee('assets/story/level2/')
            ->assertDontSee('Beberapa bekantan masih terjebak. Sebagian jalur tertutup asap.')
            ->assertSee('assets/characters/komandan.png')->assertSee('assets/characters/mission-guide.png')
            ->assertDontSee('story-portrait--commander')->assertDontSee('story-portrait--player')
            ->assertSee('data-guide-portrait="commander"', false)->assertSee('data-guide-portrait="player"', false)
            ->assertSee('data-guide-speaker-name', false)->assertSee('api_padam')
            ->assertSee('id="required-water">5</span>', false)
            ->assertSee('id="rescued-count"', false)->assertSee('id="hud-water"', false)
            ->assertSee('tahan Control lalu klik petak jalan untuk teleport')
            ->assertSee('Bekantan diselamatkan: 3/3')->assertSee('Evaluasi akhir: LULUS')
            ->assertDontSee('Lanjut Level 4');
        $this->assertDoesNotMatchRegularExpression('/data-story-slide[^>]*data-speaker=/', $response->getContent());
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4])->assertOk()->assertJsonPath('saved', false);
        $this->assertDatabaseCount('user_level_progress', 0);
    }

    public function test_level_three_unlock_resume_order_and_completion_are_saved(): void
    {
        $this->actingAs(User::factory()->create());
        $this->get('/game/3')->assertRedirect(route('main-menu'));
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 1])->assertForbidden();
        foreach ([1 => 4, 2 => 4] as $level => $total) {
            for ($challenge = 1; $challenge <= $total; $challenge++) {
                $this->postJson('/progress/challenge', [
                    'level' => $level, 'challenge' => $challenge,
                    ...($challenge === 4 ? ['score' => 100] : []),
                ])->assertOk();
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
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4, 'score' => 100])->assertOk()
            ->assertJsonPath('levels.3.completed', true)->assertJsonPath('totalStars', 9)->assertJsonPath('completedLevels', 3)
            ->assertJsonPath('achievements.8.earned', true)->assertJsonPath('achievements.8.tier', 'Emas');
        $this->postJson('/progress/challenge', ['level' => 3, 'challenge' => 4, 'score' => 100])->assertOk()->assertJsonPath('totalStars', 9);
        $this->get('/game/3')->assertSee('data-resume-challenge="1"', false);
    }
}
