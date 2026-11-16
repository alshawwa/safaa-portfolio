<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    // عرض جميع الرسائل
    public function index()
    {
        return response()->json(
            Message::latest()->get()
        );
    }

    // استقبال رسالة جديدة من الموقع
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $message = Message::create($data);

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => $message,
        ], 201);
    }

    // عرض رسالة واحدة
    public function show(Message $message)
    {
        return response()->json($message);
    }

    // تحديث حالة الرسالة
    public function update(Request $request, string $id)
    {
        $message = Message::findOrFail($id);

        $data = $request->validate([
            'is_read' => 'sometimes|boolean',
        ]);

        $message->update($data);

        return response()->json([
            'message' => 'Message updated successfully.',
            'data' => $message,
        ]);
    }

    // حذف رسالة
    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }
}
