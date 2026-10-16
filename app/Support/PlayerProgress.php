<?php

namespace App\Support;

use App\Models\User;

class PlayerProgress
{
    public static function summary(?User $user): array
    {
        $records = $user?->userLevelProgress()->with('level')->get()->keyBy('level.level_number');
        $levels = [];
        $previousCompleted = true;
        foreach ([1 => 4, 2 => 4, 3 => 4] as $number => $totalChallenges) {
            $record = $records?->get($number);
            $completed = $record?->status === 'completed' && ($record?->stars ?? 0) >= 1;
            $levels[$number] = [
                'unlocked' => !$user || $previousCompleted,
                'completed' => $completed,
                'challenges' => $completed ? $totalChallenges : ($record?->completed_challenges ?? 0),
                'total_challenges' => $totalChallenges,
                'stars' => $completed ? min(3, $record?->stars ?? 0) : 0,
                // Catatan lama sudah memiliki 3 bintang sebelum kolom nilai ditambahkan.
                'score' => ($record?->score ?? 0) ?: ($completed && $record->stars === 3 ? 100 : 0),
                'playable' => true,
            ];
            $previousCompleted = $previousCompleted && $completed;
        }
        $achievements = [
            ['key' => 'water', 'title' => 'Pasokan Pertama', 'description' => 'Ambil air di pompa pada Challenge 1 Level 1.', 'earned' => $levels[1]['challenges'] >= 1],
            ['key' => 'supply', 'title' => 'Ahli Variabel', 'description' => 'Selesaikan pengiriman air dan capai FINISH Level 1.', 'earned' => $levels[1]['completed']],
            ['key' => 'loop', 'title' => 'Aksi Berulang', 'description' => 'Padamkan api Challenge 2 Level 2 menggunakan perulangan.', 'earned' => $levels[2]['challenges'] >= 2],
            ['key' => 'shield', 'title' => 'Penjaga Hutan', 'description' => 'Tuntaskan evaluasi mandiri dan capai FINISH Level 2.', 'earned' => $levels[2]['completed']],
        ];
        return [
            'levels' => $levels,
            'achievements' => $achievements,
            'completedLevels' => count(array_filter($levels, fn ($level) => $level['completed'])),
            'totalStars' => array_sum(array_column($levels, 'stars')),
            'earnedAchievements' => count(array_filter($achievements, fn ($achievement) => $achievement['earned'])),
        ];
    }

    public static function canPlay(User $user, int $number): bool
    {
        return self::summary($user)['levels'][$number]['unlocked'] ?? false;
    }
}
