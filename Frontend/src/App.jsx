import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';
import DepartmentList from './pages/departments/DepartmentList';
import DepartmentForm from './pages/departments/DepartmentForm';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import LeaveTypeList from './pages/leaveTypes/LeaveTypeList';
import LeaveTypeForm from './pages/leaveTypes/LeaveTypeForm';
import LeaveRequestList from './pages/leaveRequests/LeaveRequestList';
import LeaveRequestForm from './pages/leaveRequests/LeaveRequestForm';
import { ROLES } from './constants';

function PublicOnly({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <LoadingSpinner message="Checking session..." />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><UserList /></ProtectedRoute>} />
        <Route path="/users/new" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><UserForm /></ProtectedRoute>} />
        <Route path="/users/:id/edit" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><UserForm /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><DepartmentList /></ProtectedRoute>} />
        <Route path="/departments/new" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><DepartmentForm /></ProtectedRoute>} />
        <Route path="/departments/:id/edit" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><DepartmentForm /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><EmployeeList /></ProtectedRoute>} />
        <Route path="/employees/new" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><EmployeeForm /></ProtectedRoute>} />
        <Route path="/employees/:id/edit" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><EmployeeForm /></ProtectedRoute>} />
        <Route path="/leave-types" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><LeaveTypeList /></ProtectedRoute>} />
        <Route path="/leave-types/new" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><LeaveTypeForm /></ProtectedRoute>} />
        <Route path="/leave-types/:id/edit" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><LeaveTypeForm /></ProtectedRoute>} />
        <Route path="/leave-requests" element={<LeaveRequestList />} />
        <Route path="/leave-requests/new" element={<LeaveRequestForm />} />
        <Route path="/leave-requests/:id/edit" element={<LeaveRequestForm />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
