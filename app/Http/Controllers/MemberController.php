<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\ApiPartner;
use App\Models\RegisteredUser;
use App\Models\DeactivatedUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail; // We'll create this mailable

class MemberController extends Controller
{
    public function memberdashboard()
    {
        return Inertia::render('Admin/members/memberdashboard');
    }

    public function fetchmember(Request $request)
    {
        $admins = User::all();
        $apiPartners = ApiPartner::all();
        $registeredUsers = RegisteredUser::all();
        $deactivatedUsers = DeactivatedUser::all();

        return response()->json([
            'admins' => $admins,
            'api_partners' => $apiPartners,
            'registered_users' => $registeredUsers,
            'deactivated_users' => $deactivatedUsers,
        ], 200);
    }

    public function addMember(Request $request)
    {
        // Validation rules
        $validated = $request->validate([
            'user_type' => 'required|in:ADMIN,API_PARTNER,REGISTERED_USER,DEACTIVATED_USER',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:api_partners,email|unique:registered_users,email|unique:deactivated_users,email',
            'company' => 'nullable|string|max:255',
            'parent' => 'nullable|string|max:255',
            'shop_name' => 'nullable|string|max:255',
            'pancard_number' => 'nullable|string|max:20',
            'aadhaar_number' => 'nullable|string|max:20',
            'mobile' => 'nullable|string|max:15',
            'address' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'api_key' => 'nullable|string|max:255',
            'deactivation_reason' => 'nullable|string',
        ]);

        $data = $request->all();

        try {
            $member = null;
            $generatedPassword = null;

            // Generate a random password for user types that need to log in
            if (in_array($validated['user_type'], ['ADMIN', 'API_PARTNER', 'REGISTERED_USER'])) {
                $generatedPassword = Str::upper(Str::random(4)) . rand(1000, 9999) . Str::upper(Str::random(4)); // e.g., ABCD1234EFGH
                $data['password'] = Hash::make($generatedPassword); // Hash the password
            }

            switch ($validated['user_type']) {
                case 'ADMIN':
                    $member = User::create($data);
                    break;
                case 'API_PARTNER':
                    $member = ApiPartner::create($data);
                    break;
                case 'REGISTERED_USER':
                    $member = RegisteredUser::create($data);
                    break;
                case 'DEACTIVATED_USER':
                    $data['original_user_type'] = $request->input('original_user_type', 'UNKNOWN');
                    $member = DeactivatedUser::create($data);
                    break;
                default:
                    return response()->json(['error' => 'Invalid user type'], 400);
            }

            // Send welcome email if a password was generated
            if ($generatedPassword) {
                Mail::to($member->email)->send(new WelcomeEmail($member, $generatedPassword));
            }

            // Include the generated password in the response
            $responseData = [
                'message' => 'Member added successfully',
                'data' => $member,
            ];
            if ($generatedPassword) {
                $responseData['generated_password'] = $generatedPassword;
            }

            return response()->json($responseData, 201);
        } catch (\Exception $e) {
            \Log::error("Failed to add member: " . $e->getMessage());
            return response()->json(['error' => 'Failed to add member: ' . $e->getMessage()], 500);
        }
    }

    public function deleteMember(Request $request, $id)
    {
        $userType = $request->input('user_type');
        $mainAdminId = 1;

        try {
            $member = null;
            $originalUserType = '';

            switch ($userType) {
                case 'ADMIN':
                    $member = User::findOrFail($id);
                    if ($member->id === $mainAdminId) {
                        return response()->json(['error' => 'Cannot deactivate the main admin'], 403);
                    }
                    $originalUserType = 'ADMIN';
                    break;
                case 'API_PARTNER':
                    $member = ApiPartner::findOrFail($id);
                    $originalUserType = 'API_PARTNER';
                    break;
                case 'REGISTERED_USER':
                    $member = RegisteredUser::findOrFail($id);
                    $originalUserType = 'REGISTERED_USER';
                    break;
                default:
                    return response()->json(['error' => 'Invalid user type'], 400);
            }

            $memberData = $member->toArray();
            $memberData['original_user_type'] = $originalUserType;
            $memberData['deactivation_reason'] = $request->input('deactivation_reason', 'Deactivated on ' . now());
            DeactivatedUser::create($memberData);
            $member->delete();

            return response()->json(['message' => 'Member deactivated successfully'], 200);
        } catch (\Exception $e) {
            \Log::error("Failed to deactivate member: " . $e->getMessage());
            return response()->json(['error' => 'Failed to deactivate member: ' . $e->getMessage()], 500);
        }
    }
}