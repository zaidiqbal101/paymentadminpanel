import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the authenticated user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'An unexpected error occurred';
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};