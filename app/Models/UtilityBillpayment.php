<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UtilityBillpayment extends Model
{
    protected $table = 'utility_status_enquiries';

    protected $fillable = [
        'reference_id',
        'transaction_id',
        'operator_name',
        'customer_number',
        'amount',
        'additional_data_1',
        'additional_data_2',
        'additional_data_3',
        'commission',
        'tds',
        'transaction_status',
        'operator_id',
        'date_added',
        'refunded',
        'refund_transaction_id',
        'date_refunded',
    ];

    protected $dates = [
        'date_added',
        'date_refunded',
        'created_at',
        'updated_at',
    ];

    public $timestamps = true; // Ensures created_at and updated_at are handled
}
