import React, { useState } from 'react';
import { fetchRateData } from '@/lib/apis';

export default function TableStructureCommision({ columns, data }) {
  const [status, setStatus] = useState({});
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [editCommission, setEditCommission] = useState(null);
  const [rateData, setRateData] = useState({});


  // Assuming the first column is the unique identifier (e.g., ID)
  const idKey = columns[0]?.key || 'id'; // Fallback to 'id' if no columns provided

  const handleToggle = (id) => {
    setStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  const handleViewDetails = (row) => {
    setSelectedCommission(row);
    fetchRateData(row[idKey]); // Use dynamic ID key
  };

  const handleSaveEdit = () => {
    const updatedData = {
      rate: editCommission.rate || rateData[editCommission[idKey]]?.rate || '',
      type: editCommission.type || rateData[editCommission[idKey]]?.type || '',
    };
    setEditCommission(null);
  };

  return (
    <div className='max-w-full bg-gray-100 mt-6'>
      <table className='w-full border-collapse border border-gray-300 mt-4'>
        <thead className='bg-gray-200'>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className='border p-2 text-left'>{col.label}</th>
            ))}
            <th className='border p-2 text-left'>Status</th>
            <th className='border p-2 text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className='border'>
                {columns.map((col) => (
                  <td key={col.key} className='p-2 border'>{row[col.key]}</td>
                ))}
                <td className='p-2 border'>
                  <button
                    className={`px-4 py-1 rounded-full ${
                      status[row[idKey]] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                    onClick={() => handleToggle(row[idKey])}
                  >
                    {status[row[idKey]] ? 'Active' : 'Inactive'}
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
                    onClick={() =>
                      setEditCommission({
                        ...row,
                        rate: rateData[row[idKey]]?.rate || '',
                        type: rateData[row[idKey]]?.type || '',
                      })
                    }
                  >
                    Edit Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 2} className='text-center p-4'>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View Commission Modal */}
      {selectedCommission && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded shadow-lg w-3/4'>
            <h2 className='text-xl font-bold mb-4 text-center'>Commission Details</h2>
            <table className='w-full border-collapse border border-gray-300'>
              <thead className='bg-gray-200'>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className='border p-2'>{col.label}</th>
                  ))}
                  <th className='border p-2'>Commission Rate</th>
                  <th className='border p-2'>Commission Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {columns.map((col) => (
                    <td key={col.key} className='border p-2'>{selectedCommission[col.key]}</td>
                  ))}
                  <td className='border p-2'>{rateData[selectedCommission[idKey]]?.rate || 'Loading...'}</td>
                  <td className='border p-2'>{rateData[selectedCommission[idKey]]?.type || 'Loading...'}</td>
                </tr>
              </tbody>
            </table>
            <div className='text-center mt-4'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded'
                onClick={() => setSelectedCommission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Commission Modal */}
      {editCommission && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded shadow-lg w-3/4'>
            <h2 className='text-xl font-bold mb-4 text-center'>Edit Details</h2>
            <table className='w-full border-collapse border border-gray-300'>
              <thead className='bg-gray-200'>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className='border p-2'>{col.label}</th>
                  ))}
                  <th className='border p-2'>Commission Rate</th>
                  <th className='border p-2'>Commission Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {columns.map((col) => (
                    <td key={col.key} className='border p-2'>{editCommission[col.key]}</td> // Non-editable
                  ))}
                  <td className='border p-2'>
                    <input
                      type='text'
                      className='w-full border p-2 rounded'
                      value={editCommission.rate}
                      onChange={(e) => setEditCommission({ ...editCommission, rate: e.target.value })}
                    />
                  </td>
                  <td className='border p-2'>
                    <select
                      className='w-full border p-2 rounded'
                      value={editCommission.type || ''}
                      onChange={(e) => setEditCommission({ ...editCommission, type: e.target.value })}
                    >
                      <option value=''>Select Type</option>
                      <option value='Rental'>Rental</option>
                      <option value='Percentage'>Percentage</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='text-center mt-4'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded'
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className='bg-gray-500 text-white px-4 py-2 rounded ml-2'
                onClick={() => setEditCommission(null)}
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