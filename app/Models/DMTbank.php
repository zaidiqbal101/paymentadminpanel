<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DMTbank extends Model
{
    protected $table = 'd_m_t_transaction2s'; // Make sure your table name is correct

    protected $fillable = [
        'mobile', 
        'pincode', 
        'address', 
        'amount', 
        'txntype', 
        'dob', 
        'gst_state', 
        'bene_id', 
        'otp', 
        'stateresp', 
        'lat', 
        'long', 
        'status', 
        'response_code', 
        'ackno', 
        'referenceid', 
        'utr', 
        'txn_status', 
        'benename', 
        'remarks', 
        'message', 
        'remitter', 
        'account_number', 
        'bc_share', 
        'txn_amount', 
        'NPCI_response_code', 
        'bank_status', 
        'customercharge', 
        'gst', 
        'tds', 
        'netcommission', 
        'created_at', 
        'updated_at'
    ];
}
