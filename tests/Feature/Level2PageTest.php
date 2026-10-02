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
            ->assertSee('data-level="2"', false)
            ->assertSee('id="code-editor"', false)
            ->assertSee('semprot()')
            ->assertSee('isi_air = 6')
            ->assertSee('for')
            ->assertDontSee('id="level-story"', false)
            ->assertDontSee('Air sampai di Pos 2');
    }
}
