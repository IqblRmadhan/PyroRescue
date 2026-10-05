<?php

namespace Tests\Feature;

use Tests\TestCase;

class Level1PageTest extends TestCase
{
    public function test_level_one_and_the_prototype_route_show_the_editor(): void
    {
        $this->get('/game/1')->assertRedirect(route('login'));

        $this->post(route('login.guest'))
            ->assertRedirect(route('main-menu'))
            ->assertSessionHas('guest_player', true);

        $this->get('/main-menu')
            ->assertOk()
            ->assertSee('id="adventure-heading"', false)
            ->assertSee(route('game.level1'), false);

        $this->get('/login')
            ->assertOk()
            ->assertSee('id="login-title"', false);

        $this->get('/game/1')
            ->assertOk()
            ->assertSee('data-audio-base-url=', false)
            ->assertSee('Tepi Sungai Terbakar')
            ->assertSee('id="level-story"', false)
            ->assertSee('assets/story/level1/scene-1.png')
            ->assertSee('Mobil Tim PyroRescue berhenti di sebuah pos kecil dekat sungai.')
            ->assertSee('LEWATI CERITA')
            ->assertSee('id="story-audio-toggle"', false)
            ->assertSee('aria-label="Suara game"', false)
            ->assertSee('id="game-container"', false)
            ->assertSee('id="code-editor"', false)
            ->assertSee('id="code-line-numbers-content"', false)
            ->assertSee('Tulis kode Python di sini...')
            ->assertSee('atas(angka)')
            ->assertSee('bawah(angka)')
            ->assertSee('kanan(angka)')
            ->assertSee('Run Code')
            ->assertSee('Hint')
            ->assertSee('id="audio-toggle"', false)
            ->assertSee('aria-pressed="true"', false)
            ->assertSee('id="reset"', false)
            ->assertSee('id="clear-code"', false)
            ->assertSeeInOrder([
                'class="game-map-controls"',
                'id="audio-toggle" class="hint-button hint-button--audio"',
                'id="reset" class="hint-button hint-button--reset"',
                'id="hint" class="hint-button hint-button--help"',
            ], false);

        $this->get('/game-test')->assertOk();
    }
}
