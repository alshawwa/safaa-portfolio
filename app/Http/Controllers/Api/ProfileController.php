<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Profile;

class ProfileController extends Controller
{
    // عرض بيانات صفاء
    public function index()
    {
        return response()->json(Profile::first());
    }

    // إنشاء أو تحديث بيانات صفاء
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            // المسمى الوظيفي
            'title' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',

            // النبذة التعريفية
            'bio' => 'nullable|string',
            'bio_ar' => 'nullable|string',
            'bio_en' => 'nullable|string',

            // الصورة الشخصية
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            // معلومات التواصل
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',

            // السيرة الذاتية
            'cv_file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $profile = Profile::first();

        if (!$profile) {
            $profile = new Profile();
        }

        // رفع الصورة الشخصية
        if ($request->hasFile('profile_image')) {
            if ($profile->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }

            $validated['profile_image'] = $request
                ->file('profile_image')
                ->store('profiles', 'public');
        }

        // رفع ملف السيرة الذاتية PDF
        if ($request->hasFile('cv_file')) {
            if ($profile->cv_file) {
                Storage::disk('public')->delete($profile->cv_file);
            }

            $validated['cv_file'] = $request
                ->file('cv_file')
                ->store('profiles/cv', 'public');
        }

        $profile->fill($validated);
        $profile->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $profile
        ]);
    }
}
