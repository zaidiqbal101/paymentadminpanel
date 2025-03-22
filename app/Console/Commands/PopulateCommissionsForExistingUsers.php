<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RegisteredUser;
use App\Models\CMSCommission;
use App\Models\BankCommission;
use App\Models\GasFastagCommission;
use App\Models\RechargeCommission;
use App\Models\UtilityCommission;
use Illuminate\Support\Facades\Log;

class PopulateCommissionsForExistingUsers extends Command
{
    protected $signature = 'commissions:populate-existing-users';
    protected $description = 'Populate commissions for existing registered users';

    public function handle()
    {
        $this->info('Starting to populate commissions for existing users...');

        $users = RegisteredUser::all();
        if ($users->isEmpty()) {
            $this->info('No existing users found.');
            return;
        }

        $this->info("Found {$users->count()} existing users.");

        $cmsCommissions = CMSCommission::whereNull('user_id')->get();
        $bankCommissions = BankCommission::whereNull('user_id')->get();
        $gasFastagCommissions = GasFastagCommission::whereNull('user_id')->get();
        $rechargeCommissions = RechargeCommission::whereNull('user_id')->get();
        $utilityCommissions = UtilityCommission::whereNull('user_id')->get();

        if (
            $cmsCommissions->isEmpty() &&
            $bankCommissions->isEmpty() &&
            $gasFastagCommissions->isEmpty() &&
            $rechargeCommissions->isEmpty() &&
            $utilityCommissions->isEmpty()
        ) {
            $this->error('No default commissions found in any commission tables.');
            return;
        }

        foreach ($users as $user) {
            $this->info("Processing user ID: {$user->id}");

            $existingRechargeCommissions = RechargeCommission::where('user_id', $user->id)->exists();
            if ($existingRechargeCommissions) {
                $this->info("User ID: {$user->id} already has commissions. Skipping...");
                continue;
            }

            try {
                foreach ($cmsCommissions as $commission) {
                    CMSCommission::create([
                        'Agent_ID' => $commission->Agent_ID,
                        'Agent_Name' => $commission->Agent_Name,
                        'Commission' => $commission->Commission,
                        'user_id' => $user->id,
                    ]);
                }

                foreach ($bankCommissions as $commission) {
                    BankCommission::create([
                        'transaction_amount' => $commission->transaction_amount,
                        'commission' => $commission->commission,
                        'category' => $commission->category,
                        'user_id' => $user->id,
                    ]);
                }

                foreach ($gasFastagCommissions as $commission) {
                    GasFastagCommission::create([
                        'operator_name' => $commission->operator_name,
                        'category' => $commission->category,
                        'type' => $commission->type,
                        'commission' => $commission->commission,
                        'user_id' => $user->id,
                    ]);
                }

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

                $this->info("Successfully populated commissions for user ID: {$user->id}");
            } catch (\Exception $e) {
                $this->error("Failed to populate commissions for user ID: {$user->id}. Error: " . $e->getMessage());
                Log::error("Failed to populate commissions for user ID: {$user->id}. Error: " . $e->getMessage());
            }
        }

        $this->info('Finished populating commissions for existing users.');
    }
}