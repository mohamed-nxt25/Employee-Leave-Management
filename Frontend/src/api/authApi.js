import api from './axios';

export const login = (credentials) => api.post('/login', credentials);

export const getMe = () => api.get('/me');

export const logout = () => api.post('/logout');

export const changePassword = (passwords) => api.post('/change-password', passwords);
