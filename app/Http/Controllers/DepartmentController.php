<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    // GET ALL
    public function index()
    {
        // return Department::all();
        $departments = Department::withCount('faculties')->get();

    return response()->json($departments);
    }

    // STORE
    public function store(Request $request)
    {
        $request->validate([
        'name' => 'required|unique:departments,name',
    ]);

        $dept = Department::create($request->all());
        return response()->json($dept);
    }

    // DELETE
    public function destroy($id)
    {
        Department::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
    public function update(Request $request, $id)
    {

    $request->validate([
        'name' => 'required|unique:departments,name,' . $id,
    ]);
    
        $dept = Department::findOrFail($id);

        $dept->update($request->all());

        return response()->json($dept);
    }
}