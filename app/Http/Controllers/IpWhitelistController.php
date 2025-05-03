<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\WhitelistedIp;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IpWhitelistController extends Controller
{
    /**
     * Display the IP Whitelisting page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Fetch all whitelisted IPs with associated user names
        $whitelistedIps = WhitelistedIp::select('whitelisted_ips.*', 'users.name as user_name')
            ->join('users', 'whitelisted_ips.user_id', '=', 'users.id')
            ->get();
        
        return Inertia::render('Admin/IpWhitelist', [
            'whitelistedIps' => $whitelistedIps
        ]);
    }

    /**
     * Update the status of a whitelisted IP.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $whitelistedIp = WhitelistedIp::findOrFail($id);
        $whitelistedIp->status = $request->status;
        $whitelistedIp->save();

        // Fetch the user name for the response
        $whitelistedIp->user_name = $whitelistedIp->user->name;

        return response()->json([
            'success' => true,
            'message' => 'IP status updated successfully',
            'whitelistedIp' => $whitelistedIp
        ]);
    }

    /**
     * Update a whitelisted IP.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'ip_address' => 'required|ip',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $whitelistedIp = WhitelistedIp::findOrFail($id);
        $whitelistedIp->ip_address = $request->ip_address;
        $whitelistedIp->user_id = $request->user_id;
        $whitelistedIp->save();

        // Fetch the user name for the response
        $whitelistedIp->user_name = $whitelistedIp->user->name;

        return response()->json([
            'success' => true,
            'message' => 'IP updated successfully',
            'whitelistedIp' => $whitelistedIp
        ]);
    }

    /**
     * Delete a whitelisted IP.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $whitelistedIp = WhitelistedIp::findOrFail($id);
        $whitelistedIp->delete();

        return response()->json([
            'success' => true,
            'message' => 'IP deleted successfully'
        ]);
    }
}