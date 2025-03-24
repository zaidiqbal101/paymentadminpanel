import React, { useEffect, useState } from 'react';
import { getAllBankDetails, activateBank, deactivateBank } from '@/lib/apis';

export default function BankDashboard() {
  const [banks, setBanks] = useState([]);
  const [selectedTab, setSelectedTab] = useState('inactive');
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ show: false, bank: null, action: '' });

  useEffect(() => {
    fetchBankData();
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
  <h2 className="text-xl font-semibold mb-4 text-black">Bank Dashboard</h2>

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
