import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider — Global Identity Vector Synchronization.
 * Implements Metascale RBAC for Personnel (Doctor/Admin) and Patient tiers.
 * Optimized for React 19 and Vite Production Build.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial identity handshake
    const initializeAuth = async () => {
      await checkUser();
    };
    initializeAuth();
  }, [checkUser]);

  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data?.data) {
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.data) {
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};
