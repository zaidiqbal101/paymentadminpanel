<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiPartner extends Model
{
    protected $table = 'api_partners';
    protected $fillable = [
        'name', 'email', 'company', 'parent', 'api_key', 'shop_name', 'pancard_number',
        'aadhaar_number', 'mobile', 'address', 'state', 'city', 'pincode',
        'main_wallet', 'collection_wallet', 'or_wallet', 'rr_wallet', 'locked_amount',
    ];
}