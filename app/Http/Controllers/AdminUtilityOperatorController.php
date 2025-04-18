<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\UtilityOperator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUtilityOperatorController extends Controller
{
    public function index()
    {
        // Fetch active (status = 1) and inactive (status = 0) operators
        $activeOperators = UtilityOperator::where('status', 1)->get([
            'id', 'name', 'category', 'viewbill', 'displayname', 'regex',
            'ad1_d_name', 'ad1_name', 'ad1_regex',
            'ad2_d_name', 'ad2_name', 'ad2_regex',
            'ad3_d_name', 'ad3_name', 'ad3_regex', 'status'
        ]);
        
        $inactiveOperators = UtilityOperator::where('status', 0)->get([
            'id', 'name', 'category', 'viewbill', 'displayname', 'regex',
            'ad1_d_name', 'ad1_name', 'ad1_regex',
            'ad2_d_name', 'ad2_name', 'ad2_regex',
            'ad3_d_name', 'ad3_name', 'ad3_regex', 'status'
        ]);

        return Inertia::render('Admin/UtilityOperatorManagement', [
            'activeOperators' => $activeOperators,
            'inactiveOperators' => $inactiveOperators,
        ]);
    }

    public function toggleStatus(Request $request, $id)
    {
        $operator = UtilityOperator::findOrFail($id);
        $newStatus = $operator->status === 1 ? 0 : 1;
        $operator->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => "Operator status updated to " . ($newStatus ? 'active' : 'inactive'),
            'operator' => $operator
        ]);
    }
}
