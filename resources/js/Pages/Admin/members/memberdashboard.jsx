import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, FileText } from 'lucide-react';
import { getRoles, getAllMembers, addMember, deleteMember } from '@/lib/apis';

const MemberDetails = () => {
    const [roles, setRoles] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [allData, setAllData] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [company, setCompany] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        role: '',
        name: '',
        email: '',
        company: '',
        pancard_number: '',
        aadhaar_number: '',
        mobile: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        otp_verifaction: 0,
    });

    useEffect(() => {
        const fetchRolesAndData = async () => {
            try {
                // Fetch roles dynamically
                const fetchedRoles = await getRoles();
                const roleNames = fetchedRoles.map(role => role.name);
                console.log('Fetched roles:', roleNames); // Debug log
                setRoles(roleNames);

                if (roleNames.length > 0) {
                    setActiveTab(roleNames[0]);
                    setFormData(prev => ({ ...prev, role: roleNames[0] }));
                }

                // Fetch all members
                const data = await getAllMembers();
                setAllData(data);

                if (roleNames.length > 0) {
                    const dataKey = `${roleNames[0]}s`;
                    filterData(roleNames[0], data[dataKey] || [], searchValue, fromDate, toDate, company);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data: ' + error.message);
            }
        };
        fetchRolesAndData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const dataKey = `${tab}s`;
        filterData(tab, allData[dataKey] || [], searchValue, fromDate, toDate, company);
    };

    const filterData = (tab, data, search, from, to, companyFilter) => {
        let filtered = [...(data || [])];

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

        if (companyFilter) {
            filtered = filtered.filter(item => item.company === companyFilter);
        }

        setFilteredData(filtered);
    };

    const handleSearch = () => {
        const dataKey = `${activeTab}s`;
        filterData(activeTab, allData[dataKey] || [], searchValue, fromDate, toDate, company);
    };

    const handleReset = () => {
        setSearchValue('');
        setFromDate('');
        setToDate('');
        setCompany('');
        const dataKey = `${activeTab}s`;
        filterData(activeTab, allData[dataKey] || [], '', '', '', '');
    };

    const handleExport = () => {
        const csv = [
            ['#', 'Name', 'Company Profile', 'Action'],
            ...filteredData.map((item, index) => [
                index + 1,
                `${item.name}\n${item.email}\n${item.created_at}`,
                item.company || 'N/A',
                '',
            ]),
            ['#', 'Name', 'Company Profile', 'Action'],
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `member_details_${activeTab.toLowerCase()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = async (memberId) => {
        if (window.confirm('Are you sure you want to deactivate this member?')) {
            try {
                await deleteMember(memberId);
                const updatedData = await getAllMembers();
                setAllData(updatedData);
                const dataKey = `${activeTab}s`;
                filterData(activeTab, updatedData[dataKey] || [], searchValue, fromDate, toDate, company);
                alert('Member deactivated successfully.');
            } catch (error) {
                setError('Failed to deactivate member: ' + error.message);
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setGeneratedPassword(null);

        console.log('Form Data being sent:', formData); // Debug log

        try {
            const response = await addMember(formData);
            const updatedData = await getAllMembers();
            setAllData(updatedData);
            const dataKey = `${activeTab}s`;
            filterData(activeTab, updatedData[dataKey] || [], searchValue, fromDate, toDate, company);

            if (response.generated_password) {
                setGeneratedPassword(response.generated_password);
            }

            setFormData({
                role: roles[0] || '',
                name: '',
                email: '',
                company: '',
                pancard_number: '',
                aadhaar_number: '',
                mobile: '',
                address: '',
                state: '',
                city: '',
                pincode: '',
                otp_verifaction: 0,
            });
            setShowForm(false);
            alert('User added successfully.');
        } catch (error) {
            setError('Failed to add user: ' + (error.response?.data?.error || error.message));
        }
    };

    if (showForm) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Home - Create User</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Member Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select Company</option>
                                <option value="Banking NIKAT-By">Banking NIKAT-By</option>
                            </select>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Business Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pancard Number</label>
                            <input
                                type="text"
                                name="pancard_number"
                                value={formData.pancard_number}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhaarcard Number</label>
                            <input
                                type="text"
                                name="aadhaar_number"
                                value={formData.aadhaar_number}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleFormSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>

                    {generatedPassword && (
                        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                            <p><strong>Generated Password:</strong> {generatedPassword}</p>
                            <p>Please save this password securely. It will be needed for login.</p>
                            <p>An email with the credentials has been sent to the user.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Home - Member Details</h1>
            <div className="bg-gray-200 p-2 rounded-t-lg">
                {roles.map(role => (
                    <button
                        key={role}
                        onClick={() => handleTabChange(role)}
                        className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === role ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
            </div>

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
                        <input
                            type="text"
                            placeholder="Agent ID / Parent ID"
                            className="p-2 border rounded"
                        />
                        <select className="p-2 border rounded">
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="deactive">Deactive</option>
                        </select>
                        <select
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">Select Company</option>
                            <option value="Banking NIKAT-By">Banking NIKAT-By</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSearch} className="p-2 bg-gray-600 text-white rounded">
                            <Search className="h-4 w-4" />
                        </button>
                        <button onClick={handleReset} className="p-2 bg-red-600 text-white rounded">
                            <RotateCcw className="h-4 w-4" />
                        </button>
                        <button onClick={handleExport} className="p-2 bg-blue-600 text-white rounded">
                            <FileText className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        + Add User
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
                                    Company Profile
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.name}
                                            <br />
                                            {item.email}
                                            <br />
                                            {item.created_at}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.company || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <select
                                                className="border border-gray-300 rounded-md p-1"
                                                onChange={(e) => {
                                                    if (e.target.value === 'action') return;
                                                    if (e.target.value === 'delete' && activeTab !== 'deactivated') {
                                                        handleDelete(item.id);
                                                    }
                                                }}
                                            >
                                                <option value="action">Action</option>
                                                {activeTab !== 'deactivated' && <option value="delete">Deactivate</option>}
                                                <option value="reports">Reports</option>
                                            </select>
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
                        Showing {filteredData.length} to 0 of {filteredData.length} entries
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
            </div>
        </div>
    );
};

export default MemberDetails;