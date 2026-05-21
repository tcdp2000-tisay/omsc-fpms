<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'department',
        'employee_id',
        'position',
        'email',
        'phone',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}