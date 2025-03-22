<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RegisteredUser;
use App\Models\CMSCommission;
use App\Models\BankCommission;
use App\Models\GasFastagCommission;
use App\Models\RechargeCommission;
use App\Models\UtilityCommission;

class PopulateUserCommissions extends Command
{
    protected $signature = 'commissions:populate';
    protected $description = 'Populate commission data for each registered user';

    public function handle()
    {
        // Fetch all registered users
        $users = RegisteredUser::all();

        if ($users->isEmpty()) {
            $this->error('No registered users found. Please add users to the registered_users table.');
            return;
        }

        // Fetch the existing "general" commission data (where user_id is NULL)
        $cmsCommissions = CMSCommission::whereNull('user_id')->get();
        $bankCommissions = BankCommission::whereNull('user_id')->get();
        $gasFastagCommissions = GasFastagCommission::whereNull('user_id')->get();
        $rechargeCommissions = RechargeCommission::whereNull('user_id')->get();
        $utilityCommissions = UtilityCommission::whereNull('user_id')->get();

        // Check if there's any general commission data to copy
        if (
            $cmsCommissions->isEmpty() &&
            $bankCommissions->isEmpty() &&
            $gasFastagCommissions->isEmpty() &&
            $rechargeCommissions->isEmpty() &&
            $utilityCommissions->isEmpty()
        ) {
            $this->warn('No general commission data found to copy. Please add commission data with user_id NULL.');
            return;
        }

        foreach ($users as $user) {
            // Copy CMS Commissions
            foreach ($cmsCommissions as $commission) {
                CMSCommission::create([
                    'Agent_ID' => $commission->Agent_ID,
                    'Agent_Name' => $commission->Agent_Name,
                    'Commission' => $commission->Commission,
                    'user_id' => $user->id,
                ]);
            }

            // Copy Bank Commissions
            foreach ($bankCommissions as $commission) {
                BankCommission::create([
                    'transaction_amount' => $commission->transaction_amount,
                    'commission' => $commission->commission,
                    'category' => $commission->category,
                    'user_id' => $user->id,
                ]);
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
            }

            $this->info("Commissions populated for user: {$user->name} (ID: {$user->id})");
        }

        // Delete the original "general" commission data (where user_id is NULL)
        CMSCommission::whereNull('user_id')->delete();
        BankCommission::whereNull('user_id')->delete();
        GasFastagCommission::whereNull('user_id')->delete();
        RechargeCommission::whereNull('user_id')->delete();
        UtilityCommission::whereNull('user_id')->delete();

        $this->info('Commission population completed! Each user now has their own commission data.');
    }
}