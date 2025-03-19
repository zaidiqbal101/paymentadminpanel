<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperatorList extends Model
{
    protected $table = 'recharge_operators'; 

    protected $fillable = ['operator_name', 'service_name', 'date', 'updated_at', 'created_at']; 

    public $timestamps = true; 
}
