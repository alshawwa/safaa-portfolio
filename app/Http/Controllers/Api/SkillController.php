<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        return Skill::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'category_ar' => 'nullable|string|max:255',
            'category_en' => 'nullable|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'level' => 'nullable|integer|min:0|max:100',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($data['name'])) {
            $data['name'] = $data['name_ar'] ?? $data['name_en'] ?? '';
        }

        if (isset($data['level']) && !isset($data['proficiency'])) {
            $data['proficiency'] = $data['level'];
        }

        unset($data['level']);

        return response()->json(Skill::create($data), 201);
    }

    public function show(string $id)
    {
        return Skill::findOrFail($id);
    }

    public function update(Request $request, Skill $skill)
    {
        $data = $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'category_ar' => 'nullable|string|max:255',
            'category_en' => 'nullable|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'level' => 'nullable|integer|min:0|max:100',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($data['level']) && !isset($data['proficiency'])) {
            $data['proficiency'] = $data['level'];
        }

        unset($data['level']);

        $skill->update($data);

        return response()->json($skill->fresh());
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'message' => 'Skill deleted successfully',
        ]);
    }
}
