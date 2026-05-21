<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faculty;


class FacultyController extends Controller
{
    // GET ALL
    public function index()
    {
        return response()->json(Faculty::all());
    }

    // STORE
    public function store(Request $request)
    {
        $faculty = Faculty::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'department' => $request->department,
            'employee_id' => $request->employeeId,
            'position' => $request->position,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => $request->status,
        ]);

        return response()->json($faculty, 201);
    }

    public function show(int $id)
    {
        $faculty = Faculty::with('user')->findOrFail($id);
        return response()->json($faculty);
    }

    public function getByUserId($user_id)
{
    return Faculty::with('user')
        ->where('user_id', $user_id)
        ->first();
}
}