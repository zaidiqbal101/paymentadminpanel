<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BankCommission extends Model
{
    use HasFactory;

    protected $table = 'bank_commission';

    public $timestamps = true; // Enable timestamps

    protected $fillable = [
        'id',
        'transaction_amount',
        'commission',
        'category',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(RegisteredUser::class, 'user_id');
    }
}