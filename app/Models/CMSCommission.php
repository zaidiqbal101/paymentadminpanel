<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CMSCommission extends Model
{
    use HasFactory;

    protected $table = 'cms_commission';

    public $timestamps = true; // Enable timestamps

    protected $fillable = [
        'id',
        'Agent_ID',
        'Agent_Name',
        'Commission',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(RegisteredUser::class, 'user_id');
    }
}