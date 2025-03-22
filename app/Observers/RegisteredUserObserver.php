<?php

namespace App\Observers;

use App\Models\RegisteredUser;
use App\Models\CMSCommission;
use App\Models\BankCommission;
use App\Models\GasFastagCommission;
use App\Models\RechargeCommission;
use App\Models\UtilityCommission;
use Illuminate\Support\Facades\Log;

class RegisteredUserObserver
{
    public function created(RegisteredUser $user)
    {
        try {
            Log::info("RegisteredUserObserver triggered for user ID: {$user->id}");

            // Fetch default commission data from respective tables (where user_id is NULL)
            $cmsCommissions = CMSCommission::whereNull('user_id')->get();
            $bankCommissions = BankCommission::whereNull('user_id')->get();
            $gasFastagCommissions = GasFastagCommission::whereNull('user_id')->get();
            $rechargeCommissions = RechargeCommission::whereNull('user_id')->get();
            $utilityCommissions = UtilityCommission::whereNull('user_id')->get();

            Log::info("Default CMS Commissions found: " . $cmsCommissions->count());
            Log::info("Default Bank Commissions found: " . $bankCommissions->count());
            Log::info("Default Gas/Fastag Commissions found: " . $gasFastagCommissions->count());
            Log::info("Default Recharge Commissions found: " . $rechargeCommissions->count());
            Log::info("Default Utility Commissions found: " . $utilityCommissions->count());

            if (
                $cmsCommissions->isEmpty() &&
                $bankCommissions->isEmpty() &&
                $gasFastagCommissions->isEmpty() &&
                $rechargeCommissions->isEmpty() &&
                $utilityCommissions->isEmpty()
            ) {
                Log::warning("No default commissions found in any commission tables for user ID: {$user->id}");
                return;
            }

            // Copy CMS Commissions
            foreach ($cmsCommissions as $commission) {
                CMSCommission::create([
                    'Agent_ID' => $commission->Agent_ID,
                    'Agent_Name' => $commission->Agent_Name,
                    'Commission' => $commission->Commission,
                    'user_id' => $user->id,
                ]);
                Log::info("Created CMS Commission for user ID: {$user->id}, Agent_ID: {$commission->Agent_ID}");
            }

            // Copy Bank Commissions
            foreach ($bankCommissions as $commission) {
                BankCommission::create([
                    'transaction_amount' => $commission->transaction_amount,
                    'commission' => $commission->commission,
                    'category' => $commission->category,
                    'user_id' => $user->id,
                ]);
                Log::info("Created Bank Commission for user ID: {$user->id}, Transaction Amount: {$commission->transaction_amount}");
            }

            // Copy Gas/Fastag Commissions
            foreach ($gasFastagCommissions as $commission) {
                GasFastagCommission::create([
                    'operator_name' => $commission->operator_name,
                    'category' => $commission->category,
                    'type' => $commission->type,
                    'commission' => $commission->commission,
                    'user_id' => $user->id,
                ]);
                Log::info("Created Gas/Fastag Commission for user ID: {$user->id}, Operator: {$commission->operator_name}");
            }

            // Copy Recharge Commissions
            foreach ($rechargeCommissions as $commission) {
                RechargeCommission::create([
                    'operator_id' => $commission->operator_id,
                    'operator_name' => $commission->operator_name,
                    'server_1_commission' => $commission->server_1_commission,
                    'server_2_commission' => $commission->server_2_commission,
                    'category' => $commission->category,
                    'user_id' => $user->id,
                ]);
                Log::info("Created Recharge Commission for user ID: {$user->id}, Operator: {$commission->operator_name}");
            }

            // Copy Utility Commissions
            foreach ($utilityCommissions as $commission) {
                UtilityCommission::create([
                    'operator_name' => $commission->operator_name,
                    'operator_id' => $commission->operator_id,
                    'category' => $commission->category,
                    'type' => $commission->type,
                    'commission' => $commission->commission,
                    'user_id' => $user->id,
                ]);
                Log::info("Created Utility Commission for user ID: {$user->id}, Operator: {$commission->operator_name}");
            }

            Log::info("Successfully populated commissions for user ID: {$user->id}");
        } catch (\Exception $e) {
            Log::error("Failed to populate commissions for user ID: {$user->id}. Error: " . $e->getMessage());
        }
    }
}