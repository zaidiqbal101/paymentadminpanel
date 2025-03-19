<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BankCommission extends Model
{

    use HasFactory;
    protected $table= 'bank_commission';

    protected $fillable= ['id','transaction_amount','commission','category','updated_at'];
}
