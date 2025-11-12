import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const getToken = () => localStorage.getItem('digihealth_jwt');
const setToken = (token) => localStorage.setItem('digihealth_jwt', token);
const clearToken = () => localStorage.removeItem('digihealth_jwt');

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (tokenOverride = null) => {
    const token = tokenOverride || getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      console.log('[AuthContext] Fetching user profile with token:', token.substring(0, 20) + '...');
      // Manually attach token to ensure it's used for this request
      const userProfile = await apiClient.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthContext] User profile fetched:', userProfile.data);
      setCurrentUser(userProfile.data);
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user profile:', error.response?.status, error.response?.data);
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

      // Support multiple possible response shapes for robustness:
      // - { accessToken, tokenType }
      // - { token }
      // - raw string token
      const { accessToken, token, tokenType } = response.data || {};
      const resolvedToken =
        accessToken ||
        token ||
        (typeof response.data === 'string' ? response.data : null);

      if (!resolvedToken) {
        throw new Error('Login response missing token');
      }

      // Persist JWT for apiClient to use as Authorization: Bearer <token>
      setToken(resolvedToken);
      
      console.log('[AuthContext] Token saved to localStorage:', resolvedToken.substring(0, 20) + '...');

      // After setting token, fetch the authenticated user's profile
      // Pass the token directly to avoid any localStorage timing issues
      await fetchUserProfile(resolvedToken);

      // Preserve original behavior for callers
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
