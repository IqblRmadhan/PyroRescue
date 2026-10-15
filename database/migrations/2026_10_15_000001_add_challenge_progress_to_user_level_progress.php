<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_level_progress', function (Blueprint $table) {
            $table->unsignedTinyInteger('completed_challenges')->default(0);
            $table->unsignedTinyInteger('stars')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('user_level_progress', function (Blueprint $table) {
            $table->dropColumn(['completed_challenges', 'stars']);
        });
    }
};
