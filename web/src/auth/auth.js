const TOKEN_KEY = 'digihealth_jwt';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Fail silently if storage not available
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Fail silently if storage not available
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};