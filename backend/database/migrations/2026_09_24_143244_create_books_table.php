<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('topic');
            $table->text('description')->nullable();
            $table->string('target_audience')->nullable();
            $table->string('language')->default('English');
            $table->string('writing_style')->nullable();
            $table->enum('status', ['draft', 'generating', 'completed'])->default('draft');
            $table->string('cover_image')->nullable();
            $table->text('introduction')->nullable();
            $table->text('conclusion')->nullable();
            $table->integer('number_of_chapters')->default(0);
            $table->integer('approximate_chapter_length')->nullable();
            $table->text('additional_instructions')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
