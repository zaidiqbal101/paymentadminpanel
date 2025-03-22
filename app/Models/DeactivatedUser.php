<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeactivatedUser extends Model
{
    protected $table = 'deactivated_users';
    protected $fillable = [
        'name', 'email', 'company', 'parent', 'shop_name', 'pancard_number',
        'aadhaar_number', 'mobile', 'address', 'state', 'city', 'pincode',
        'deactivation_reason', 'original_user_type', 'main_wallet', 'collection_wallet',
        'or_wallet', 'rr_wallet', 'locked_amount',
    ];
}