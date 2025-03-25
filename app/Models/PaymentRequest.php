<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentRequest extends Model
{
    use HasFactory;

    protected $table = 'fund_requests';

    protected $fillable = [
        'transaction_type',
        'amount',
        'transaction_id',
        'deposited_date',
        'bank_id',
        'user_id',
        'file_path',
        'status',
        'created_at',
        'updated_at',
    ];

    // ✅ Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Correct the foreign key
    }

    // ✅ Relationship with BankDetails
    public function bank()
    {
        return $this->belongsTo(BankDetails::class, 'bank_id'); // Correct the foreign key
    }
}
