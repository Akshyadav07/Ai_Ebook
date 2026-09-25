<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'topic',
        'description',
        'target_audience',
        'language',
        'writing_style',
        'status',
        'cover_image',
        'introduction',
        'conclusion',
        'number_of_chapters',
        'approximate_chapter_length',
        'additional_instructions',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->orderBy('chapter_number');
    }
}
