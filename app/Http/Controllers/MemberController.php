<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Log;

class MemberController extends Controller
{
    public function memberdashboard()
    {
        return Inertia::render('Admin/members/memberdashboard');
    }

    public function fetchmember(Request $request)
    {
        // Fetch all roles from the Roles model
        $roles = Roles::all();
        $roleMap = $roles->pluck('name', 'id')->toArray();
        Log::info('Roles fetched from Roles model:', ['roles' => $roleMap]);

        // Fetch all users
        $users = User::all();
        Log::info('Users fetched:', ['users' => $users->toArray()]);

        // Map numeric role IDs to role names
        $users = $users->map(function ($user) use ($roleMap) {
            $roleName = isset($roleMap[$user->role]) ? $roleMap[$user->role] : 'unknown';
            $user->role_name = $roleName;
            return $user;
        });

        Log::info('Users with role names:', ['users' => $users->toArray()]);

        // Group users by their role names
        $data = [];
        foreach ($roleMap as $roleId => $roleName) {
            $key = strtolower($roleName) . 's'; // e.g., "admins", "apiusers", "retailers"
            $data[$key] = $users->where('role_name', $roleName)->values();
        }

        Log::info('Grouped data:', ['data' => $data]);

        return response()->json($data, 200);
    }
    public function addMember(Request $request)
    {
        Log::info('Request data received:', $request->all());
    
        $roleNames = Roles::pluck('name')->toArray();
        Log::info('Role names for validation:', ['roleNames' => $roleNames]);
    
        $validated = $request->validate([
            'role' => 'required|in:' . implode(',', $roleNames),
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'company' => 'nullable|string|max:255',
            'pancard_number' => 'nullable|string|max:20',
            'aadhaar_number' => 'nullable|string|max:20',
            'mobile' => 'nullable|string|max:15',
            'address' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
        ]);
    
        try {
            // Create a copy of the request data
            $data = $request->all();
            
            // Find role ID by name
            $role = Roles::whereRaw('LOWER(name) = ?', [strtolower($validated['role'])])->first();
            
            if (!$role) {
                Log::warning('Invalid role selected, defaulting to role ID 0', ['role' => $validated['role']]);
                $roleId = 0; // Default role ID if mapping fails
            } else {
                $roleId = $role->id;
                Log::info('Mapped role ID:', ['role_id' => $roleId]);
            }
            
            // Explicitly set the role ID in the data array
            $data['role'] = $roleId;
            
            $generatedPassword = null;
    
            if ($validated['role'] !== 'deactivated') {
                $generatedPassword = Str::upper(Str::random(4)) . rand(1000, 9999) . Str::upper(Str::random(4));
                $data['password'] = Hash::make($generatedPassword);
            }
    
            // Debug what we're about to save
            Log::info('Data being saved to User model:', $data);
            
            $member = User::create($data);
            Log::info('User created:', $member->toArray());
    
            if ($generatedPassword) {
                Mail::to($member->email)->send(new WelcomeEmail($member, $generatedPassword));
            }
    
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
        $mainAdminId = 1;

        try {
            $member = User::findOrFail($id);

            // Fetch role names to check if the user is an admin
            $roles = Roles::pluck('name', 'id')->toArray();
            $roleName = isset($roles[$member->role]) ? $roles[$member->role] : 'unknown';

            if ($roleName === 'admin' && $member->id === $mainAdminId) {
                return response()->json(['error' => 'Cannot deactivate the main admin'], 403);
            }

            // Fetch the ID of the 'deactivated' role
            $deactivatedRole = Roles::where('name', 'deactivated')->first();
            if (!$deactivatedRole) {
                throw new \Exception('Deactivated role not found');
            }

            if ($member->role != $deactivatedRole->id) {
                $member->role = $deactivatedRole->id;
                $member->deactivation_reason = $request->input('deactivation_reason', 'Deactivated on ' . now());
                $member->save();
            }

            return response()->json(['message' => 'Member deactivated successfully'], 200);
        } catch (\Exception $e) {
            \Log::error("Failed to deactivate member: " . $e->getMessage());
            return response()->json(['error' => 'Failed to deactivate member: ' . $e->getMessage()], 500);
        }
    }
}