import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((requestConfig) => {
  const walletAddress = localStorage.getItem('walletAddress');
  if (walletAddress) {
    requestConfig.headers.Authorization = walletAddress;
  }
  return requestConfig;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server');
    } else {
      // Error setting up request
      throw new Error(error.message);
    }
  }
);

export default api;

