<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * عرض المشاريع المنشورة للزوار.
     */
    public function index()
    {
        $projects = Project::with(['categories', 'images'])
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->latest()
            ->get();

        return response()->json(
            $projects->map(fn ($project) => $this->formatProject($project))
        );
    }

    /**
     * عرض جميع المشاريع للإدارة.
     */
    public function adminIndex()
    {
        $projects = Project::with(['categories', 'images'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json(
            $projects->map(fn ($project) => $this->formatProject($project))
        );
    }

    /**
     * إضافة مشروع جديد.
     */
    
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'nullable|string|max:255',
        'title_ar' => 'nullable|string|max:255',
        'title_en' => 'nullable|string|max:255',

        'slug' => 'nullable|string|max:255|unique:projects,slug',

        'description' => 'nullable|string',
        'description_ar' => 'nullable|string',
        'description_en' => 'nullable|string',

        'client' => 'nullable|string|max:255',
        'project_url' => 'nullable|url|max:255',
        'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

        'categories' => 'nullable|array',
        'categories.*' => 'integer|exists:project_categories,id',

        'images' => 'nullable|array',
        'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',

        'is_featured' => 'sometimes|boolean',
        'is_published' => 'sometimes|boolean',
        'sort_order' => 'nullable|integer',
    ]);

    $title = $validated['title_en']
        ?? $validated['title_ar']
        ?? $validated['title']
        ?? null;

    if (!$title) {
        return response()->json([
            'message' => 'Please enter a project title in Arabic or English.',
        ], 422);
    }

    $titleAr = $validated['title_ar'] ?? null;
    $titleEn = $validated['title_en'] ?? null;

    $descriptionAr = $validated['description_ar'] ?? null;
    $descriptionEn = $validated['description_en'] ?? null;

    $coverPath = null;

    DB::beginTransaction();

    try {
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')
                ->store('projects/covers', 'public');
        }

        $slug = $validated['slug'] ?? Str::slug($title);

        if (empty($slug)) {
            $slug = 'project-' . Str::lower(Str::random(8));
        }

        while (Project::where('slug', $slug)->exists()) {
            $slug = Str::slug($title) . '-' . Str::lower(Str::random(6));
        }

        $project = Project::create([
            'title' => $title,
            'title_ar' => $titleAr,
            'title_en' => $titleEn,
            'slug' => $slug,

            'description' => $descriptionEn ?? $descriptionAr ?? ($validated['description'] ?? null),
            'description_ar' => $descriptionAr,
            'description_en' => $descriptionEn,

            'client' => $validated['client'] ?? null,
            'project_url' => $validated['project_url'] ?? null,
            'cover_image' => $coverPath,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_published' => $validated['is_published'] ?? false,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        if (!empty($validated['categories'])) {
            $project->categories()->sync($validated['categories']);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('projects/gallery', 'public');

                $project->images()->create([
                    'image' => $path,
                    'alt_text' => $title,
                    'sort_order' => $index,
                ]);
            }
        }

        DB::commit();

        return response()->json(
            $this->formatProject(
                $project->load(['categories', 'images'])
            ),
            201
        );

    } catch (\Throwable $e) {
        DB::rollBack();

        if ($coverPath) {
            Storage::disk('public')->delete($coverPath);
        }

        throw $e;
    }
}


    /**
     * عرض تفاصيل مشروع منشور.
     */
    public function show(Project $project)
    {
        if (!$project->is_published) {
            abort(404);
        }

        $project->load(['categories', 'images']);

        return response()->json($this->formatProject($project));
    }

    /**
     * تعديل مشروع.
     */
   
public function update(Request $request, Project $project)
{
    $validated = $request->validate([
        'title' => 'sometimes|nullable|string|max:255',
        'title_ar' => 'sometimes|nullable|string|max:255',
        'title_en' => 'sometimes|nullable|string|max:255',

        'slug' => 'sometimes|nullable|string|max:255|unique:projects,slug,' . $project->id,

        'description' => 'sometimes|nullable|string',
        'description_ar' => 'sometimes|nullable|string',
        'description_en' => 'sometimes|nullable|string',

        'client' => 'sometimes|nullable|string|max:255',
        'project_url' => 'sometimes|nullable|url|max:255',
        'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

        'categories' => 'sometimes|array',
        'categories.*' => 'integer|exists:project_categories,id',

        'images' => 'sometimes|array',
        'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',

        'is_featured' => 'sometimes|boolean',
        'is_published' => 'sometimes|boolean',
        'sort_order' => 'nullable|integer',
    ]);

    $oldCoverPath = $project->cover_image;
    $newCoverPath = null;

    DB::beginTransaction();

    try {
        if ($request->hasFile('cover_image')) {
            $newCoverPath = $request->file('cover_image')
                ->store('projects/covers', 'public');

            $validated['cover_image'] = $newCoverPath;
        }

        if (
            isset($validated['title_ar']) ||
            isset($validated['title_en'])
        ) {
            $validated['title'] =
                $validated['title_en']
                ?? $validated['title_ar']
                ?? $project->title;
        }

        if (
            isset($validated['description_ar']) ||
            isset($validated['description_en'])
        ) {
            $validated['description'] =
                $validated['description_en']
                ?? $validated['description_ar']
                ?? $project->description;
        }

        unset($validated['categories'], $validated['images']);

        if (array_key_exists('slug', $validated) && empty($validated['slug'])) {
            unset($validated['slug']);
        }

        $project->update($validated);

        if ($request->has('categories')) {
            $project->categories()->sync(
                $request->input('categories', [])
            );
        }

        if ($request->hasFile('images')) {
            $currentCount = $project->images()->count();

            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('projects/gallery', 'public');

                $project->images()->create([
                    'image' => $path,
                    'alt_text' => $project->title,
                    'sort_order' => $currentCount + $index,
                ]);
            }
        }

        DB::commit();

        if ($newCoverPath && $oldCoverPath) {
            Storage::disk('public')->delete($oldCoverPath);
        }

        return response()->json(
            $this->formatProject(
                $project->fresh()->load(['categories', 'images'])
            )
        );

    } catch (\Throwable $e) {
        DB::rollBack();

        if ($newCoverPath) {
            Storage::disk('public')->delete($newCoverPath);
        }

        throw $e;
    }
}


    /**
     * حذف مشروع وصوره.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        DB::beginTransaction();

        try {
            if ($project->cover_image) {
                Storage::disk('public')->delete($project->cover_image);
            }

            $project->load('images');

            foreach ($project->images as $image) {
                Storage::disk('public')->delete($image->image);
            }

            $project->categories()->detach();
            $project->images()->delete();
            $project->delete();

            DB::commit();

            return response()->json([
                'message' => 'Project deleted successfully.',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            throw $e;
        }
    }

    /**
     * تجهيز روابط الصور.
     */
    private function formatProject(Project $project)
    {
        $project->setAttribute(
            'cover_image_url',
            $project->cover_image
                ? url('/storage/' . $project->cover_image)
                : null
        );

        $project->images->each(function ($image) {
            $image->setAttribute(
                'image_url',
                $image->image
                    ? url('/storage/' . $image->image)
                    : null
            );
        });

        return $project;
    }
}