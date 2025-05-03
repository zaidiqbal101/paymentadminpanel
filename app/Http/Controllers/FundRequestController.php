<?php

namespace App\Http\Controllers;

use App\Models\FundRequest;
use Illuminate\Http\Request;
use Exception;

class FundRequestController extends Controller
{
   

    /**
     * Update the status of a fund request (0 or 1 only)
     */

     public function index()
     {
         try {
             // Get all fund requests with their related bank data
             $fundRequests = FundRequest::with('bank')->get();
 
             return response()->json([
                 'message' => 'Fund requests retrieved successfully',
                 'fund_requests' => $fundRequests
             ], 200);
 
         } catch (Exception $e) {
             return response()->json([
                 'message' => 'An error occurred while retrieving fund requests',
                 'error' => $e->getMessage()
             ], 500);
         }
     }

    public function updateStatus(Request $request, $id)
    {
        try {
            // Validate the request - status must be 0 or 1
            $request->validate([
                'status' => 'required|integer|in:0,1'
            ]);

            // Find the fund request
            $fundRequest = FundRequest::findOrFail($id);

            // Update only the status
            $fundRequest->update([
                'status' => $request->status
            ]);

            return response()->json([
                'message' => 'Status updated successfully',
                'fund_request' => $fundRequest
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Fund request not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the status'
            ], 500);
        }
    }
}