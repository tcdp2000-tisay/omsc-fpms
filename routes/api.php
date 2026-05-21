<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::get('/faculty', [FacultyController::class, 'index']);
Route::post('/faculty', [FacultyController::class, 'store']);
Route::get('/faculty/user/{user_id}', [FacultyController::class, 'getByUserId']);
Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/$id', [UserController::class, 'show']);
Route::get('/faculty/{id}', [FacultyController::class, 'show']);

Route::middleware('auth:sanctum')->put('/user/update', function (Request $request) {
    $user = $request->user();

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'contact' => $request->contact,
        'birthdate' => $request->birthdate,
        'address' => $request->address,
    ]);

    return response()->json($user);
});



Route::middleware('auth:sanctum')->post('/change-password', function (Request $request) {

    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:6'
    ]);

    $user = $request->user();

    // check current password
    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'message' => 'Current password is incorrect'
        ], 400);
    }

    // update password
    $user->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json([
        'message' => 'Password updated successfully'
    ]);
});

Route::get('/users', function () {
    return User::all();
});

 
Route::put('/users/{id}/role', function (Request $request, $id) {

    $user = \App\Models\User::findOrFail($id);

    $user->update([
        'role' => $request->role
    ]);

    return response()->json($user);
});

 
Route::get('/users', function () {
    return User::all();
});

Route::middleware('auth:sanctum')->put('/users/{id}/role', [UserController::class, 'updateRole']);