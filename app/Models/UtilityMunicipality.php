<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UtilityMunicipality extends Model
{
    protected $table = 'municipality_transactions'; 

    protected $fillable = [
        'txnid',
        'operatorname',
        'canumber',
        'amount',
        'comm',
        'tds',
        'status',
        'refid',
        'operatorid',
        'dateadded',
        'refunded',
        'refundtxnid',
        'daterefunded',
    ];

    public $timestamps = true;
}
