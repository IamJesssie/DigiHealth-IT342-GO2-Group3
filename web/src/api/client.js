import axios from 'axios';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create a preconfigured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('digihealth_jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Fail silently if storage not available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

// Auth helpers

export const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  // Expecting backend to return a JWT or structured response
  const token =
    response.data?.token ||
    response.data?.accessToken ||
    response.data; // fallback for plain-string token

  if (!token) {
    throw new Error('Login response missing token');
  }

  return { token, raw: response.data };
};

export const registerDoctor = async (registrationData) => {
  // Aligns with backend AuthController.register using RegisterDto
  return apiClient.post('/api/auth/register', registrationData);
};