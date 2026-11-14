<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'name_en',
        'category',
        'category_ar',
        'category_en',
        'proficiency',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'proficiency' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];
}