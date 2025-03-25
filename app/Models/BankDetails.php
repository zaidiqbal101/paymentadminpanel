<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User; // Add this line to import User model



class BankDetails extends Model
{
    use HasFactory;
    public $timestamps = true; // Enable timestamps


    protected $table = 'addaccount';
    
    protected $fillable = [
        'bank', 'account_name', 'account_number', 'confirm_account_number', 'ifsc_code', 'status',
        'created_at', 'updated_at',
    ];
        // ✅ Add this function to define relationship with users
        public function user()
        {
            return $this->belongsTo(User::class, 'userid');
        }
            // ✅ Relationship with PaymentRequest (if needed)
    public function paymentRequests()
    {
        return $this->hasMany(PaymentRequest::class, 'bank_id');
    }
}
