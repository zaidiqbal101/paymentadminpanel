import React, { useEffect, useState } from 'react';
import { Bank2List, UpdateBankCommission } from '@/lib/apis';

export default function Dmtbank2() {
  const [bankData, setBankData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editCommissionData, setEditCommissionData] = useState(null);
  const [originalCommission, setOriginalCommission] = useState(null);

  useEffect(() => {
    async function fetchBankData() {
      try {
        const response = await Bank2List();
        setBankData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Bank 2 data:", error);
        setBankData([]);
      }
    }
    fetchBankData();
  }, []);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
  };

  const handleEditCommission = (record) => {
    setEditCommissionData({ ...record });
    setOriginalCommission({ ...record });
  };

  const handleCommissionChange = (e) => {
    const newValue = e.target.value.replace('%', '');
    setEditCommissionData({ ...editCommissionData, commission: newValue });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = {};
      if (editCommissionData.commission !== originalCommission.commission) {
        updatedData.commission = editCommissionData.commission;
      }

      if (Object.keys(updatedData).length === 0) {
        alert("No changes detected!");
        return;
      }

      await UpdateBankCommission(editCommissionData.id, updatedData);
      alert("Commission updated successfully!");

      const response = await Bank2List();
      if (response?.data?.data) {
        setBankData(response.data.data);
      }

      setEditCommissionData(null);
      setOriginalCommission(null);
    } catch (error) {
      alert("Failed to update commission.");
      console.error("Error updating commission:", error);
    }
  };

  return (
    <div className="max-w-full bg-gray-100 mt-6">
      <div className="bg-gray-700 flex justify-between p-4">
        <h3 className="text-white font-bold">DMT Bank 2 Commission</h3>
      </div>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th>S.no</th>
            <th className="border p-2">Transaction Amount</th>
            <th className="border p-2">Commission</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bankData.length > 0 ? (
            bankData.map((record, index) => (
              <tr key={index} className="border">
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border text-center">{record.transaction_amount}</td>
                <td className="p-2 border text-center">{record.commission}%</td>
                <td className="p-2 border text-center">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleViewDetails(record)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-2/3 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Details for Transaction Amount {selectedRecord.transaction_amount}</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Transaction Amount</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Commission</th>
                  <th className="border p-2">Last Updated</th>
                  <th className="border p-2">Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="p-2 border">{selectedRecord.id}</td>
                  <td className="p-2 border">{selectedRecord.transaction_amount}</td>
                  <td className="p-2 border">{selectedRecord.category}</td>
                  <td className="p-2 border">{selectedRecord.commission}%</td>
                  <td className="p-2 border">
                    {selectedRecord.updated_at
                      ? new Date(selectedRecord.updated_at).toLocaleString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      : 'Not updated yet'}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditCommission(selectedRecord)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editCommissionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-2/3">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Edit Commission</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Transaction Amount</th>
                  <th className="border p-2">Commission</th>
                  <th className="border p-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{editCommissionData.id}</td>
                  <td className="border p-2">{editCommissionData.transaction_amount}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={`${editCommissionData.commission}%`}
                      onChange={handleCommissionChange}
                    />
                  </td>
                  <td className="border p-2">
                    {editCommissionData.updated_at
                      ? new Date(editCommissionData.updated_at).toLocaleString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      : 'Not updated yet'}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditCommissionData(null)}
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