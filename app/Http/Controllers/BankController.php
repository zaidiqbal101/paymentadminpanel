<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\BankDetails;

use Illuminate\Http\Request;

class BankController extends Controller
{
    public function bankdashboard(){
       return Inertia::render('Admin/bankdashboard');
    }

    public function fetchbankdetails()
{
    $data = BankDetails::with('user:id,name') // Eager load user and only get id, name
        ->select('id', 'bank', 'account_name', 'account_number', 'ifsc_code', 'status', 'updated_at', 'userid')
        ->get();

    // Format the response to include username directly
    $formattedData = $data->map(function ($item) {
        return [
            'id' => $item->id,
            'bank' => $item->bank,
            'account_name' => $item->account_name,
            'account_number' => $item->account_number,
            'ifsc_code' => $item->ifsc_code,
            'status' => $item->status,
            'updated_at' => $item->updated_at,
            'username' => $item->user ? $item->user->name : null, // Get username
        ];
    });

    return response()->json(['data' => $formattedData]);
}

    
    public function activateBank(Request $request)
    {
        $bank = BankDetails::find($request->id);
        $bank->status = 1;
        $bank->updated_at = now();
        $bank->save();
    
        return response()->json(['message' => 'Bank activated successfully']);
    }
    
    public function deactivateBank(Request $request)
    {
        $bank = BankDetails::find($request->id);
        $bank->status = 0;
        $bank->updated_at = now();
        $bank->save();
    
        return response()->json(['message' => 'Bank deactivated successfully']);
    }
    

}
