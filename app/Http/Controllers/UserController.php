<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    

    public function index()
    {
        return User::all();
    }

    public function updateRole(Request $request, $id)
    {
         
        $request->validate([
            'role' => 'required|in:admin,faculty,user'
        ]);
    
        // ✅ CHECK ADMIN
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Role updated successfully',
            'user' => $user
        ]);
    }
}
