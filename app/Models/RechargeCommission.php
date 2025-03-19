<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RechargeCommission extends Model
{

    protected $table = 'recharge_commission';

    public $timestamps = true; 

    protected $fillable = [
        'id',
        'operator_id',
        'operator_name',
        'server_1_commission',
        'server_2_commission',
        'category'
    ];
}
