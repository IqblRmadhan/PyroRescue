<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            [
                'level_number' => 1,
                'title' => 'Tepi Sungai Terbakar',
                'material' => 'variable',
                'learning_objective' => 'Pemain mampu membuat, mengubah, dan menggunakan variabel sederhana sesuai kebutuhan misi.',
                'is_active' => true,
            ],
            [
                'level_number' => 2,
                'title' => 'Hutan Gambut Berasap',
                'material' => 'loop',
                'learning_objective' => 'Pemain mampu menggunakan for dan range() untuk menjalankan aksi berulang sesuai kebutuhan misi.',
                'is_active' => true,
            ],
            [
                'level_number' => 3,
                'title' => 'Suaka Bekantan',
                'material' => 'if_else',
                'learning_objective' => 'Pemain mampu menentukan tindakan berdasarkan kondisi serta menggabungkan variabel dan perulangan.',
                'is_active' => true,
            ],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(
                ['level_number' => $level['level_number']],
                $level,
            );
        }
    }
}
