import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { getAllMembers } from '@/lib/apis';
import { getCommissions, updateCommissions } from '@/lib/apis';
import { services } from '@/data/services';

const SchemeManager = () => {
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showCommissionDropdown, setShowCommissionDropdown] = useState(false);
    const [selectedCommissionType, setSelectedCommissionType] = useState(null);
    const [commissions, setCommissions] = useState({
        cms_commissions: [],
        bank_commissions: [],
        gas_fastag_commissions: [],
        recharge_commissions: [],
        utility_commissions: [],
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllMembers();
                setRegisteredUsers(data.registered_users || []);
                setFilteredUsers(data.registered_users || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const filterUsers = (users, search, from, to, status) => {
        let filtered = [...users];

        if (search) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.created_at);
                return itemDate >= fromDate && itemDate <= toDate;
            });
        }

        if (status) {
            // Add status filtering logic if you have a status field
        }

        setFilteredUsers(filtered);
    };

    const handleSearch = () => {
        filterUsers(registeredUsers, searchValue, fromDate, toDate, statusFilter);
    };

    const handleReset = () => {
        setSearchValue('');
        setFromDate('');
        setToDate('');
        setStatusFilter('');
        filterUsers(registeredUsers, '', '', '', '');
    };

    const handleCommissionClick = async (userId) => {
        setSelectedUserId(userId);
        setShowCommissionDropdown(!showCommissionDropdown);
        setSelectedCommissionType(null);

        try {
            const data = await getCommissions(userId);
            setCommissions(data);
        } catch (error) {
            console.error('Failed to fetch commissions:', error);
            setCommissions({
                cms_commissions: [],
                bank_commissions: [],
                gas_fastag_commissions: [],
                recharge_commissions: [],
                utility_commissions: [],
            });
        }
    };

    const handleCommissionTypeSelect = (service) => {
        setSelectedCommissionType(service);
        setShowCommissionDropdown(false);
    };

    const handleCommissionChange = (commissionId, field, value) => {
        setCommissions((prev) => {
            const updatedCommissions = { ...prev };
            const commissionType = getCommissionType(selectedCommissionType.id);
            const commissionIndex = updatedCommissions[commissionType].findIndex(
                (item) => item.id === commissionId
            );

            if (commissionIndex !== -1) {
                updatedCommissions[commissionType][commissionIndex] = {
                    ...updatedCommissions[commissionType][commissionIndex],
                    [field]: value,
                };
            }

            return updatedCommissions;
        });
    };

    const handleSave = async () => {
        try {
            await updateCommissions(selectedUserId, commissions);
            alert('Commissions updated successfully!');
        } catch (error) {
            alert('Failed to update commissions: ' + error.message);
        }
    };

    const getCommissionType = (serviceId) => {
        switch (serviceId) {
            case 'recharge':
                return 'recharge_commissions';
            case 'CMS':
                return 'cms_commissions';
            case 'bus-booking':
                return 'bus_commissions';
            case 'dmt-bank-1':
            case 'dmt-bank-2':
                return 'bank_commissions';
            case 'utilities':
                return 'utility_commissions';
            default:
                return '';
        }
    };

    const renderCommissionDetails = () => {
        if (!selectedCommissionType || !selectedUserId) return null;

        const commissionType = getCommissionType(selectedCommissionType.id);
        const commissionData = commissions[commissionType] || [];

        if (!commissionData.length) {
            return <p className="mt-4 text-gray-500">No commission data available for this service. Please add commission data for this user.</p>;
        }

        if (selectedCommissionType.id === 'recharge') {
            return (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedCommissionType.title} Commissions</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Operator Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Server 1 Commission
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Server 2 Commission
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {commissionData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.operator_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            value={item.server_1_commission}
                                            onChange={(e) =>
                                                handleCommissionChange(
                                                    item.id,
                                                    'server_1_commission',
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded p-1 w-20"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            value={item.server_2_commission}
                                            onChange={(e) =>
                                                handleCommissionChange(
                                                    item.id,
                                                    'server_2_commission',
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded p-1 w-20"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            );
        }

        if (selectedCommissionType.id === 'CMS') {
            return (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedCommissionType.title} Commissions</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agent ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agent Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {commissionData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.Agent_ID}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.Agent_Name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            value={item.Commission}
                                            onChange={(e) =>
                                                handleCommissionChange(
                                                    item.id,
                                                    'Commission',
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded p-1 w-20"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            );
        }

        if (selectedCommissionType.id === 'dmt-bank-1' || selectedCommissionType.id === 'dmt-bank-2') {
            return (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedCommissionType.title} Commissions</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {commissionData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.transaction_amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            value={item.commission}
                                            onChange={(e) =>
                                                handleCommissionChange(
                                                    item.id,
                                                    'commission',
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded p-1 w-20"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            );
        }

        if (selectedCommissionType.id === 'utilities') {
            return (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedCommissionType.title} Commissions</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Operator Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {commissionData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.operator_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            value={item.commission}
                                            onChange={(e) =>
                                                handleCommissionChange(
                                                    item.id,
                                                    'commission',
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded p-1 w-20"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            );
        }

        return <p className="mt-4 text-gray-500">Commission data not available for this service.</p>;
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Home - Scheme Manager</h1>
            <div className="bg-gray-200 p-4 rounded-b-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search Value"
                            className="p-2 border rounded"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">Select Scheme Status</option>
                            <option value="active">Active</option>
                            <option value="deactive">Deactive</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSearch} className="p-2 bg-gray-600 text-white rounded">
                            <Search className="h-4 w-4" />
                        </button>
                        <button onClick={handleReset} className="p-2 bg-red-600 text-white rounded">
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Scheme Manager</h2>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        + Add New
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={true}
                                                    onChange={() => {}}
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                                            <button
                                                className="px-3 py-1 bg-gray-500 text-white rounded mr-2"
                                                onClick={() => {}}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
                                                onClick={() => {}}
                                            >
                                                View Commission
                                            </button>
                                            <div className="inline-block">
                                                <button
                                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                                    onClick={() => handleCommissionClick(user.id)}
                                                >
                                                    Commission
                                                </button>
                                                {selectedUserId === user.id && showCommissionDropdown && (
                                                    <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                                        {services.map((service) => (
                                                            <button
                                                                key={service.id}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                onClick={() => handleCommissionTypeSelect(service)}
                                                            >
                                                                {service.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No Data Available in Table
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                        Showing {filteredUsers.length} to 0 of {filteredUsers.length} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-gray-200 rounded">Previous</button>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
                        <button className="px-3 py-1 bg-gray-200 rounded">Next</button>
                        <select className="p-1 border rounded">
                            <option>Show 10</option>
                            <option>Show 25</option>
                            <option>Show 50</option>
                        </select>
                    </div>
                </div>

                {renderCommissionDetails()}
            </div>
        </div>
    );
};

export default SchemeManager;