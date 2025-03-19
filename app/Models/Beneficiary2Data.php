<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiary2Data extends Model
{
    protected $table= 'register_beneficiary2s';

    protected $fillable= ['id','bankid','bene_id','name','accno','ifsc','verified','banktype','status','bank3','message ','created_at','updated_at'];
}

