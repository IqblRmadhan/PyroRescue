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
            ->assertSee('Pilih Petualanganmu')
            ->assertSee(route('game.level1'), false);

        $this->get('/login')
            ->assertOk()
            ->assertSee('Selamat Datang di PyroRescue!');

        $this->get('/game/1')
            ->assertOk()
            ->assertSee('Tepi Sungai Terbakar')
            ->assertSee('id="level-story"', false)
            ->assertSee('assets/story/level1/scene-1.png')
            ->assertSee('Mobil Tim PyroRescue berhenti di sebuah pos kecil dekat sungai.')
            ->assertSee('SKIP')
            ->assertSee('id="game-container"', false)
            ->assertSee('id="code-editor"', false)
            ->assertSee('id="code-line-numbers-content"', false)
            ->assertSee('Tulis kode Python di sini...')
            ->assertSee('atas(angka)')
            ->assertSee('bawah(angka)')
            ->assertSee('kanan(angka)')
            ->assertSee('Run Code')
            ->assertSee('Hint')
            ->assertSee('Reset');

        $this->get('/game-test')->assertOk();
    }
}
