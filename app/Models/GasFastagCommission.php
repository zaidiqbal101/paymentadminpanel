<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class GasFastagCommission extends Model
{
    use HasFactory;

    protected $table = 'gas_fastag_commission'; // Specify the table name

    protected $fillable = [
        'id',
        'operator_name',
        'category',
        'type',
        'commission',
    ];
}
