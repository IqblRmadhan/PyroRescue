<?php

namespace Tests\Feature;

use Tests\TestCase;

class MainMenuCarouselTest extends TestCase
{
    public function test_guest_can_browse_one_level_at_a_time_from_the_menu(): void
    {
        $this->post(route('login.guest'))->assertRedirect(route('main-menu'));

        $this->get(route('main-menu'))
            ->assertOk()
            ->assertSee('data-level-carousel', false)
            ->assertSee('data-carousel-previous', false)
            ->assertSee('data-carousel-next', false)
            ->assertSee('data-level="1"', false)
            ->assertSee('data-level="2"', false)
            ->assertSee('data-level="3"', false)
            ->assertSee('aria-hidden="true" inert', false)
            ->assertSee(route('game.level1'), false)
            ->assertSee(route('game.level2'), false);
    }
}
