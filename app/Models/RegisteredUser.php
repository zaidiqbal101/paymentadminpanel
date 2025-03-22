<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegisteredUser extends Model
{
    protected $table = 'registered_users';
    protected $fillable = [
        'name', 'email', 'password','company', 'parent', 'shop_name', 'pancard_number',
        'aadhaar_number', 'mobile', 'address', 'state', 'city', 'pincode',
        'main_wallet', 'collection_wallet', 'or_wallet', 'rr_wallet', 'locked_amount',
    ];
}