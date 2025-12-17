import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create axios instance for admin auth
const adminAPI = axios.create({
  baseURL: '/api', // Use relative path since we're using Vite proxy
});

// Request interceptor to add auth token to headers
adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Try to fetch user profile to verify token validity and admin status
      loadAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAdmin = async () => {
    try {
      const response = await adminAPI.get('/users/profile');
      // Check if user is admin
      if (response.data.isAdmin) {
        setAdmin(response.data);
      } else {
        // If not admin, remove token and redirect to login
        localStorage.removeItem('token');
        setAdmin(null);
      }
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem('token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await adminAPI.post('/auth/login', { email, password });
      // Check if user is admin
      if (response.data.isAdmin) {
        localStorage.setItem('token', response.data.token);
        setAdmin(response.data);
        return { success: true };
      } else {
        return { success: false, message: 'Access denied. Admin privileges required.' };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  const value = {
    admin,
    login,
    logout,
    loading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;