import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        apiService.setToken(token);
        const response = await apiService.getCurrentUser();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      apiService.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    const response = await apiService.register(userData);
    apiService.setToken(response.token);
    setUser(response.user);
    return response;
  };

  const signIn = async (credentials) => {
    const response = await apiService.login(credentials);
    apiService.setToken(response.token);
    setUser(response.user);
    return response;
  };

  const signOut = () => {
    localStorage.removeItem('token');
    apiService.setToken(null);
    setUser(null);
  };

  const resetPassword = async (email) => {
    try {
      const response = await apiService.resetPassword(email);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
