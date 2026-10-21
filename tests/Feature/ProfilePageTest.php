<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserLevelProgress;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfilePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_about_section_introduces_developers_and_shows_the_new_footer(): void
    {
        $this->get('/')->assertOk()->assertSee('Kenali Pengembang')
            ->assertSee('Iqbal')->assertSee('Indra')->assertSee('class="site-footer"', false);
    }

    public function test_player_finds_progress_achievements_and_settings_in_profile_instead_of_menu(): void
    {
        $user = User::factory()->create(['name' => 'Penjaga Hutan']);
        $this->actingAs($user);

        $this->get('/main-menu')->assertOk()->assertSee(route('profile'), false)
            ->assertDontSee('id="progress"', false)->assertDontSee('id="pencapaian"', false);
        $this->get('/profile')->assertOk()->assertSee('Penjaga Hutan')
            ->assertSee('Progres Level')->assertSee('Pencapaian')
            ->assertSee('Musik')->assertSee('Efek suara')
            ->assertSee('Tampilan')->assertSee('Kenyamanan')
            ->assertSee('Hapus akun');
    }

    public function test_guest_profile_links_lead_to_registration_and_profile_route_is_locked(): void
    {
        $this->get('/profile')->assertRedirect(route('login'));
        $this->post(route('login.guest'));
        $this->get('/main-menu')->assertOk()
            ->assertSee('href="'.route('register').'" aria-label="Profil pemain terkunci, buat akun"', false)
            ->assertSee('Profil terkunci');
        $this->get('/profile')->assertRedirect(route('register'));
        $this->patch('/profile', ['name' => 'Baru'])->assertForbidden();
        $this->delete('/profile', ['password' => 'password'])->assertForbidden();
    }

    public function test_player_can_update_identity_and_delete_account_only_with_current_password(): void
    {
        $user = User::factory()->create();
        $this->seed();
        $this->actingAs($user);
        $this->postJson('/progress/challenge', ['level' => 1, 'challenge' => 1])->assertOk();
        $this->patch('/profile', ['name' => 'Penjaga Baru', 'email' => 'baru@example.test'])
            ->assertRedirect(route('profile'));
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Penjaga Baru', 'email' => 'baru@example.test']);

        $this->delete('/profile', ['password' => 'keliru', 'confirmation' => 'HAPUS'])
            ->assertSessionHasErrors('password');
        $this->assertDatabaseHas('users', ['id' => $user->id]);

        $this->delete('/profile', ['password' => 'password', 'confirmation' => 'HAPUS'])
            ->assertRedirect(route('home'));
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertSame(0, UserLevelProgress::where('user_id', $user->id)->count());
    }

    public function test_password_change_requires_the_old_password_and_updates_login_credentials(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->patch('/profile/password', [
            'current_password' => 'keliru', 'password' => 'rahasia-baru',
            'password_confirmation' => 'rahasia-baru',
        ])->assertSessionHasErrors('current_password');
        $this->patch('/profile/password', [
            'current_password' => 'password', 'password' => 'rahasia-baru',
            'password_confirmation' => 'rahasia-baru',
        ])->assertRedirect(route('profile'));
        $this->assertTrue(Hash::check('rahasia-baru', $user->fresh()->password));
    }
}
