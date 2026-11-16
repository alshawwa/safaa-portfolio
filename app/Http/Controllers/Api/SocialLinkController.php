<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class SocialLinkController extends Controller
{
    /**
     * Display active social links for public website.
     */
    public function index()
    {
        return SocialLink::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Display all social links for admin dashboard.
     */
    public function adminIndex()
    {
        return SocialLink::orderBy('sort_order')->get();
    }

    /**
     * Store a newly created social link.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'platform' => 'required|string|max:100',
            'url' => 'required|url|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $data['is_active'] = $data['is_active'] ?? true;

        return response()->json(
            SocialLink::create($data),
            201
        );
    }

    /**
     * Display the specified social link.
     */
    public function show(SocialLink $socialLink)
    {
        return $socialLink;
    }

    /**
     * Update the specified social link.
     */
    public function update(Request $request, SocialLink $socialLink)
    {
        $data = $request->validate([
            'platform' => 'sometimes|required|string|max:100',
            'url' => 'sometimes|required|url|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $socialLink->update($data);

        return response()->json($socialLink);
    }

    /**
     * Remove the specified social link.
     */
    public function destroy(SocialLink $socialLink)
    {
        $socialLink->delete();

        return response()->json([
            'message' => 'Social link deleted successfully',
        ]);
    }
}