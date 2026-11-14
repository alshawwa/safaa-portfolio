<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name',
        'title',
        'title_ar',
        'title_en',
        'bio',
        'bio_ar',
        'bio_en',
        'profile_image',
        'email',
        'phone',
        'location',
        'cv_file',
    ];
}
