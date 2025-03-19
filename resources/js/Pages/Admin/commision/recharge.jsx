import React, { useEffect, useState } from 'react';
import { OperatorList, updateRechargeCommission, fetchAllRechargeCommission } from '@/lib/apis';

export default function Recharge() {
  const [operators, setOperators] = useState([]);
  const [commission, setCommission] = useState([]);
  const [status, setStatus] = useState({});
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [editCommission, setEditCommission] = useState(null);
  const [originalCommission, setOriginalCommission] = useState(null); // Added to store original data

  useEffect(() => {
    async function fetchOperators() {
      try {
        const response = await OperatorList();
        if (!response || !response.data || !response.data.data) {
          console.error("Invalid response format:", response);
          setOperators([]);
          return;
        }
        setOperators(response.data.data);
      } catch (error) {
        console.error("Error fetching operators:", error);
        setOperators([]);
      }
    }

    async function fetchRechargeCommission() {
      try {
        const response = await fetchAllRechargeCommission();
        if (!response || !response.data || !response.data.data) {
          console.error("Invalid response format:", response.data);
          setCommission([]);
          return;
        }
        setCommission(response.data.data);
      } catch (error) {
        console.error("Error fetching commission:", error);
        setCommission([]);
      }
    }

    fetchOperators();
    fetchRechargeCommission();
  }, []);

  const handleToggle = (id) => {
    setStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewDetails = async (row) => {
    setSelectedCommission(row);
  };

  const handleEditDetails = async (row) => {
    const selectedData = commission.find(
      (item) => item.operator_id === row.operator_id
    );
    setEditCommission(selectedData);
    setOriginalCommission(selectedData); // Store original data for comparison
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = {};
      if (editCommission.server_1_commission !== originalCommission.server_1_commission) {
        updatedData.server_1_commission = editCommission.server_1_commission;
      }
      if (editCommission.server_2_commission !== originalCommission.server_2_commission) {
        updatedData.server_2_commission = editCommission.server_2_commission;
      }

      if (Object.keys(updatedData).length === 0) {
        alert("No changes detected!");
        return;
      }

      await updateRechargeCommission(editCommission.operator_id, updatedData);
      alert("Commission updated successfully!");
      setEditCommission(null);
      setOriginalCommission(null); // Clear original data after saving

      // Refresh commission data
      const response = await fetchAllRechargeCommission();
      if (response?.data?.data) {
        setCommission(response.data.data);
      }
    } catch (error) {
      alert("Failed to update commission.");
      console.error(error);
    }
  };

  return (
    <div className='max-w-full bg-gray-100 mt-6'>
      <div className='bg-gray-700 flex justify-between p-4'>
        <h3 className='text-white font-bold'>Operator List</h3>
      </div>

      <table className='w-full border-collapse border border-gray-300 mt-4'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='border p-2'>ID</th>
            <th className='border p-2'>Operator Name</th>
            <th className='border p-2'>Status</th>
            <th className='border p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {operators.length > 0 ? (
            operators.map((row) => (
              <tr key={row.operator_id} className='border'>
                <td className='p-2 border'>{row.operator_id}</td>
                <td className='p-2 border'>{row.operator_name}</td>
                <td className='p-2 border'>
                  <button
                    className={`px-4 py-1 rounded-full ${
                      status[row.operator_id] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                    onClick={() => handleToggle(row.operator_id)}
                  >
                    {status[row.operator_id] ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className='p-2 border'>
                  <button
                    className='bg-blue-500 text-white px-2 py-1 rounded mr-2'
                    onClick={() => handleViewDetails(row)}
                  >
                    View Details
                  </button>
                  <button
                    className='bg-yellow-500 text-white px-2 py-1 rounded'
                    onClick={() => handleEditDetails(row)}
                  >
                    Edit Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className='text-center p-4'>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View Details Modal */}
      {selectedCommission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center transition-all ease-in-out duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 transform scale-100 hover:scale-105 transition-all ease-in-out duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Commission Details</h2>
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700">
                <tr>
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Operator Name</th>
                  <th className="border p-3">Category</th>
                  <th className="border p-3">Server 1 Commission</th>
                  <th className="border p-3">Server 2 Commission</th>
                  <th className="border p-3">Last Updated date</th>
                </tr>
              </thead>
              <tbody className="bg-gray-50">
                {(() => {
                  const selectedData = commission.find(
                    (item) => item.operator_id === selectedCommission.operator_id
                  );
                  return selectedData ? (
                    <tr className="hover:bg-gray-100 transition-all ease-in-out duration-200">
                      <td className="border p-3 text-center">{selectedData.id}</td>
                      <td className="border p-3 text-center">{selectedData.operator_name}</td>
                      <td className="border p-3 text-center">{selectedData.category || "N/A"}</td>
                      <td className="border p-3 text-center">{selectedData.server_1_commission || "N/A"}</td>
                      <td className="border p-3 text-center">{selectedData.server_2_commission || "N/A"}</td>
                      <td className="border p-3 text-center">
                        {selectedData.updated_at ? new Date(selectedData.updated_at).toISOString().split("T")[0] : "N/A"}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="5" className="border p-3 text-center text-red-500 font-semibold">
                        No Data Found
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
            <div className="text-center mt-6">
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                onClick={() => setSelectedCommission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {editCommission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Edit Commission Details</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Operator Name</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Server 1 Commission</th>
                  <th className="border p-2">Server 2 Commission</th>
                  <th className="border p-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{editCommission.operator_id}</td>
                  <td className="border p-2">{editCommission.operator_name}</td>
                  <td className="border p-2">{editCommission.category}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={editCommission?.server_1_commission ?? ''}
                      onChange={(e) =>
                        setEditCommission({ ...editCommission, server_1_commission: e.target.value })
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={editCommission.server_2_commission ?? ''}
                      onChange={(e) =>
                        setEditCommission({ ...editCommission, server_2_commission: e.target.value })
                      }
                    />
                  </td>
                  <td className="border p-2">{editCommission.updated_at || 'Not updated yet'}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-center mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded ml-2" onClick={() => setEditCommission(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}