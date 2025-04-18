<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UtilityOperator extends Model
{ 
    use HasFactory;

    protected $fillable = [
        'name', 'category', 'viewbill', 'displayname', 'regex',
        'ad1_d_name', 'ad1_name', 'ad1_regex',
        'ad2_d_name', 'ad2_name', 'ad2_regex',
        'ad3_d_name', 'ad3_name', 'ad3_regex', 'status'
    ];
}