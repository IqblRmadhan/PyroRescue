<?php

namespace Tests\Feature;

use Tests\TestCase;

class Level1PageTest extends TestCase
{
    public function test_level_one_and_the_prototype_route_show_the_editor(): void
    {
        foreach (['/game/1', '/game-test'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('Tepi Sungai Terbakar')
                ->assertSee('id="game-container"', false)
                ->assertSee('id="code-editor"', false)
                ->assertSee('Tulis kode Python di sini...')
                ->assertSee('kanan(angka)')
                ->assertSee('Run Code')
                ->assertSee('Hint')
                ->assertSee('Reset');
        }
    }
}
