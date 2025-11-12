import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const getToken = () => localStorage.getItem('digihealth_jwt');
const setToken = (token) => localStorage.setItem('digihealth_jwt', token);
const clearToken = () => localStorage.removeItem('digihealth_jwt');

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Assuming your API client sets the auth header automatically
      const userProfile = await apiClient.get('/api/user/profile');
      setCurrentUser(userProfile.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, clear it
      clearToken();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token } = response.data;
      setToken(token);
      // After setting token, fetch profile
      await fetchUserProfile();
      return response;
    } catch (error) {
      // Re-throw the error so the login component can handle it
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
    // The redirect will be handled in the component to ensure clean state management
  };

  const authValue = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
