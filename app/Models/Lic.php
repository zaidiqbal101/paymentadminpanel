<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lic extends Model
{
    protected $table = 'lic_enquiries'; 

    protected $fillable = [
        'ad1', 'ad2', 'ad3', 'amount', 'canumber', 'comm',
        'dateadded', 'daterefunded', 'operatorid', 'operatorname',
        'refid', 'refunded', 'refundtxnid', 'status', 'tds', 'txnid'
    ];

    public $timestamps = true; 
}
