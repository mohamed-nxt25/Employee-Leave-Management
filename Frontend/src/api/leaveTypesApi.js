import api from './axios';

export const getLeaveTypes = () => api.get('/leavetypes');
export const getLeaveTypeById = (id) => api.get(`/leavetypes/${id}`);
export const createLeaveType = (data) => api.post('/leavetypes', data);
export const updateLeaveType = (id, data) => api.put(`/leavetypes/${id}`, data);
export const deleteLeaveType = (id) => api.delete(`/leavetypes/${id}`);
