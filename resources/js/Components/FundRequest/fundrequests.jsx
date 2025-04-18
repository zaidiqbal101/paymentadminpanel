import React, { useEffect, useState } from 'react';
import { FundRequestData, FundRequestStatus } from '@/lib/services/fundrequest.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function FundRequest() {
  const [fundRequests, setFundRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inactive');

  useEffect(() => {
    fetchFundRequests();
  }, []);

  const fetchFundRequests = async () => {
    try {
      const response = await FundRequestData();
      setFundRequests(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch fund requests:', error);
      setFundRequests([]);
    }
  };

  const handleSwitchStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0; // Toggle status
      await FundRequestStatus(id, newStatus);
      fetchFundRequests(); // Refresh the list
    } catch (error) {
      console.error('Error switching status:', error);
    }
  };

  // Filter requests based on status
  const inactiveRequests = fundRequests.filter(request => request.status === 0);
  const activeRequests = fundRequests.filter(request => request.status === 1);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-black mb-4">Fund Request Dashboard</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="inactive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inactive">Inactive Requests</TabsTrigger>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
        </TabsList>

        {/* Inactive Requests Table */}
        <TabsContent value="inactive">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Deposited Date</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveRequests.length > 0 ? (
                inactiveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.transaction_type}</TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell>{request.transaction_id}</TableCell>
                    <TableCell>{request.deposited_date}</TableCell>
                    <TableCell>{request.bank ? request.bank.bank : 'N/A'}</TableCell>
                    <TableCell>{request.status === 0 ? 'Inactive' : 'Active'}</TableCell>
                    <TableCell>
                      {request.image_path ? (
                        <a href={request.image_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwitchStatus(request.id, request.status)}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Switch to Active
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No inactive requests found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Active Requests Table */}
        <TabsContent value="active">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Deposited Date</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeRequests.length > 0 ? (
                activeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.transaction_type}</TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell>{request.transaction_id}</TableCell>
                    <TableCell>{request.deposited_date}</TableCell>
                    <TableCell>{request.bank ? request.bank.bank : 'N/A'}</TableCell>
                    <TableCell>{request.status === 0 ? 'Inactive' : 'Active'}</TableCell>
                    <TableCell>
                      {request.image_path ? (
                        <a href={request.image_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwitchStatus(request.id, request.status)}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Switch to Inactive
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No active requests found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}