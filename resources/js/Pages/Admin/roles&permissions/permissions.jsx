import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react'; // Placeholder icon for styling
import {
  getPermissions,
  addPermission,
  updatePermission,
  deletePermission,
} from '@/lib/apis';

// Permissions Component
export default function Permissions() {
  const [permission, setPermissions] = useState([]);
  const [permissionDialog, setPermissionDialog] = useState(false);
  const [editPermission, setEditPermission] = useState(null);
  const [originalPermission, setOriginalPermission] = useState(null);
  const [addNewFormdata, setAddNewFormdata] = useState({
    fields: [
      { key: 'name', value: '', type: 'text', placeholder: 'Enter Name' },
      { key: 'display_name', value: '', type: 'text', placeholder: 'Enter Display Name' },
      { key: 'type', value: '', type: 'text', placeholder: 'Enter Type' },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      try {
        const data = await getPermissions();
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setError('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  const handleChange = (index, e) => {
    const { value } = e.target;
    const updatedFields = [...addNewFormdata.fields];
    updatedFields[index].value = value;
    setAddNewFormdata((prev) => ({
      ...prev,
      fields: updatedFields,
    }));
  };

  const handleEditPermission = (row) => {
    setEditPermission({ ...row });
    setOriginalPermission({ ...row });
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    setEditPermission((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeletePermission = async (row) => {
    if (confirm(`Are you sure you want to delete permission "${row.display_name}"?`)) {
      try {
        setLoading(true);
        await deletePermission(row.id);
        alert('Permission deleted successfully');
        const updatedList = await getPermissions();
        setPermissions(updatedList);
      } catch (error) {
        console.error('Error deleting permission:', error);
        alert('Failed to delete permission');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editPermission?.id) {
        // Update existing permission
        const updatedFields = {};
        Object.keys(editPermission).forEach((key) => {
          if (editPermission[key] !== originalPermission[key]) {
            updatedFields[key] = editPermission[key];
          }
        });

        console.log('Updated Fields for Edit:', updatedFields); // Debug log

        if (Object.keys(updatedFields).length === 0) {
          alert('No changes made.');
          setEditPermission(null);
          return;
        }

        const response = await updatePermission(editPermission.id, updatedFields);
        if (response.message === 'Permission updated successfully') {
          alert('Permission updated successfully');
          const updatedList = await getPermissions();
          setPermissions(updatedList);
          setEditPermission(null);
        } else {
          setError(response.message || 'Update failed');
        }
      } else {
        // Add new permission
        const formValues = addNewFormdata.fields.reduce((acc, field) => {
          acc[field.key] = field.value;
          return acc;
        }, {});

        console.log('Form Values for Add:', formValues); // Debug log

        const response = await addPermission(formValues);
        if (response.message === 'Permission added successfully') {
          alert('New permission added successfully');
          const updatedList = await getPermissions();
          setPermissions(updatedList);
          setAddNewFormdata({
            fields: [
              { key: 'name', value: '', type: 'text', placeholder: 'Enter Name' },
              { key: 'display_name', value: '', type: 'text', placeholder: 'Enter Display Name' },
              { key: 'type', value: '', type: 'text', placeholder: 'Enter Type' },
            ],
          });
          setPermissionDialog(false);
        } else {
          setError(response.message || 'Failed to add permission');
        }
      }
    } catch (error) {
      console.error('Error submitting permission:', error);
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors || {};
        const errorMessage = Object.values(validationErrors).flat().join(', ') || 'Validation errors';
        setError(errorMessage);
      } else {
        setError('Failed to submit permission');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full bg-gray-100 mt-2 w-full">
      <div className="bg-gray-700 flex justify-between p-2 rounded-lg shadow-lg">
        <h3 className="text-white font-bold text-xl">Permissions</h3>
        <button
          className="px-2 py-1 bg-primary_color text-white font-semibold rounded hover:bg-secondary_color hover:scale-105 transition duration-300"
          onClick={() => setPermissionDialog(true)}
        >
          Add New+
        </button>
      </div>

      <div className="p-4">
        <table className="w-full border-collapse border border-gray-400 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-green-900 via-green-500 to-pink-300 text-white">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Display Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Last Updated Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : permission.length > 0 ? (
              permission.map((row) => (
                <tr key={row.id} className="border text-center">
                  <td className="p-2 border">{row.id}</td>
                  <td className="p-2 border">{row.name}</td>
                  <td className="p-2 border">{row.display_name}</td>
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border">
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
                      className="bg-red-800 text-white px-1 py-1 rounded mr-2 hover:bg-red-900 transition duration-300"
                      onClick={() => handleDeletePermission(row)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-1 py-1 rounded hover:bg-yellow-600 transition duration-300"
                      onClick={() => handleEditPermission(row)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  {error || 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {permissionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center transition-all ease-in-out duration-300">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 transform scale-100 hover:scale-105 transition-all ease-in-out duration-300">
            <form onSubmit={handleSubmit}>
              {addNewFormdata.fields.map((field, index) => (
                <div key={field.key} className="mb-2 relative group">
                  <label className="block text-sm font-medium text-gray-700">{field.placeholder}</label>
                  <span className="absolute left-2 transition-transform duration-300 ease-in-out group-hover:scale-125">
                    <MapPin size={20} className="text-blue-500 animate-bounce" />
                  </span>
                  <input
                    type={field.type}
                    name={field.key}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full border p-2 pl-8 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-primary_color text-black p-1 rounded font-bold hover:bg-secondary_color hover:scale-105 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400 transition duration-300"
                  onClick={() => setPermissionDialog(false)}
                >
                  Close
                </button>
              </div>
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {editPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center transition-all ease-in-out duration-300">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 transform scale-100 hover:scale-105 transition-all ease-in-out duration-300">
            <form onSubmit={handleSubmit}>
              {[
                { key: 'name', label: 'Name', value: editPermission.name || '' },
                { key: 'display_name', label: 'Display Name', value: editPermission.display_name || '' },
                { key: 'type', label: 'Type', value: editPermission.type || '' },
              ].map((field) => (
                <div key={field.key} className="mb-2 relative group">
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <span className="absolute left-2 transition-transform duration-300 ease-in-out group-hover:scale-125">
                    <MapPin size={20} className="text-blue-500 animate-bounce" />
                  </span>
                  <input
                    type="text"
                    name={field.key}
                    value={field.value}
                    onChange={handlePermissionChange}
                    className="w-full border p-2 pl-8 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-primary_color text-black p-1 rounded font-bold hover:bg-secondary_color hover:scale-105 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400 transition duration-300"
                  onClick={() => setEditPermission(null)}
                >
                  Close
                </button>
              </div>
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}