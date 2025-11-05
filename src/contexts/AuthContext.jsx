import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, setAuthToken } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await auth.getProfile();
      const userData = {
        id: profileData.id,
        email: profileData.email,
      };
      setUser(userData);
      setProfile(profileData);
    } catch (err) {
      console.error('Error loading profile:', err);
      localStorage.removeItem('authToken');
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, profileData) => {
    const result = await auth.signup(email, password, profileData.full_name, profileData.role, profileData);
    const userData = {
      id: result.user.id,
      email: result.user.email,
    };
    setAuthToken(result.token);
    setUser(userData);
    setProfile(result.user);
  };

  const signIn = async (email, password) => {
    const result = await auth.signin(email, password);
    const userData = {
      id: result.user.id,
      email: result.user.email,
    };
    setAuthToken(result.token);
    setUser(userData);
    await loadProfile();
  };

  const signOut = async () => {
    auth.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
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
