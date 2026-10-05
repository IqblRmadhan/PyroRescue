<?php

namespace Tests\Feature;

use Tests\TestCase;

class Level2PageTest extends TestCase
{
    public function test_level_two_requires_a_player_and_is_playable_from_the_menu(): void
    {
        $this->get('/game/2')->assertRedirect(route('login'));
        $this->post(route('login.guest'));
        $this->get('/main-menu')->assertOk()->assertSee(url('/game/2'), false);
        $this->get('/game/2')->assertOk()
            ->assertSee('Hutan Gambut Berasap')
            ->assertSee('id="level-story"', false)
            ->assertSee('data-level-number="2"', false)
            ->assertSee('Cerita pembuka Level 2')
            ->assertSeeInOrder([
                'assets/story/level2/1.png',
                'assets/story/level2/2.png',
                'assets/story/level2/3.png',
                'assets/story/level2/4.png',
            ])
            ->assertSee('Setelah menuntaskan misi pertama, anggota PyroRescue tiba di jembatan menuju hutan gambut.')
            ->assertSee('Api sudah menyebar ke beberapa titik. Satu kali semprotan tidak cukup. Gunakan perulangan untuk memadamkan api secara efektif.')
            ->assertDontSee('id="story-audio-toggle"', false)
            ->assertSee('LEWATI CERITA')
            ->assertSee('id="prototype-page" class="prototype-page" inert', false)
            ->assertSee('data-level="2"', false)
            ->assertSee('id="code-editor"', false)
            ->assertSee('semprot()')
            ->assertSee('isi_air = 6')
            ->assertSee('for')
            ->assertDontSee('Air sampai di Pos 2');
    }
}
