<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('order_number');
            $table->string('title');
            $table->text('instruction');
            $table->string('concept');
            $table->text('starter_code')->nullable();
            $table->json('expected_data');
            $table->text('hint_1')->nullable();
            $table->text('hint_2')->nullable();
            $table->timestamps();

            $table->unique(['level_id', 'order_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
