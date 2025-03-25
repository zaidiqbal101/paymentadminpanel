import React, { useEffect, useState } from 'react';
import { getAllBankDetails, activateBank, deactivateBank, getAllPaymentRequests,approvePaymentRequest ,disapprovePaymentRequest } from '@/lib/apis';

export default function BankDashboard() {
  const [banks, setBanks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState('inactive');
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ show: false, bank: null, action: '' });
  const [showPendingModal, setShowPendingModal] = useState(false);

  useEffect(() => {
    fetchBankData();
    fetchPendingRequests();
  }, []);

  const fetchBankData = async () => {
    try {
      const data = await getAllBankDetails();
      if (Array.isArray(data)) {
        setBanks(data);
      } else {
        setBanks([]);
        console.warn('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const data = await getAllPaymentRequests();
      console.log(data)
      if (Array.isArray(data)) {
        setPendingRequests(data);
      } else {
        setPendingRequests([]);
        console.warn('Fetched payment requests data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching payment requests:', error);
    }
  };

  const handleActivate = async (bankId) => {
    try {
      await activateBank(bankId);
      fetchBankData();
      setSelectedBank(null);
    } catch (error) {
      console.error('Error activating bank:', error);
    }
  };

  const handleDeactivate = async (bankId) => {
    try {
      await deactivateBank(bankId);
      fetchBankData();
    } catch (error) {
      console.error('Error deactivating bank:', error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      // Call API to approve request (you'll define this in the backend)
      await approvePaymentRequest(requestId);
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDisapproveRequest = async (requestId) => {
    try {
      // Call API to disapprove request (you'll define this in the backend)
      await disapprovePaymentRequest(requestId);
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('Error disapproving request:', error);
    }
  };

  const filteredBanks = Array.isArray(banks)
    ? banks.filter(bank => {
        const match = bank.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      bank.ifsc_code.toLowerCase().includes(searchTerm.toLowerCase());
        return selectedTab === 'inactive' ? (bank.status === 0 && match) : (bank.status === 1 && match);
      })
    : [];

  const confirmAction = () => {
    if (confirmDialog.action === 'activate') {
      handleActivate(confirmDialog.bank.id);
    } else if (confirmDialog.action === 'deactivate') {
      handleDeactivate(confirmDialog.bank.id);
    }
    setConfirmDialog({ show: false, bank: null, action: '' });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Bank Dashboard</h2>
        <button
          onClick={() => setShowPendingModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex relative items-center"
        >
          Pending Requests
          {pendingRequests.length > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full absolute -top-2 -right-1 px-2 py-1 text-xs">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedTab('inactive')}
          className={`px-4 py-2 rounded ${selectedTab === 'inactive' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
        >
          Inactive Banks
        </button>
        <button
          onClick={() => setSelectedTab('active')}
          className={`px-4 py-2 rounded ${selectedTab === 'active' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
        >
          Active Banks
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Bank Name or IFSC"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full text-black"
        />
      </div>

      {/* Bank Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-black">Bank Name</th>
            <th className="border border-gray-300 p-2 text-black">Account Holder</th>
            <th className="border border-gray-300 p-2 text-black">Account Number</th>
            <th className="border border-gray-300 p-2 text-black">IFSC Code</th>
            <th className="border border-gray-300 p-2 text-black">User</th>
            {selectedTab === 'active' && (
              <th className="border border-gray-300 p-2 text-black">Activated On</th>
            )}
            <th className="border border-gray-300 p-2 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBanks.map((bank) => (
            <tr key={bank.id}>
              <td className="border border-gray-300 p-2 text-black">{bank.bank}</td>
              <td className="border border-gray-300 p-2 text-black">{bank.account_name}</td>
              <td className="border border-gray-300 p-2 text-black">{bank.account_number}</td>
              <td className="border border-gray-300 p-2 text-black">{bank.ifsc_code}</td>
              <td className="border border-gray-300 p-2 text-black">{bank.username}</td>
              {selectedTab === 'active' && (
                <td className="border border-gray-300 p-2 text-black">
                  {new Date(bank.updated_at).toLocaleString()}
                </td>
              )}
              <td className="border border-gray-300 p-2">
                {selectedTab === 'inactive' ? (
                  <button
                    className="bg-black text-white px-3 py-1 rounded"
                    onClick={() => setSelectedBank(bank)}
                  >
                    View Details
                  </button>
                ) : (
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      setConfirmDialog({ show: true, bank: bank, action: 'deactivate' })
                    }
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pending Requests Modal */}
      {showPendingModal && (
        <div className="  fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4">
            <h3 className="text-lg font-semibold mb-4 text-black">Pending Payment Requests</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-black">Select Type</th>
                  <th className="border border-gray-300 p-2 text-black">Amount</th>
                  <th className="border border-gray-300 p-2 text-black">Transaction ID</th>
                  <th className="border border-gray-300 p-2 text-black">Deposited Date</th>
                  <th className="border border-gray-300 p-2 text-black">Bank Account</th>
                  <th className="border border-gray-300 p-2 text-black">User Name</th>
                  <th className="border border-gray-300 p-2 text-black">Image</th>
                  <th className="border border-gray-300 p-2 text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
              {pendingRequests.map((request) => (
  <tr key={request.id}>
    <td className="border border-gray-300 p-2 text-black">{request.transaction_type}</td>
    <td className="border border-gray-300 p-2 text-black">{request.amount}</td>
    <td className="border border-gray-300 p-2 text-black">{request.transaction_id}</td>
    <td className="border border-gray-300 p-2 text-black">{request.deposited_date}</td>
    
    {/* ✅ Show Bank Name instead of bank_id */}
    <td className="border border-gray-300 p-2 text-black">
      {request.bank ? request.bank.bank : 'N/A'}
    </td>

    {/* ✅ Show User Name instead of user_id */}
    <td className="border border-gray-300 p-2 text-black">
      {request.user ? request.user.name : 'N/A'}
    </td>

    <td className="border border-gray-300 p-2 text-black">{request.file_path}</td>
    <td className="border border-gray-300 p-2">
      <button
        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        onClick={() => handleApproveRequest(request.id)}
      >
        Approve
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => handleDisapproveRequest(request.id)}
      >
        Disapprove
      </button>
    </td>
  </tr>
))}

</tbody>
              
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowPendingModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {selectedBank && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">Bank Details</h3>
            <p className="text-black"><strong>Bank Name:</strong> {selectedBank.bank}</p>
            <p className="text-black"><strong>Account Name:</strong> {selectedBank.account_name}</p>
            <p className="text-black"><strong>Account Number:</strong> {selectedBank.account_number}</p>
            <p className="text-black"><strong>IFSC Code:</strong> {selectedBank.ifsc_code}</p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={() =>
                  setConfirmDialog({ show: true, bank: selectedBank, action: 'activate' })
                }
              >
                Activate
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setSelectedBank(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">Confirm Action</h3>
            <p className="text-black">
              Are you sure you want to{' '}
              <span className="font-bold">
                {confirmDialog.action === 'activate' ? 'activate' : 'deactivate'}
              </span>{' '}
              this bank?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={confirmAction}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setConfirmDialog({ show: false, bank: null, action: '' })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}