import axios from 'axios';
import keycloak from '../keycloak';

// Backend URLs from environment variables
const PATIENT_API_URL = import.meta.env.VITE_PATIENT_API_URL || 'http://localhost:8080/api';
const MESSAGE_API_URL = import.meta.env.VITE_MESSAGE_API_URL || 'http://localhost:8081/api';

// Create axios instance for patient-journal-backend
export const patientApi = axios.create({
  baseURL: PATIENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for message-service
export const messageApi = axios.create({
  baseURL: MESSAGE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor to both instances
const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      if (keycloak.authenticated) {
        if (keycloak.isTokenExpired(5)) {
          try {
            await keycloak.updateToken(30);
          } catch (error) {
            console.error('Failed to refresh token:', error);
            keycloak.logout();
            return Promise.reject(error);
          }
        }
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        keycloak.logout();
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(patientApi);
addAuthInterceptor(messageApi);

export default patientApi;
