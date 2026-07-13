import axios from 'axios';
import { API_BASE_URL } from '../constants';

let currentUser = null;
let onUnauthorized = null;

export const setCurrentUser = (user) => {
  currentUser = user;
};

export const clearCurrentUser = () => {
  currentUser = null;
};

export const getCurrentUser = () => currentUser;

export const setOnUnauthorized = (handler) => {
  onUnauthorized = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (currentUser?.userId) {
    config.headers['X-User-Id'] = String(currentUser.userId);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;

    if (error.response?.status === 401) {
      clearCurrentUser();
      onUnauthorized?.();
      return Promise.reject(new Error(data?.message || 'Session expired. Please sign in again.'));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error(data?.message || 'You do not have permission for this action.'));
    }

    if (data && typeof data.success === 'boolean') {
      return data;
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Is the backend running?'));
    }

    if (!error.response) {
      return Promise.reject(
        new Error('Cannot reach the API. Start the backend at http://localhost:5000'),
      );
    }

    return Promise.reject(new Error(data?.message || error.message || 'Something went wrong.'));
  },
);

export default api;
