<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MainController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/',[AdminController::class,'dashboard'])->name('admin.recharge');




Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/admin/recharge/dashboard',[AdminController::class,'recharge'])->name('admin.recharge');
Route::post('/admin/recharge',[AdminController::class,'operatorlistfetch'])->name('admin.opeartorlist');
Route::post('/admin/recharge/transaction',[AdminController::class,'rechargetransaction'])->name('admin.rechargetransaction');

// recharge commission
Route::get('/admin/commission',[AdminController::class,'commission'])->name('admin.recharge');
Route::post('/admin/recharge/commission',[AdminController::class,'rechargecommission'])->name('admin.commission');
Route::put('/admin/update-commission-recharge/{id}', [AdminController::class, 'updateRechargeCommission']);

//utility commission
Route::post('/admin/utility/commission', [AdminController::class, 'fetchUtilityCommission']);
Route::put('/admin/update-commission-utility/{id}', [AdminController::class, 'updateUtilityCommission']);

Route::post('/admin/gasfastag/commission', [AdminController::class, 'fetchGasfastagCommission']);
Route::put('/admin/update-commission-gasfastag/{id}', [AdminController::class, 'updateGasfastagCommission']);


//cms commission
Route::post('/admin/cms/commission', [AdminController::class, 'fetchCmsCommission']);
Route::put('/admin/update-commission-cms/{id}', [AdminController::class, 'updateCmsCommission']);

//dmt commission

Route::post('/admin/dmt-bank1/commission', [AdminController::class, 'fetchBank1Commission']);
Route::post('/admin/dmt-bank2/commission', [AdminController::class, 'fetchBank2Commission']);
Route::put('/admin/update-commission-bank/{id}', [AdminController::class, 'updateBankCommission']);


//beneficiary data
Route::post('/admin/beneficiary1',[MainController::class,'beneficary1'])->name('admin.beneficiary');
Route::post('/admin/beneficiary2',[MainController::class,'beneficary2'])->name('admin.beneficiary');

//permissions 
Route::post('/admin/roles',[MainController::class,'roles'])->name('admin.roles');
Route::get('/admin/displaypermissions',[MainController::class,'displaypermissions'])->name('admin.displaypermissions');
Route::post('/admin/permissions',[MainController::class,'permissions'])->name('admin.permissions');
Route::post('/admin/addnew/permission',[MainController::class,'addpermission'])->name('admin.newpermission');
Route::post('/admin/update/permission/{id}',[MainController::class,'updatepermission'])->name('admin.updatepermission');
Route::post('/admin/delete/permission/{id}',[MainController::class,'deletepermission'])->name('admin.deletepermission');


//  Roles
Route::get('/admin/displayroles',[MainController::class,'displayroles'])->name('admin.roles');
Route::post('/admin/roles', [MainController::class, 'getRoles']); // Fetch all roles
Route::post('/admin/addnew/role', [MainController::class, 'addRole']); // Add a new role
Route::post('/admin/update/role/{id}', [MainController::class, 'updateRole']); // Update a role
Route::post('/admin/delete/role/{id}', [MainController::class, 'deleteRole']); // Delete a role
Route::post('/admin/role/{id}/permissions', [MainController::class, 'updateRolePermissions']); // Update role permissions

require __DIR__.'/auth.php';
