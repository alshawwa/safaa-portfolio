<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');

        return response()->json($settings);
    }

    public function adminIndex()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');

        return response()->json([
            'data' => $settings,
        ]);
    }

    public function updateAll(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'site_name_ar' => 'nullable|string|max:255',
            'site_name_en' => 'nullable|string|max:255',

            'tagline' => 'nullable|string|max:255',
            'tagline_ar' => 'nullable|string|max:255',
            'tagline_en' => 'nullable|string|max:255',

            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',

            'location' => 'nullable|string|max:255',
            'location_ar' => 'nullable|string|max:255',
            'location_en' => 'nullable|string|max:255',

            'description' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',

            'default_language' => 'nullable|in:en,ar',
            'is_published' => 'nullable|boolean',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_bool($value)
                        ? ($value ? '1' : '0')
                        : $value,
                    'type' => is_bool($value) ? 'boolean' : 'text',
                ]
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => SiteSetting::all()->pluck('value', 'key'),
        ]);
    }
}
