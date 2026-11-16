<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectCategory;


class ProjectCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
          return response()->json(
            ProjectCategory::withCount('projects')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:project_categories,slug',
        ]);

        $category = ProjectCategory::create($validated);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectCategory $projectCategory)
    {
        //
        return response()->json(
            $projectCategory->load('projects')
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjectCategory $projectCategory)
    {
        //
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:project_categories,slug,' . $projectCategory->id,
        ]);

        $projectCategory->update($validated);

        return response()->json($projectCategory);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectCategory $projectCategory)
    {
        //
        $projectCategory->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
