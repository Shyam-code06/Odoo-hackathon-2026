import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

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
    const { response, message } = error;
    if (response) {
      const { status, data } = response;
      const errorMessage = data?.error || data?.message || 'An unexpected error occurred.';
      
      switch (status) {
        case 400:
          toast.error(`Bad Request: ${errorMessage}`);
          break;
        case 401:
          toast.error(`Unauthorized: ${errorMessage}`);
          localStorage.removeItem('transitops_auth_token');
          localStorage.removeItem('transitops_user');
          // Custom event so providers/contexts can react to auth failure
          window.dispatchEvent(new Event('auth:unauthorized'));
          break;
        case 403:
          toast.error(`Forbidden: ${errorMessage}`);
          if (errorMessage === 'Invalid or expired token.') {
            localStorage.removeItem('transitops_auth_token');
            localStorage.removeItem('transitops_user');
            window.dispatchEvent(new Event('auth:unauthorized'));
          }
          break;
        case 404:
          toast.error(`Not Found: ${errorMessage}`);
          break;
        case 409:
          toast.error(`Conflict: ${errorMessage}`);
          break;
        case 422:
          toast.error(`Validation Error: ${errorMessage}`);
          break;
        case 500:
          toast.error(`Internal Server Error: ${errorMessage}`);
          break;
        default:
          toast.error(`Error (${status}): ${errorMessage}`);
      }
    } else {
      // Network or timeout errors
      if (message === 'Network Error') {
        toast.error('Network Error: Please check your internet connection.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request Timeout: The server is taking too long to respond.');
      } else {
        toast.error(`Network Error: ${message || 'Failed to connect to the server.'}`);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
