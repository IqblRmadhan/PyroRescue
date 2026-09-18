<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    protected $fillable = [
        'level_number',
        'title',
        'material',
        'learning_objective',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function challenges(): HasMany
    {
        return $this->hasMany(Challenge::class)->orderBy('order_number');
    }

    public function userLevelProgress(): HasMany
    {
        return $this->hasMany(UserLevelProgress::class);
    }
}
