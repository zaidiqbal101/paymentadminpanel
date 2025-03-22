<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class UtilityLPG extends Model
{
    protected $table = 'lpg_statuses';

    protected $fillable = [
        'reference_id',
        'txnid',
        'operator_name',
        'customer_number',
        'amount',
        'tds',
        'operator_id',
        'refid',
        'date_added',
        'refunded',
        'date_refunded',
        'message',
    ];

    protected $dates = [
        'date_added',
        'date_refunded',
        'created_at',
        'updated_at',
    ];

    public $timestamps = true; // Enables created_at & updated_at
}

