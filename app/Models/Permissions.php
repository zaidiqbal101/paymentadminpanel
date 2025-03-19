<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permissions extends Model
{
    protected $fillable = ['name', 'display_name', 'type', 'updated_at'];

    public function roles()
    {
        return $this->belongsToMany(Roles::class, 'role_permissions', 'permission_id', 'role_id');
    }
}