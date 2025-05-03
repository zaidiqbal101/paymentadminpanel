import React, { useState } from 'react';
import axios from 'axios';

const IpWhitelist = ({ whitelistedIps: initialIps }) => {
  const [whitelistedIps, setWhitelistedIps] = useState(initialIps);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingIp, setEditingIp] = useState(null);
  const [editForm, setEditForm] = useState({ ip_address: '', user_id: '' });

  // Handle status change
  const handleStatusChange = async (ip, newStatus) => {
    setUpdatingId(ip.id);
    
    try {   
      const response = await axios.post(`/admin/ip-whitelist/${ip.id}/status`, {   
        status: newStatus   
      });   
      
      // Update local state
      setWhitelistedIps(whitelistedIps.map(item => 
        item.id === ip.id ? { ...item, ...response.data.whitelistedIp } : item
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Open edit form
  const handleEditClick = (ip) => {
    setEditingIp(ip);
    setEditForm({ ip_address: ip.ip_address, user_id: ip.user_id });
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`/admin/ip-whitelist/${editingIp.id}`, editForm);
      
      // Update local state
      setWhitelistedIps(whitelistedIps.map(item =>
        item.id === editingIp.id ? { ...item, ...response.data.whitelistedIp } : item
      ));
      
      setEditingIp(null); // Close modal
      alert('IP updated successfully');
    } catch (error) {
      console.error('Failed to update IP:', error);
      alert('Failed to update IP');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this IP?')) return;
    
    try {
      await axios.delete(`/admin/ip-whitelist/${id}`);
      
      // Update local state
      setWhitelistedIps(whitelistedIps.filter(item => item.id !== id));
      alert('IP deleted successfully');
    } catch (error) {
      console.error('Failed to delete IP:', error);
      alert('Failed to delete IP');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">IP Whitelist Management</h1>
      
      {whitelistedIps && whitelistedIps.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {whitelistedIps.map((ip) => (
                <tr key={ip.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ip.user_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ip.ip_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ip.status === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ip.status === 1 ? 'Active' : 'Pending'}
                      </span>
                      
                      <div className="relative ml-2">
                        <select
                          className="block pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                          value={ip.status}
                          onChange={(e) => handleStatusChange(ip, parseInt(e.target.value))}
                          disabled={updatingId === ip.id}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Pending</option>
                        </select>
                        
                        {updatingId === ip.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                            <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ip.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      onClick={() => handleEditClick(ip)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(ip.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No IP addresses have been whitelisted yet.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingIp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit IP</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <input
                  type="text"
                  value={editForm.ip_address}
                  onChange={(e) => setEditForm({ ...editForm, ip_address: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="number"
                  value={editForm.user_id}
                  onChange={(e) => setEditForm({ ...editForm, user_id: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setEditingIp(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IpWhitelist;