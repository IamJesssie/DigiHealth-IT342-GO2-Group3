import axios from 'axios';

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const isLocalHost = host === 'localhost' || host === '127.0.0.1';
const envBase = process.env.REACT_APP_API_BASE_URL;
const envPointsToLocal = envBase && (envBase.includes('localhost') || envBase.includes('127.0.0.1'));
export const API_BASE_URL = (!envBase || (!isLocalHost && envPointsToLocal))
  ? `http://${host}:8080`
  : envBase;

// Create a preconfigured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('digihealth_jwt') || localStorage.getItem('adminToken');
      console.log('[API Client] ========== REQUEST INTERCEPTOR ==========');
      console.log('[API Client] Base URL:', config.baseURL || API_BASE_URL);
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
  const workDays = registrationData.workDays || [];
  const workHours = registrationData.workHours || {};
  const availability = {};
  workDays.forEach((day) => {
    const start = (workHours[day] && workHours[day].startTime) ? workHours[day].startTime : '09:00';
    const end = (workHours[day] && workHours[day].endTime) ? workHours[day].endTime : '17:00';
    availability[day] = `${start}-${end}`;
  });
  const payload = { ...registrationData, availability };
  delete payload.workHours;
  return apiClient.post('/api/auth/register', payload);
};

// Appointments helpers
export const updateAppointmentStatus = async (appointmentId, status) => {
  if (!appointmentId || !status) throw new Error('appointmentId and status are required');
  return apiClient.put(`/api/appointments/${appointmentId}/status`, { status });
};

export const createDoctorAppointment = async (payload) => {
  return apiClient.post('/api/doctors/me/appointments', payload);
};

export const updateDoctorAppointment = async (appointmentId, payload) => {
  return apiClient.put(`/api/doctors/me/appointments/${appointmentId}`, payload);
};

export const getDoctorPatients = async () => {
  return apiClient.get('/api/doctors/me/patients');
};

export const updateDoctorPatientDetails = async (patientId, payload) => {
  return apiClient.put(`/api/doctors/me/patients/${patientId}/details`, payload);
};

export const createMedicalNote = async (patientId, payload) => {
  return apiClient.post(`/api/doctors/me/patients/${patientId}/notes`, payload);
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const msg = typeof data === 'string' ? data : (data?.message || data?.error || 'Request failed');
      error.normalizedMessage = msg;
      error.statusCode = status;
    } catch {}
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (!error) return 'Request failed';
  return error.normalizedMessage || (error.response && (typeof error.response.data === 'string' ? error.response.data : (error.response.data?.message || error.response.data?.error))) || error.message || 'Request failed';
};
