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
      console.log('[API Client] ========== REQUEST INTERCEPTOR ==========');
      console.log('[API Client] Request URL:', config.url);
      console.log('[API Client] Request Method:', config.method);
      console.log('[API Client] Token in localStorage:', token ? 'YES (length=' + token.length + ')' : 'NO');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[API Client] Authorization header SET:', config.headers.Authorization.substring(0, 30) + '...');
      } else {
        console.warn('[API Client] NO TOKEN FOUND - Request will be anonymous');
      }
      console.log('[API Client] All headers:', JSON.stringify(config.headers, null, 2));
      console.log('[API Client] ===============================================');
    } catch (e) {
      console.error('[API Client] Error in request interceptor:', e);
    }
    return config;
  },
  (error) => {
    console.error('[API Client] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;

// Auth helpers

export const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  
  console.log('[Login] Response data:', response.data);
  
  // Expecting backend to return a JWT or structured response
  const token =
    response.data?.accessToken ||
    response.data?.token ||
    response.data; // fallback for plain-string token

  console.log('[Login] Extracted token:', token ? 'Token found' : 'NO TOKEN');

  if (!token) {
    throw new Error('Login response missing token');
  }

  return { token, raw: response.data };
};

export const registerDoctor = async (registrationData) => {
  // Aligns with backend AuthController.register using RegisterDto
  return apiClient.post('/api/auth/register', registrationData);
};

// Appointments helpers
export const updateAppointmentStatus = async (appointmentId, status) => {
  if (!appointmentId || !status) throw new Error('appointmentId and status are required');
  return apiClient.put(`/api/appointments/${appointmentId}/status`, { status });
};
