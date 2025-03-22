import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        user_type: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('/api/login', formData);
            alert(response.data.message);
            console.log('Logged in user:', response.data.user);
        } catch (error) {
            setError(error.response?.data?.error || 'An unexpected error occurred');
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">User Type</label>
                    <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    >
                        <option value="">Select User Type</option>
                        <option value="ADMIN">Admin</option>
                        <option value="API_PARTNER">API Partner</option>
                        <option value="REGISTERED_USER">Registered User</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}
        </div>
    );
};

export default LoginForm;