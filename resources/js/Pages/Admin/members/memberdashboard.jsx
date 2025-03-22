import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, FileText } from 'lucide-react';
import { getAllMembers, addMember, deleteMember } from '@/lib/apis';

const MemberDetails = () => {
    const [activeTab, setActiveTab] = useState('ADMIN');
    const [allData, setAllData] = useState({
        admins: [],
        api_partners: [],
        registered_users: [],
        deactivated_users: [],
    });
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [company, setCompany] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState(null); // State for generated password
    const [error, setError] = useState(null); // State for errors

    // Single form state for all user types
    const [formData, setFormData] = useState({
        user_type: 'ADMIN',
        name: '',
        email: '',
        company: '',
        parent: '',
        shop_name: '',
        pancard_number: '',
        aadhaar_number: '',
        mobile: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        api_key: '',
        deactivation_reason: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllMembers();
                setAllData(data);
                filterData('ADMIN', data.admins, searchValue, fromDate, toDate, company);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch members: ' + error.message);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData(prev => ({ ...prev, user_type: tab }));
        let data;
        if (tab === 'ADMIN') data = allData.admins;
        else if (tab === 'API_PARTNER') data = allData.api_partners;
        else if (tab === 'REGISTERED_USER') data = allData.registered_users;
        else if (tab === 'DEACTIVATED_USER') data = allData.deactivated_users;
        filterData(tab, data, searchValue, fromDate, toDate, company);
    };

    const filterData = (tab, data, search, from, to, companyFilter) => {
        let filtered = [...data];

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
        let data;
        if (activeTab === 'ADMIN') data = allData.admins;
        else if (activeTab === 'API_PARTNER') data = allData.api_partners;
        else if (activeTab === 'REGISTERED_USER') data = allData.registered_users;
        else if (activeTab === 'DEACTIVATED_USER') data = allData.deactivated_users;
        filterData(activeTab, data, searchValue, fromDate, toDate, company);
    };

    const handleReset = () => {
        setSearchValue('');
        setFromDate('');
        setToDate('');
        setCompany('');
        let data;
        if (activeTab === 'ADMIN') data = allData.admins;
        else if (activeTab === 'API_PARTNER') data = allData.api_partners;
        else if (activeTab === 'REGISTERED_USER') data = allData.registered_users;
        else if (activeTab === 'DEACTIVATED_USER') data = allData.deactivated_users;
        filterData(activeTab, data, '', '', '', '');
    };

    const handleExport = () => {
        const csv = [
            ['#', 'Name', 'Parent Details', 'Company Profile', 'Wallet Details', 'Action'],
            ...filteredData.map((item, index) => [
                index + 1,
                `${item.name}\n${item.email}\n${item.created_at}`,
                item.parent || 'N/A',
                item.company || 'N/A',
                `Main Wallet: ₹${item.main_wallet || 0}\nCollection Wallet: ₹${item.collection_wallet || 0}\nOR Wallet: ₹${item.or_wallet || 0}\nRR Wallet: ₹${item.rr_wallet || 0}\nLocked Amt: ₹${item.locked_amount || 0}`,
                '',
            ]),
            ['#', 'Name', 'Parent Details', 'Company Profile', 'Wallet Details', 'Action'],
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
                await deleteMember(memberId, activeTab);
                const updatedData = await getAllMembers();
                setAllData(updatedData);
                let data;
                if (activeTab === 'ADMIN') data = updatedData.admins;
                else if (activeTab === 'API_PARTNER') data = updatedData.api_partners;
                else if (activeTab === 'REGISTERED_USER') data = updatedData.registered_users;
                else if (activeTab === 'DEACTIVATED_USER') data = updatedData.deactivated_users;
                filterData(activeTab, data, searchValue, fromDate, toDate, company);
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

        try {
            const response = await addMember(formData);
            const updatedData = await getAllMembers();
            setAllData(updatedData);
            let data;
            if (activeTab === 'ADMIN') data = updatedData.admins;
            else if (activeTab === 'API_PARTNER') data = updatedData.api_partners;
            else if (activeTab === 'REGISTERED_USER') data = updatedData.registered_users;
            else if (activeTab === 'DEACTIVATED_USER') data = updatedData.deactivated_users;
            filterData(activeTab, data, searchValue, fromDate, toDate, company);

            // Check if a password was generated and display it
            if (response.data.generated_password) {
                setGeneratedPassword(response.data.generated_password);
            }

            setFormData({
                user_type: activeTab,
                name: '',
                email: '',
                company: '',
                parent: '',
                shop_name: '',
                pancard_number: '',
                aadhaar_number: '',
                mobile: '',
                address: '',
                state: '',
                city: '',
                pincode: '',
                api_key: '',
                deactivation_reason: '',
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
                <h1 className="text-2xl font-bold mb-4">Home - Create {activeTab.replace('_', ' ')}</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Member Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parent</label>
                            <input
                                type="text"
                                name="parent"
                                value={formData.parent}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Business Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                            <input
                                type="text"
                                name="shop_name"
                                value={formData.shop_name}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Value"
                            />
                        </div>
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

                    {activeTab === 'API_PARTNER' && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">API Information</h2>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                                    <input
                                        type="text"
                                        name="api_key"
                                        value={formData.api_key}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Value"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'DEACTIVATED_USER' && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">Deactivation Information</h2>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deactivation Reason</label>
                                    <textarea
                                        name="deactivation_reason"
                                        value={formData.deactivation_reason}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Reason"
                                    />
                                </div>
                            </div>
                        </>
                    )}

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

                    {/* Display the generated password if it exists */}
                    {generatedPassword && (
                        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                            <p><strong>Generated Password:</strong> {generatedPassword}</p>
                            <p>Please save this password securely. It will be needed for login.</p>
                            <p>An email with the credentials has been sent to the user.</p>
                        </div>
                    )}

                    {/* Display error if it exists */}
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
                <button
                    onClick={() => handleTabChange('ADMIN')}
                    className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'ADMIN' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                >
                    Admin
                </button>
                <button
                    onClick={() => handleTabChange('API_PARTNER')}
                    className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'API_PARTNER' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                >
                    API Partner
                </button>
                <button
                    onClick={() => handleTabChange('REGISTERED_USER')}
                    className={`px-4 py-2 mr-2 rounded-t-lg ${activeTab === 'REGISTERED_USER' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                >
                    Registered User
                </button>
                <button
                    onClick={() => handleTabChange('DEACTIVATED_USER')}
                    className={`px-4 py-2 rounded-t-lg ${activeTab === 'DEACTIVATED_USER' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                >
                    Deactivated User
                </button>
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
                    <h2 className="text-lg font-semibold">{activeTab.replace('_', ' ')} List</h2>
                    <button
                        onClick={() => setShowForm(true)}
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
                                    Parent Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company Profile
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Wallet Details
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
                                            {item.parent || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.company || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Main Wallet: ₹{item.main_wallet || 0}
                                            <br />
                                            Collection Wallet: ₹{item.collection_wallet || 0}
                                            <br />
                                            OR Wallet: ₹{item.or_wallet || 0}
                                            <br />
                                            RR Wallet: ₹{item.rr_wallet || 0}
                                            <br />
                                            Locked Amt: ₹{item.locked_amount || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <select
                                                className="border border-gray-300 rounded-md p-1"
                                                onChange={(e) => {
                                                    if (e.target.value === 'action') return;
                                                    if (e.target.value === 'delete' && (activeTab === 'ADMIN' || activeTab === 'API_PARTNER' || activeTab === 'REGISTERED_USER')) {
                                                        handleDelete(item.id);
                                                    }
                                                }}
                                            >
                                                <option value="action">Action</option>
                                                {(activeTab === 'ADMIN' || activeTab === 'API_PARTNER' || activeTab === 'REGISTERED_USER') && <option value="delete">Deactivate</option>}
                                                <option value="reports">Reports</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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