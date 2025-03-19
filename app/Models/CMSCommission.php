<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CMSCommission extends Model
{

    use HasFactory;
    protected $table= 'cms_commission';

    protected $fillable= ['id','Agent_ID','Agent_Name','Commission'];
}
