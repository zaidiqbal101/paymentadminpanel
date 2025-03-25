<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\DMTbankController;
use App\Http\Controllers\LicController;
use App\Http\Controllers\UtilitiesController;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\CMSController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/',[AdminController::class,'dashboard'])->name('admin.recharge');




Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getAuthenticatedUser']);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Member routes
Route::get('/admin/members', [MemberController::class, 'memberdashboard'])->name('admin.members');
Route::post('/admin/member/fetchdetails', [MemberController::class, 'fetchmember'])->name('admin.memberdetails');
Route::post('/admin/member/add', [MemberController::class, 'addMember'])->name('admin.member.add');
Route::delete('/admin/member/delete/{id}', [MemberController::class, 'deleteMember'])->name('admin.member.delete');

// bank details
Route::get('/admin/bank', [BankController::class, 'bankdashboard'])->name('admin.bank');
Route::post('/admin/bank/fetchbankdetails', [BankController::class, 'fetchbankdetails'])->name('admin.bankdetails');
Route::post('/admin/bank/activate', [BankController::class, 'activateBank']);
Route::post('/admin/bank/deactivate', [BankController::class, 'deactivateBank']);



// Commission routes
Route::get('/admin/commissions/{userId}', [CommissionController::class, 'getCommissions'])->name('admin.commissions.get');
Route::post('/admin/commissions/{userId}', [CommissionController::class, 'updateCommissions'])->name('admin.commissions.update');


Route::get('/admin/recharge/dashboard',[AdminController::class,'recharge'])->name('admin.recharge');
Route::post('/admin/recharge',[AdminController::class,'operatorlistfetch'])->name('admin.opeartorlist');
Route::post('/admin/recharge/transaction',[AdminController::class,'rechargetransaction'])->name('admin.rechargetransaction');

// recharge commission
Route::get('/admin/commission',[AdminController::class,'commission'])->name('admin.recharge');
Route::post('/admin/recharge/commission',[AdminController::class,'rechargecommission'])->name('admin.commission');
Route::put('/admin/update-commission-recharge/{id}', [AdminController::class, 'updateRechargeCommission']);


//airtel commission
Route::get('/admin/cms-airtel',[CMSController::class,'cmsairteldashboard'])->name('admin.airtel');
Route::post('/admin/cms-airtel-fetch',[CMSController::class,'cms_airtel_fetch'])->name('admin.fetchairtel');




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


//Roles
Route::get('/admin/displayroles',[MainController::class,'displayroles'])->name('admin.roles');
Route::post('/admin/roles', [MainController::class, 'getRoles']); // Fetch all roles
Route::post('/admin/addnew/role', [MainController::class, 'addRole']); // Add a new role
Route::post('/admin/update/role/{id}', [MainController::class, 'updateRole']); // Update a role
Route::post('/admin/delete/role/{id}', [MainController::class, 'deleteRole']); // Delete a role
Route::post('/admin/role/{id}/permissions', [MainController::class, 'updateRolePermissions']); // Update role permissions


//DMT1
Route::get('/admin/dmt-bank-2',[DMTbankController::class,'dmt2dashboard'])->name('admin.dmt1dashboard');
Route::post('/admin/dmt-bank-2/fetchdata',[DMTbankController::class,'fetchdmt2'])->name('admin.dmt1dashboard');


//LIC

Route::get('/admin/lic',[LicController::class,'licdashboard'])->name('admin.licdashboard');
Route::post('/admin/licdata',[LicController::class,'fetchlicdata'])->name('admin.fetchlicdata');

//Utilities Dashboard API

Route::get('/admin/utilities/bill-payment',[UtilitiesController::class,'billpaymentdashboard'])->name('admin.bill-payment');
Route::post('/admin/utilities/bill-payment-data',[UtilitiesController::class,'billpaymentdata'])->name('admin.bill-payment');
Route::get('/admin/utilities/insurance-payment',[UtilitiesController::class,'insurancepaymentdashboard'])->name('admin.bill-payment');
Route::post('/admin/utilities/insurance-payment-data',[UtilitiesController::class,'insurancepaymentdata'])->name('admin.bill-payment');
Route::get('/admin/utilities/fastag-recharge',[UtilitiesController::class,'fastagrechargedashboard'])->name('admin.bill-payment');
Route::post('/admin/utilities/fastag-recharge-data',[UtilitiesController::class,'fastagrechargedata'])->name('admin.bill-payment');
Route::get('/admin/utilities/lpg-booking',[UtilitiesController::class,'lpgbookingdashboard'])->name('admin.bill-payment');
Route::post('/admin/utilities/lpg-booking-data',[UtilitiesController::class,'lpgbookingdata'])->name('admin.bill-payment');
Route::get('/admin/utilities/municipality-payment',[UtilitiesController::class,'municipalitypaymentdashboard'])->name('admin.bill-payment');
Route::post('/admin/utilities/municipality-payment-data',[UtilitiesController::class,'municipalitypaymentdata'])->name('admin.bill-payment');



    // Wallet and Credit Balance Routes
    Route::get('/admin/wallet-balance', [AdminController::class, 'getWalletBalance'])
         ->name('admin.wallet-balance');
    
    Route::get('/admin/credit-balance', [AdminController::class, 'getCreditBalance'])
         ->name('admin.credit-balance');

//payment requests 
Route::get('/payment-requests', [BankController::class, 'getAllPaymentRequests'])->name('payment.requests');
Route::post('/payment-requests/{id}/approve', [BankController::class, 'approvePaymentRequest'])->name('payment.approve');
Route::post('/payment-requests/{id}/disapprove', [BankController::class, 'disapprovePaymentRequest'])->name('payment.disapprove');

require __DIR__.'/auth.php';
