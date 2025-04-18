import React, { useState } from 'react';
import axios from 'axios';

const OperatorManagement = ({ activeOperators, inactiveOperators }) => {
  const [active, setActive] = useState(activeOperators || []);
  const [inactive, setInactive] = useState(inactiveOperators || []);

  const toggleStatus = async (operatorId, currentStatus) => {
    try {
      const response = await axios.post(`/admin/utility-operators/${operatorId}/toggle-status`);
      if (response.data.success) {
        // Update local state
        if (currentStatus === 1) {
          // Move from active to inactive
          const operator = active.find(op => op.id === operatorId);
          setActive(active.filter(op => op.id !== operatorId));
          setInactive([...inactive, { ...operator, status: 0 }]);
        } else {
          // Move from inactive to active
          const operator = inactive.find(op => op.id === operatorId);
          setInactive(inactive.filter(op => op.id !== operatorId));
          setActive([...active, { ...operator, status: 1 }]);
        }
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update operator status');
    }
  };

  const renderTable = (operators, title, isActive) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Display Name</th>
              <th className="py-2 px-4 border">View Bill</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {operators.length > 0 ? (
              operators.map(operator => (
                <tr key={operator.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{operator.id}</td>
                  <td className="py-2 px-4 border">{operator.name}</td>
                  <td className="py-2 px-4 border">{operator.category}</td>
                  <td className="py-2 px-4 border">{operator.displayname || 'N/A'}</td>
                  <td className="py-2 px-4 border">{operator.viewbill ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => toggleStatus(operator.id, operator.status)}
                      className={`py-1 px-3 rounded ${
                        operator.status === 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {operator.status === 1 ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 border text-center">
                  No {isActive ? 'active' : 'inactive'} operators found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Utility Operator Management</h1>
      {renderTable(active, 'Active Operators', true)}
      {renderTable(inactive, 'Inactive Operators', false)}
    </div>
  );
};

export default OperatorManagement;