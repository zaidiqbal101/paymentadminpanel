<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhitelistedIp extends Model
{
    protected $table = 'whitelisted_ips';
    
    protected $fillable = [
        'ip_address',
        'user_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}