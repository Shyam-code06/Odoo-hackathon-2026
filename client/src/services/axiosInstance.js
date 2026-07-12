import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

/**
 * Reusable Axios HTTP client configured for TransitOps SaaS
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor for injecting auth token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('transitops_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common error responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      // 401 Unauthorized: token expired or invalid
      if (response.status === 401) {
        localStorage.removeItem('transitops_auth_token');
        localStorage.removeItem('transitops_user');
        // Custom event so providers/contexts can react to auth failure
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
