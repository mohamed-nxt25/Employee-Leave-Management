import api from './axios';

export const checkApiHealth = () => api.get('/status');
