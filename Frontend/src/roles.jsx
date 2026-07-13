import { ROLES } from './constants';

// Who can see which menu items (matches backend role names)
export const canManageUsers = (role) => role === ROLES.ADMIN;
export const canManageDepartments = (role) => role === ROLES.ADMIN || role === ROLES.HR;
export const canManageEmployees = (role) => role === ROLES.ADMIN || role === ROLES.HR;
export const canManageLeaveTypes = (role) => role === ROLES.ADMIN || role === ROLES.HR;
export const canReviewLeave = (role) => role === ROLES.ADMIN || role === ROLES.HR;
export const canViewAllLeaveRequests = (role) => role === ROLES.ADMIN || role === ROLES.HR;
