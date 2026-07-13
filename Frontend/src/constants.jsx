// App-wide settings — change these in one place
export const APP_NAME = 'Employee Leave Management System';
export const FRONTEND_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

export const ROLES = {
  ADMIN: 'Admin',
  HR: 'HR',
  EMPLOYEE: 'Employee',
};

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// In dev, use /api so Vite proxies to the backend (keeps cookies same-origin).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
