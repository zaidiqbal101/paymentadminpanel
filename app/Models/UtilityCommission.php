<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class UtilityCommission extends Model
{
    use HasFactory;

    protected $table = 'utility_commission'; // Specify the table name

    protected $fillable = [
        'id',
        'operator_name',
        'operator_id',
        'category',
        'type',
        'commission',
    ];
}
