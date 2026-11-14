<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectCategory extends Model
{
    //
     protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function projects()
{
    return $this->belongsToMany(
        Project::class,
        'project_category_project',
        'project_category_id',
        'project_id'
    );
}
}
