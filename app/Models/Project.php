<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //
    protected $fillable = [
        'title',
        'slug',
        'description',
        'client',
        'project_url',
        'cover_image',
        'is_featured',
        'is_published',
        'sort_order',
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

   public function categories()
{
    return $this->belongsToMany(
        ProjectCategory::class,
        'project_category_project',
        'project_id',
        'project_category_id'
    );
}

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }
    public function getRouteKeyName(): string
{
    return 'slug';
}
}
