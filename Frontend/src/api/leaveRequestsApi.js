import api from './axios';

export const getLeaveRequests = () => api.get('/leaverequests');
export const getLeaveRequestById = (id) => api.get(`/leaverequests/${id}`);
export const createLeaveRequest = (data) => api.post('/leaverequests', data);
export const updateLeaveRequest = (id, data) => api.put(`/leaverequests/${id}`, data);
export const deleteLeaveRequest = (id) => api.delete(`/leaverequests/${id}`);

export const approveLeaveRequest = (id, reviewerUserId, row) =>
  updateLeaveRequest(id, { ...row, status: 'Approved', reviewedByUserId: reviewerUserId });

export const rejectLeaveRequest = (id, reviewerUserId, row) =>
  updateLeaveRequest(id, { ...row, status: 'Rejected', reviewedByUserId: reviewerUserId });
