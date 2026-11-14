<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    // عرض جميع الخدمات
    public function index()
    {
        return Service::orderBy('sort_order')->get();
    }

    // إضافة خدمة جديدة
    public function store(Request $request)
    {
        $data = $request->validate([
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:services,slug',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $data['title'] = $data['title_en'] ?? $data['title_ar'] ?? $data['title'] ?? 'New Service';

        $data['description'] = $data['description_en']
            ?? $data['description_ar']
            ?? $data['description']
            ?? null;

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        }

        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        $service = Service::create($data);

        return response()->json($service, 201);
    }

    // عرض خدمة واحدة
    public function show(Service $service)
    {
        return response()->json($service);
    }

    // تعديل خدمة
    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'title_ar' => 'sometimes|nullable|string|max:255',
            'title_en' => 'sometimes|nullable|string|max:255',
            'description_ar' => 'sometimes|nullable|string',
            'description_en' => 'sometimes|nullable|string',
            'title' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'slug' => 'sometimes|nullable|string|max:255|unique:services,slug,' . $service->id,
            'icon' => 'sometimes|nullable|string|max:255',
            'sort_order' => 'sometimes|nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($data['title_en']) || isset($data['title_ar'])) {
            $data['title'] = $data['title_en'] ?? $data['title_ar'] ?? $service->title;
        }

        if (isset($data['description_en']) || isset($data['description_ar'])) {
            $data['description'] = $data['description_en']
                ?? $data['description_ar']
                ?? $service->description;
        }

        $service->update($data);

        return response()->json($service);
    }

    // حذف خدمة
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully',
        ]);
    }
}
