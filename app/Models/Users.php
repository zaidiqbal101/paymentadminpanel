<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiPartner extends Model
{
    protected $table = 'users';
    protected $fillable = [
        'name', 'email', 'email_verified_at', 'password', 'remember_token', 'company', 'pancard_number',
        'aadhaar_number', 'mobile', 'address', 'state', 'city', 'pincode', 'role', 'otp_verifaction',
        'created_at', 'updated_at'
    ];
       // ✅ Relationship with PaymentRequest
       public function paymentRequests()
       {
           return $this->hasMany(PaymentRequest::class, 'user_id');
       }
   
}