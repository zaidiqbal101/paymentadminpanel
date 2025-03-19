<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiary1Data extends Model
{
    protected $table= 'beneficiary1_registers';

    protected $fillable= ['id','mobile','benename','bankid','accno','ifsccode','verified','gst_state','dob','address','pincode','banktype','bene_id','bankname','created_at','updated_at'];
}

