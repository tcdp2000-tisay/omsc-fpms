<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'faculty_count',
        'programs',
        'head',
        'status'
    ];

    public function faculties()
    {
        return $this->hasMany(Faculty::class, 'department', 'name');
    }
}