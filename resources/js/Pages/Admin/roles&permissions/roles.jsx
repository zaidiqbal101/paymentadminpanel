import React, { useEffect, useState } from 'react';
import { MapPin, Pencil } from 'lucide-react';
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getPermissions,
  updateRolePermissions,
} from '@/lib/apis';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleDialog, setRoleDialog] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [originalRole, setOriginalRole] = useState(null);
  const [addNewFormdata, setAddNewFormdata] = useState({
    fields: [
      { key: 'name', value: '', type: 'text', placeholder: 'Enter Name' },
      { key: 'display_name', value: '', type: 'text', placeholder: 'Enter Display Name' },
    ],
  });
  const [permissionDialog, setPermissionDialog] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionFilter, setPermissionFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [rolesData, permissionsData] = await Promise.all([getRoles(), getPermissions()]);
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (index, e) => {
    const { value } = e.target;
    const updatedFields = [...addNewFormdata.fields];
    updatedFields[index].value = value;
    console.log(`Updating field ${updatedFields[index].key} to:`, value);
    setAddNewFormdata((prev) => ({
      ...prev,
      fields: updatedFields,
    }));
  };

  const handleEditRole = (row) => {
    console.log('Editing role:', row);
    setEditRole({ ...row });
    setOriginalRole({ ...row });
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to:`, value);
    setEditRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteRole = async (row) => {
    if (confirm(`Are you sure you want to delete role "${row.display_name}"?`)) {
      try {
        setLoading(true);
        await deleteRole(row.id);
        alert('Role deleted successfully');
        const updatedList = await getRoles();
        setRoles(updatedList);
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Failed to delete role');
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
      if (editRole?.id) {
        const updatedFields = {};
        Object.keys(editRole).forEach((key) => {
          if (editRole[key] !== originalRole[key]) {
            updatedFields[key] = editRole[key];
          }
        });

        console.log('Updated Fields for Edit:', updatedFields);

        if (Object.keys(updatedFields).length === 0) {
          alert('No changes made.');
          setEditRole(null);
          return;
        }

        const response = await updateRole(editRole.id, updatedFields);
        if (response.message === 'Role updated successfully') {
          alert('Role updated successfully');
          const updatedList = await getRoles();
          setRoles(updatedList);
          setEditRole(null);
        } else {
          setError(response.message || 'Update failed');
        }
      } else {
        const formValues = addNewFormdata.fields.reduce((acc, field) => {
          acc[field.key] = field.value;
          return acc;
        }, {});
        console.log('Form Values for Add:', formValues);

        if (!formValues.name || !formValues.display_name) {
          throw new Error('All fields (name, display_name) are required');
        }

        const response = await addRole(formValues);
        if (response.message === 'Role added successfully') {
          alert('New role added successfully');
          const updatedList = await getRoles();
          setRoles(updatedList);
          setAddNewFormdata({
            fields: [
              { key: 'name', value: '', type: 'text', placeholder: 'Enter Name' },
              { key: 'display_name', value: '', type: 'text', placeholder: 'Enter Display Name' },
            ],
          });
          setRoleDialog(false);
        } else {
          setError(response.message || 'Failed to add role');
        }
      }
    } catch (error) {
      console.error('Error submitting role:', error);
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors || {};
        const errorMessage = Object.values(validationErrors).flat().join(', ') || 'Validation errors';
        setError(errorMessage);
      } else {
        setError(error.message || 'Failed to submit role');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle permission change
// Updated getAssignedPermissions with debug
const getAssignedPermissions = (roleId) => {
  const role = roles.find((r) => r.id === roleId);
  console.log('Role Data:', role); // Debug log
  if (!role || !role.permissions) {
    console.warn('No permissions found for role:', roleId);
    return [];
  }
  return role.permissions.map((p) => p.id);
};

// Updated handlePermissionChange (unchanged but included for completeness)
const handlePermissionChange = (permissionId) => {
  setSelectedPermissions((prev) =>
    prev.includes(permissionId)
      ? prev.filter((id) => id !== permissionId)
      : [...prev, permissionId]
  );
};

 // Handle permission submission (preserve existing if unchanged)

  // Get unique types from permissions
  const uniqueTypes = [...new Set(permissions.map((perm) => perm.type))];

  const filteredPermissions = permissions.filter((perm) =>
    perm.type.toLowerCase().includes(permissionFilter.toLowerCase())
  );

// Updated handleSelectAll (unchanged but included for completeness)
const handleSelectAll = () => {
  const allPermissionIds = permissions.map((perm) => perm.id);
  setSelectedPermissions((prev) =>
    prev.length === allPermissionIds.length ? [] : allPermissionIds
  );
};

// Updated handlePermissionSubmit to preserve existing permissions
const handlePermissionSubmit = async () => {
  if (!permissionDialog) return;
  setLoading(true);
  setError(null);

  try {
    const currentAssigned = getAssignedPermissions(permissionDialog.id);
    console.log('Current Assigned Permissions:', currentAssigned);
    console.log('Selected Permissions:', selectedPermissions);

    // If no new selections, keep current permissions
    const toSync = selectedPermissions.length > 0
      ? selectedPermissions
      : currentAssigned;

    // Ensure all selected permissions are valid (exist in permissions list)
    const validPermissions = permissions
      .filter((perm) => toSync.includes(perm.id))
      .map((perm) => perm.id);

    const response = await updateRolePermissions(permissionDialog.id, validPermissions);
    if (response.message === 'Role permissions updated successfully') {
      alert('Role permissions updated successfully');
      setPermissionDialog(null);
      setSelectedPermissions([]);
      setPermissionFilter('');
      const updatedRoles = await getRoles();
      setRoles(updatedRoles);
    } else {
      setError(response.message || 'Failed to update permissions');
    }
  } catch (error) {
    console.error('Error updating role permissions:', error);
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors || {};
      const errorMessage = Object.values(validationErrors).flat().join(', ') || 'Validation errors';
      setError(errorMessage);
    } else {
      setError(error.message || 'Failed to update permissions');
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-full bg-gray-100 mt-2 w-full">
      <div className="bg-gray-700 flex justify-between p-2 rounded-lg shadow-lg">
        <h3 className="text-white font-bold text-xl">Roles</h3>
        <button
          className="px-2 py-1 bg-primary_color text-white font-semibold rounded hover:bg-secondary_color hover:scale-105 transition duration-300"
          onClick={() => setRoleDialog(true)}
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
              <th className="border p-2">Last Updated Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : roles.length > 0 ? (
              roles.map((row) => (
                <tr key={row.id} className="border text-center">
                  <td className="p-2 border">{row.id}</td>
                  <td className="p-2 border">{row.name}</td>
                  <td className="p-2 border">{row.display_name}</td>
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
    onClick={() => handleDeleteRole(row)}
  >
    Delete
  </button>
  <button
    className="bg-yellow-500 text-white px-1 py-1 rounded mr-2 hover:bg-yellow-600 transition duration-300"
    onClick={() => handleEditRole(row)}
  >
    Edit
  </button>
  <button
    className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600 transition duration-300"
    onClick={() => {
      setPermissionDialog(row);
      const assignedPerms = getAssignedPermissions(row.id);
      console.log('Assigned Permissions on Open:', assignedPerms); // Debug log
      if (roles.length > 0 && assignedPerms.length === 0 && row.permissions) {
        console.warn('Fallback to row.permissions:', row.permissions.map(p => p.id));
        setSelectedPermissions(row.permissions.map(p => p.id));
      } else {
        setSelectedPermissions(assignedPerms);
      }
    }}
  >
    <Pencil size={16} />
  </button>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  {error || 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {roleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center min-h-screen transition-all ease-in-out duration-300">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto transform scale-100 hover:scale-105 transition-all ease-in-out duration-300">
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
                  onClick={() => setRoleDialog(false)}
                >
                  Close
                </button>
              </div>
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {editRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center min-h-screen transition-all ease-in-out duration-300">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto transform scale-100 hover:scale-105 transition-all ease-in-out duration-300">
            <form onSubmit={handleSubmit}>
              {[
                { key: 'name', label: 'Name', value: editRole.name || '' },
                { key: 'display_name', label: 'Display Name', value: editRole.display_name || '' },
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
                    onChange={handleRoleChange}
                    className="w-full border p-2 pl-8 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-primary_color text-white p-1 rounded font-bold hover:bg-secondary_color hover:scale-105 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400 transition duration-300"
                  onClick={() => setEditRole(null)}
                >
                  Close
                </button>
              </div>
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}

{permissionDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center min-h-screen transition-all ease-in-out duration-300">
    <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-y-auto transform scale-100 hover:scale-105 transition-all ease-in-out duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Member Permission - {permissionDialog.display_name}</h3>
        <button
          onClick={() => {
            setPermissionDialog(null);
            setSelectedPermissions([]);
            setPermissionFilter('');
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filter by Permission Type</label>
        <input
          type="text"
          value={permissionFilter}
          onChange={(e) => setPermissionFilter(e.target.value)}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-600"
          placeholder="Enter type (e.g., Admin Activity, Member)"
        />
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Permissions</span>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPermissions.length === permissions.length}
              onChange={handleSelectAll}
              className="mr-2"
            />
            Select All
          </label>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left w-1/4">Section Category</th>
              <th className="border p-2 text-left">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {uniqueTypes.map((type) => {
              const typePermissions = filteredPermissions.filter((perm) => perm.type === type);
              if (typePermissions.length === 0) return null;

              const permissionGroups = [];
              for (let i = 0; i < typePermissions.length; i += 3) {
                permissionGroups.push(typePermissions.slice(i, i + 3));
              }

              return permissionGroups.map((group, groupIndex) => (
                <tr key={`${type}-${groupIndex}`} className="border">
                  {groupIndex === 0 ? (
                    <td
                      className="border p-2 align-top w-1/4"
                      rowSpan={permissionGroups.length}
                    >
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={typePermissions.every((perm) =>
                            selectedPermissions.includes(perm.id)
                          )}
                          onChange={(e) => {
                            const allIds = typePermissions.map((perm) => perm.id);
                            setSelectedPermissions((prev) =>
                              e.target.checked
                                ? [...new Set([...prev, ...allIds])]
                                : prev.filter((id) => !allIds.includes(id))
                            );
                          }}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    </td>
                  ) : null}
                  <td className="border p-2">
                    <div className="flex flex-wrap gap-4">
                      {group.map((perm) => (
                        <label key={perm.id} className="flex items-center w-1/3">
                          <input
                            type="checkbox"
                            id={`perm-${perm.id}`}
                            value={perm.id}
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={() => handlePermissionChange(perm.id)}
                            className="mr-2"
                          />
                          {perm.display_name}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="bg-primary_color text-black p-1 rounded font-bold hover:bg-secondary_color hover:scale-105 transition duration-300"
          onClick={handlePermissionSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Permissions'}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400 transition duration-300"
          onClick={() => {
            setPermissionDialog(null);
            setSelectedPermissions([]);
            setPermissionFilter('');
          }}
        >
          Close
        </button>
      </div>
      {error && <p className="text-red-600 text-center mt-2">{error}</p>}
    </div>
  </div>
)}
    </div>
  );
}