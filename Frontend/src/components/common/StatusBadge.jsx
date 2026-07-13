import { LEAVE_STATUS } from '../../constants';

const pillClass = {
  [LEAVE_STATUS.PENDING]: 'status-pill-pending',
  [LEAVE_STATUS.APPROVED]: 'status-pill-approved',
  [LEAVE_STATUS.REJECTED]: 'status-pill-rejected',
  Admin: 'status-pill-admin',
  HR: 'status-pill-hr',
  Employee: 'status-pill-employee',
  Active: 'status-pill-active',
  Inactive: 'status-pill-inactive',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-pill ${pillClass[status] || 'status-pill-employee'}`}>
      {status}
    </span>
  );
}
