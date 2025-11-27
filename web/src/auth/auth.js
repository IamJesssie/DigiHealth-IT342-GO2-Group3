import React, { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export const getToken = () => localStorage.getItem("digihealth_jwt");
const setToken = (token) => localStorage.setItem("digihealth_jwt", token);
const clearToken = () => localStorage.removeItem("digihealth_jwt");

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
      console.log(
        "[AuthContext] Fetching user profile with token:",
        token.substring(0, 20) + "..."
      );
      // Manually attach token to ensure it's used for this request
      const userProfile = await apiClient.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("[AuthContext] User profile fetched:", userProfile.data);
      setCurrentUser(userProfile.data);
    } catch (error) {
      console.error(
        "[AuthContext] Failed to fetch user profile:",
        error.response?.status,
        error.response?.data
      );
      // If token is invalid, clear it
      clearToken();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem("user");
    const token = getToken();

    console.log("[AuthContext] Initialization - storedUser:", storedUser);
    console.log("[AuthContext] Initialization - token exists:", !!token);

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log(
          "[AuthContext] User restored from localStorage:",
          parsedUser
        );
      } catch (error) {
        console.error("[AuthContext] Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }

    // Only fetch profile if we don't have user data but have a token
    if (!storedUser && token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("[AuthContext.login] Starting login for email:", email);
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      console.log(
        "[AuthContext.login] Login response received:",
        response.status
      );
      console.log(
        "[AuthContext.login] Response data keys:",
        Object.keys(response.data)
      );
      console.log(
        "[AuthContext.login] Response data:",
        JSON.stringify(response.data, null, 2)
      );

      // Extract token and user data from response
      const { accessToken, user } = response.data;

      if (!accessToken) {
        console.error(
          "[AuthContext.login] ERROR: Login response missing accessToken"
        );
        console.error("[AuthContext.login] Response data:", response.data);
        throw new Error("Login response missing token");
      }

      // Persist JWT for apiClient to use as Authorization: Bearer <token>
      setToken(accessToken);

      // Store user data in localStorage and state
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        console.log("[AuthContext.login] Token and user saved successfully");
      } else {
        console.warn(
          "[AuthContext.login] User data missing from response, token saved only"
        );
      }

      console.log(
        "[AuthContext.login] Token saved to localStorage:",
        accessToken.substring(0, 20) + "..."
      );
      console.log("[AuthContext.login] User data saved:", user);

      // Return the response for callers
      return response;
    } catch (error) {
      console.error("[AuthContext.login] Login failed with error:", error);
      console.error(
        "[AuthContext.login] Error response:",
        error.response?.data
      );
      console.error(
        "[AuthContext.login] Error status:",
        error.response?.status
      );
      // Re-throw the error so the login component can handle it
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put("/api/users/me", profileData);
      // Update local state with new data
      setCurrentUser({ ...currentUser, ...response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("user");
    setCurrentUser(null);
    // The redirect will be handled in the component to ensure clean state management
  };

  const authValue = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
