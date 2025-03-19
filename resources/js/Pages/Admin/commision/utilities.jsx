import React, { useEffect, useState } from 'react';
import { utilityList, UpdateUtilityCommission, gasfastagList, UpdategasfastagCommission } from '@/lib/apis'; // Import both APIs

export default function Utilities() {
  const [utilityData, setUtilityData] = useState([]); // Combined data from both sources
  const categories = [...new Set(utilityData.map(response => response.category.trim()))];

  const [status, setStatus] = useState({});
  const [editCommission, setEditCommission] = useState(null);
  const [originalCommission, setOriginalCommission] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Toggle active/inactive status
  const handleToggle = (category) => {
    setStatus((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Set selected category and filter data
  const handleViewDetails = (category) => {
    setSelectedCategory(category);
  };

  // Get data of selected category
  const filteredData = selectedCategory
    ? utilityData.filter((response) => response.category.trim() === selectedCategory)
    : [];

  // Fetch data from both APIs
  useEffect(() => {
    async function fetchAllData() {
      try {
        // Fetch utility data
        const utilityResponse = await utilityList();
        const utilityItems = utilityResponse.data.data || [];

        // Fetch gas/fastag data
        const gasFastagResponse = await gasfastagList();
        const gasFastagItems = gasFastagResponse.data.data || [];

        // Normalize gas/fastag data to match utility data structure
        const normalizedGasFastag = gasFastagItems.map(item => ({
          operator_id: null, // Gas/Fastag has no operator_id, set as null
          id: item.id, // Keep the original id for updates
          operator_name: item.operator_name,
          category: item.category,
          type: item.type,
          commission: item.commission,
          updated_at: item.updated_at || null,
        }));

        // Combine both datasets
        const combinedData = [...utilityItems, ...normalizedGasFastag];
        setUtilityData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUtilityData([]); // Fallback to empty array on error
      }
    }
    fetchAllData();
  }, []);

  const handleEditDetails = (row) => {
    const selectedData = utilityData.find(
      (item) => (item.operator_id ? item.operator_id === row.operator_id : item.id === row.id)
    );
    setEditCommission(selectedData);
    setOriginalCommission(selectedData);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = {};
      if (editCommission.commission !== originalCommission.commission) {
        updatedData.commission = editCommission.commission;
      }

      if (Object.keys(updatedData).length === 0) {
        alert("No changes detected!");
        return;
      }

      // Determine which API to call based on whether operator_id exists
      if (editCommission.operator_id) {
        await UpdateUtilityCommission(editCommission.operator_id, updatedData);
      } else {
        await UpdategasfastagCommission(editCommission.id, updatedData);
      }

      alert("Commission updated successfully!");
      setEditCommission(null);
      setOriginalCommission(null);

      // Refresh data
      const utilityResponse = await utilityList();
      const gasFastagResponse = await gasfastagList();
      const utilityItems = utilityResponse.data.data || [];
      const gasFastagItems = gasFastagResponse.data.data || [];
      const normalizedGasFastag = gasFastagItems.map(item => ({
        operator_id: null,
        id: item.id,
        operator_name: item.operator_name,
        category: item.category,
        type: item.type,
        commission: item.commission,
        updated_at: item.updated_at || null,
      }));
      setUtilityData([...utilityItems, ...normalizedGasFastag]);
    } catch (error) {
      alert("Failed to update commission.");
      console.error(error);
    }
  };

  const exportToCSV = () => {
    if (!filteredData.length) {
      alert("No data to export!");
      return;
    }

    const headers = [
      "Operator ID",
      "Operator Name",
      "Category",
      "Type",
      "Commission",
      "Last Updated",
    ];

    const csvRows = filteredData.map(row => {
      const formattedDate = row.updated_at
        ? new Date(row.updated_at).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : 'Not updated yet';

      return [
        row.operator_id || 'N/A', // Show N/A for Gas/Fastag
        `"${row.operator_name}"`,
        `"${row.category}"`,
        row.type,
        row.type === "Percentage" ? `${row.commission}%` : row.commission,
        formattedDate,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedCategory}_utility_commission.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='max-w-full bg-gray-100 mt-6'>
      <div className='bg-gray-700 flex justify-between p-4'>
        <h3 className='text-white font-bold'>Utility Commission</h3>
      </div>
      <div className='max-w-full bg-gray-100 mt-6'>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th>S.no</th>
              <th className="border p-2">Operator Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{category}</td>
                  <td className="p-2 border text-center">
                    <button
                      className={`px-4 py-1 rounded-full ${
                        status[category] ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}
                      onClick={() => handleToggle(category)}
                    >
                      {status[category] ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleViewDetails(category)}
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

        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center transition-all ease-in-out duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-2/3 max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Details for {selectedCategory}</h2>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
                  onClick={exportToCSV}
                >
                  Export to CSV
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full border-collapse border border-gray-300 mt-4">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Operator ID</th>
                      <th className="border p-2">Operator Name</th>
                      <th className="border p-2">Category</th>
                      <th className="border p-2">Type</th>
                      <th className="border p-2">Commission</th>
                      <th className="border p-2">Last Updated</th>
                      <th className="border p-2">Edit Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row, index) => (
                        <tr key={index} className="border">
                          <td className="p-2 border">{row.operator_id || 'N/A'}</td>
                          <td className="p-2 border">{row.operator_name}</td>
                          <td className="p-2 border">{row.category}</td>
                          <td className="p-2 border">{row.type}</td>
                          <td className="p-2 border">{row.commission}</td>
                          <td className="border p-2">
                            {row.updated_at
                              ? new Date(row.updated_at).toLocaleString('en-GB', {
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
                              onClick={() => handleEditDetails(row)}
                            >
                              Edit Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center p-4">
                          No data found for {selectedCategory}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-6">
                <button
                  className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                  onClick={() => setSelectedCategory(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {editCommission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-2/3">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Edit Commission Details</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Operator Name</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Commission</th>
                    <th className="border p-2">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">{editCommission.operator_id || 'N/A'}</td>
                    <td className="border p-2">{editCommission.operator_name}</td>
                    <td className="border p-2">{editCommission.category}</td>
                    <td className="border p-2">{editCommission.type}</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={
                          editCommission?.type === "Percentage"
                            ? `${editCommission?.commission ?? ''}%`
                            : editCommission?.commission ?? ''
                        }
                        onChange={(e) => {
                          const newValue = e.target.value.replace('%', '');
                          setEditCommission({ ...editCommission, commission: newValue });
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      {editCommission.updated_at
                        ? new Date(editCommission.updated_at).toLocaleString('en-GB', {
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
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveEdit}>
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => setEditCommission(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}