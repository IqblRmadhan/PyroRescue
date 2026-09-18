<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Challenge extends Model
{
    protected $fillable = [
        'level_id',
        'order_number',
        'title',
        'instruction',
        'concept',
        'starter_code',
        'expected_data',
        'hint_1',
        'hint_2',
    ];

    protected function casts(): array
    {
        return [
            'expected_data' => 'array',
        ];
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
}
