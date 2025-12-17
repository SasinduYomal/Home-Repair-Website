import React, { createContext, useContext, useEffect, useState } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthProvider - Token found:', !!token);
    if (token) {
      // Try to fetch user profile to verify token validity
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await userAPI.getProfile();
      console.log('AuthProvider - User loaded:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('AuthProvider - Error loading user:', error);
      // If token is invalid, remove it
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log('AuthProvider - Login called with:', userData);
    // Save token to localStorage if it exists
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    console.log('AuthProvider - Logout called');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};