<?php

use App\Http\Controllers\FundRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::put('/fund-requests/{id}/status', [FundRequestController::class, 'updateStatus']);

Route::get('/fund-requests', [FundRequestController::class, 'index']);