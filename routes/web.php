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
use App\Http\Controllers\IpWhitelistController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUtilityOperatorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes (No admin prefix, accessible to unauthenticated users)
Route::get('/login', function () {
    return Inertia::render('Admin/login');
})->middleware('guest')->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/user', [AuthController::class, 'getAuthenticatedUser'])->name('user');

// Admin-Prefixed Authenticated Routes (Require authentication)
Route::middleware('auth:web')->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Member Routes
    Route::get('/members', [MemberController::class, 'memberdashboard'])->name('admin.members');
    Route::post('/member/fetchdetails', [MemberController::class, 'fetchmember'])->name('admin.memberdetails');
    Route::post('/member/add', [MemberController::class, 'addMember'])->name('admin.member.add');
    Route::delete('/member/delete/{id}', [MemberController::class, 'deleteMember'])->name('admin.member.delete');

    // Bank Routes
    Route::get('/bank', [BankController::class, 'bankdashboard'])->name('admin.bank');
    Route::post('/bank/fetchbankdetails', [BankController::class, 'fetchbankdetails'])->name('admin.bankdetails');
    Route::post('/bank/activate', [BankController::class, 'activateBank'])->name('admin.bank.activate');
    Route::post('/bank/deactivate', [BankController::class, 'deactivateBank'])->name('admin.bank.deactivate');

    // Commission Routes
    Route::get('/commissions/{userId}', [CommissionController::class, 'getCommissions'])->name('admin.commissions.get');
    Route::post('/commissions/{userId}', [CommissionController::class, 'updateCommissions'])->name('admin.commissions.update');
    Route::get('/commission-rate/{id}', [CommissionController::class, 'getCommissionRate'])->name('admin.commission.rate');

    // Recharge Routes
    Route::get('/recharge/dashboard', [AdminController::class, 'recharge'])->name('admin.recharge');
    Route::post('/recharge/operators', [AdminController::class, 'operatorlistfetch'])->name('admin.operatorlist');
    Route::post('/recharge/transaction', [AdminController::class, 'rechargetransaction'])->name('admin.rechargetransaction');
    Route::post('/recharge/commission/fetch', [AdminController::class, 'rechargecommission'])->name('admin.recharge.commission.fetch');
    Route::put('/recharge/commission/{id}', [AdminController::class, 'updateRechargeCommission'])->name('admin.recharge.commission.update');

    // Airtel CMS Routes
    Route::get('/cms-airtel', [CMSController::class, 'cmsairteldashboard'])->name('admin.airtel');
    Route::post('/cms-airtel/fetch', [CMSController::class, 'cms_airtel_fetch'])->name('admin.airtel.fetch');

    // Utility Commission Routes
    Route::post('/utility/commission/fetch', [AdminController::class, 'fetchUtilityCommission'])->name('admin.utility.commission.fetch');
    Route::put('/utility/commission/{id}', [AdminController::class, 'updateUtilityCommission'])->name('admin.utility.commission.update');

    // Gas/Fastag Commission Routes
    Route::post('/gasfastag/commission/fetch', [AdminController::class, 'fetchGasfastagCommission'])->name('admin.gasfastag.commission.fetch');
    Route::put('/gasfastag/commission/{id}', [AdminController::class, 'updateGasfastagCommission'])->name('admin.gasfastag.commission.update');

    // CMS Commission Routes
    Route::post('/cms/commission/fetch', [AdminController::class, 'fetchCmsCommission'])->name('admin.cms.commission.fetch');
    Route::put('/cms/commission/{id}', [AdminController::class, 'updateCmsCommission'])->name('admin.cms.commission.update');

    // DMT Commission Routes
    Route::post('/dmt/bank1/commission/fetch', [AdminController::class, 'fetchBank1Commission'])->name('admin.dmt.bank1.commission.fetch');
    Route::post('/dmt/bank2/commission/fetch', [AdminController::class, 'fetchBank2Commission'])->name('admin.dmt.bank2.commission.fetch');
    Route::put('/dmt/bank/commission/{id}', [AdminController::class, 'updateBankCommission'])->name('admin.dmt.bank.commission.update');

    // Beneficiary Routes
    Route::post('/beneficiary1', [MainController::class, 'beneficary1'])->name('admin.beneficiary1');
    Route::post('/beneficiary2', [MainController::class, 'beneficary2'])->name('admin.beneficiary2');

    // Permission Routes
    Route::post('/permissions', [MainController::class, 'displaypermissions'])->name('admin.permissions');
    Route::post('/permissions/add', [MainController::class, 'addpermission'])->name('admin.permissions.add');
    Route::put('/permissions/{id}', [MainController::class, 'updatepermission'])->name('admin.permissions.update');
    Route::delete('/permissions/{id}', [MainController::class, 'deletepermission'])->name('admin.permissions.delete');

    // Role Routes
    Route::post('/roles', [MainController::class, 'getRoles'])->name('admin.roles');
    Route::post('/roles/add', [MainController::class, 'addRole'])->name('admin.roles.add');
    Route::put('/roles/{id}', [MainController::class, 'updateRole'])->name('admin.roles.update');
    Route::delete('/roles/{id}', [MainController::class, 'deleteRole'])->name('admin.roles.delete');
    Route::post('/roles/{id}/permissions', [MainController::class, 'updateRolePermissions'])->name('admin.roles.permissions.update');

    // DMT Bank Routes
    Route::get('/dmt/bank-2', [DMTbankController::class, 'dmt2dashboard'])->name('admin.dmt2.dashboard');
    Route::post('/dmt/bank-2/fetch', [DMTbankController::class, 'fetchdmt2'])->name('admin.dmt2.fetch');

    // LIC Routes
    Route::get('/lic', [LicController::class, 'licdashboard'])->name('admin.lic.dashboard');
    Route::post('/lic/fetch', [LicController::class, 'fetchlicdata'])->name('admin.lic.fetch');

    // Utilities Routes
    Route::get('/utilities/bill-payment', [UtilitiesController::class, 'billpaymentdashboard'])->name('admin.utilities.bill-payment');
    Route::post('/utilities/bill-payment/fetch', [UtilitiesController::class, 'billpaymentdata'])->name('admin.utilities.bill-payment.fetch');
    Route::get('/utilities/insurance-payment', [UtilitiesController::class, 'insurancepaymentdashboard'])->name('admin.utilities.insurance-payment');
    Route::post('/utilities/insurance-payment/fetch', [UtilitiesController::class, 'insurancepaymentdata'])->name('admin.utilities.insurance-payment.fetch');
    Route::get('/utilities/fastag-recharge', [UtilitiesController::class, 'fastagrechargedashboard'])->name('admin.utilities.fastag-recharge');
    Route::post('/utilities/fastag-recharge/fetch', [UtilitiesController::class, 'fastagrechargedata'])->name('admin.utilities.fastag-recharge.fetch');
    Route::get('/utilities/lpg-booking', [UtilitiesController::class, 'lpgbookingdashboard'])->name('admin.utilities.lpg-booking');
    Route::post('/utilities/lpg-booking/fetch', [UtilitiesController::class, 'lpgbookingdata'])->name('admin.utilities.lpg-booking.fetch');
    Route::get('/utilities/municipality-payment', [UtilitiesController::class, 'municipalitypaymentdashboard'])->name('admin.utilities.municipality-payment');
    Route::post('/utilities/municipality-payment/fetch', [UtilitiesController::class, 'municipalitypaymentdata'])->name('admin.utilities.municipality-payment.fetch');

    // Wallet and Credit Balance Routes
    Route::get('/wallet-balance', [AdminController::class, 'getWalletBalance'])->name('admin.wallet-balance');
    Route::get('/credit-balance', [AdminController::class, 'getCreditBalance'])->name('admin.credit-balance');

    // Payment Request Routes
    Route::get('/payment-requests', [BankController::class, 'getAllPaymentRequests'])->name('admin.payment.requests');
    Route::post('/payment-requests/{id}/approve', [BankController::class, 'approvePaymentRequest'])->name('admin.payment.approve');
    Route::post('/payment-requests/{id}/disapprove', [BankController::class, 'disapprovePaymentRequest'])->name('admin.payment.disapprove');

    // IP Whitelist Routes
    Route::get('/ip-whitelist', [IpWhitelistController::class, 'index'])->name('admin.ip-whitelist.index');
    Route::post('/ip-whitelist/{id}/status', [IpWhitelistController::class, 'updateStatus'])->name('admin.ip-whitelist.status');
    Route::put('/ip-whitelist/{id}', [IpWhitelistController::class, 'update'])->name('admin.ip-whitelist.update');
    Route::delete('/ip-whitelist/{id}', [IpWhitelistController::class, 'destroy'])->name('admin.ip-whitelist.destroy');

    // Utility Operators Routes
    Route::get('/utility-operators', [AdminUtilityOperatorController::class, 'index'])->name('admin.utility-operators.index');
    Route::post('/utility-operators/{id}/toggle-status', [AdminUtilityOperatorController::class, 'toggleStatus'])->name('admin.utility-operators.toggle-status');
});

// Authentication Routes