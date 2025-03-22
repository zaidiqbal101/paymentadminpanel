<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GasFastagCommission extends Model
{
    use HasFactory;

    protected $table = 'gas_fastag_commission';

    public $timestamps = true; // Enable timestamps

    protected $fillable = [
        'id',
        'operator_name',
        'category',
        'type',
        'commission',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(RegisteredUser::class, 'user_id');
    }
}