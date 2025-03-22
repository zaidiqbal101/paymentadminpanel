<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CMSCommission;
use App\Models\BankCommission;
use App\Models\GasFastagCommission;
use App\Models\RechargeCommission;
use App\Models\UtilityCommission;
use App\Models\RegisteredUser;
use Illuminate\Support\Facades\Log;

class CommissionController extends Controller
{
    public function getCommissions($userId)
    {
        try {
            $user = RegisteredUser::findOrFail($userId);

            $cmsCommissions = CMSCommission::where('user_id', $userId)->get();
            $bankCommissions = BankCommission::where('user_id', $userId)->get();
            $gasFastagCommissions = GasFastagCommission::where('user_id', $userId)->get();
            $rechargeCommissions = RechargeCommission::where('user_id', $userId)->get();
            $utilityCommissions = UtilityCommission::where('user_id', $userId)->get();

            return response()->json([
                'cms_commissions' => $cmsCommissions,
                'bank_commissions' => $bankCommissions,
                'gas_fastag_commissions' => $gasFastagCommissions,
                'recharge_commissions' => $rechargeCommissions,
                'utility_commissions' => $utilityCommissions,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Failed to fetch commissions for user ID: {$userId}. Error: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch commissions: ' . $e->getMessage()], 500);
        }
    }

    public function updateCommissions(Request $request, $userId)
    {
        try {
            $user = RegisteredUser::findOrFail($userId);

            $validated = $request->validate([
                'cms_commissions' => 'nullable|array',
                'cms_commissions.*.id' => 'required|exists:cms_commission,id',
                'cms_commissions.*.Commission' => 'nullable|numeric|min:0',

                'bank_commissions' => 'nullable|array',
                'bank_commissions.*.id' => 'required|exists:bank_commission,id',
                'bank_commissions.*.commission' => 'nullable|numeric|min:0',

                'gas_fastag_commissions' => 'nullable|array',
                'gas_fastag_commissions.*.id' => 'required|exists:gas_fastag_commission,id',
                'gas_fastag_commissions.*.commission' => 'nullable|numeric|min:0',

                'recharge_commissions' => 'nullable|array',
                'recharge_commissions.*.id' => 'required|exists:recharge_commission,id',
                'recharge_commissions.*.server_1_commission' => 'nullable|numeric|min:0',
                'recharge_commissions.*.server_2_commission' => 'nullable|numeric|min:0',

                'utility_commissions' => 'nullable|array',
                'utility_commissions.*.id' => 'required|exists:utility_commission,id',
                'utility_commissions.*.commission' => 'nullable|numeric|min:0',
            ]);

            if (!empty($validated['cms_commissions'])) {
                foreach ($validated['cms_commissions'] as $cmsCommission) {
                    $updateData = [];
                    if (isset($cmsCommission['Commission'])) {
                        $updateData['Commission'] = $cmsCommission['Commission'];
                    }
                    if (!empty($updateData)) {
                        CMSCommission::where('id', $cmsCommission['id'])
                            ->where('user_id', $userId)
                            ->update($updateData);
                    }
                }
            }

            if (!empty($validated['bank_commissions'])) {
                foreach ($validated['bank_commissions'] as $bankCommission) {
                    $updateData = [];
                    if (isset($bankCommission['commission'])) {
                        $updateData['commission'] = $bankCommission['commission'];
                    }
                    if (!empty($updateData)) {
                        BankCommission::where('id', $bankCommission['id'])
                            ->where('user_id', $userId)
                            ->update($updateData);
                    }
                }
            }

            if (!empty($validated['gas_fastag_commissions'])) {
                foreach ($validated['gas_fastag_commissions'] as $gasFastagCommission) {
                    $updateData = [];
                    if (isset($gasFastagCommission['commission'])) {
                        $updateData['commission'] = $gasFastagCommission['commission'];
                    }
                    if (!empty($updateData)) {
                        GasFastagCommission::where('id', $gasFastagCommission['id'])
                            ->where('user_id', $userId)
                            ->update($updateData);
                    }
                }
            }

            if (!empty($validated['recharge_commissions'])) {
                foreach ($validated['recharge_commissions'] as $rechargeCommission) {
                    $updateData = [];
                    if (isset($rechargeCommission['server_1_commission'])) {
                        $updateData['server_1_commission'] = $rechargeCommission['server_1_commission'];
                    }
                    if (isset($rechargeCommission['server_2_commission'])) {
                        $updateData['server_2_commission'] = $rechargeCommission['server_2_commission'];
                    }
                    if (!empty($updateData)) {
                        RechargeCommission::where('id', $rechargeCommission['id'])
                            ->where('user_id', $userId)
                            ->update($updateData);
                    }
                }
            }

            if (!empty($validated['utility_commissions'])) {
                foreach ($validated['utility_commissions'] as $utilityCommission) {
                    $updateData = [];
                    if (isset($utilityCommission['commission'])) {
                        $updateData['commission'] = $utilityCommission['commission'];
                    }
                    if (!empty($updateData)) {
                        UtilityCommission::where('id', $utilityCommission['id'])
                            ->where('user_id', $userId)
                            ->update($updateData);
                    }
                }
            }

            return response()->json(['message' => 'Commissions updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error("Failed to update commissions for user ID: {$userId}. Error: " . $e->getMessage());
            return response()->json(['error' => 'Failed to update commissions: ' . $e->getMessage()], 500);
        }
    }
}