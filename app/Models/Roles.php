<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    protected $fillable = ['name', 'display_name', 'last_update'];

    public function permissions()
    {
        return $this->belongsToMany(Permissions::class, 'role_permissions', 'role_id', 'permission_id');
    }
}