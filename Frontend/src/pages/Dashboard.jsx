import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import {
  LuUsers, LuBuilding2, LuUserRound, LuCalendarDays, LuClock,
  LuArrowRight, LuPlus, LuClipboardList,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { getUsers } from '../api/usersApi';
import { getDepartments } from '../api/departmentsApi';
import { getEmployees } from '../api/employeesApi';
import { getLeaveTypes } from '../api/leaveTypesApi';
import { getLeaveRequests } from '../api/leaveRequestsApi';
import { canViewAllLeaveRequests, canReviewLeave } from '../roles';
import { LEAVE_STATUS } from '../constants';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', emoji: '🌤️' };
  if (hour < 17) return { text: 'Good afternoon', emoji: '☀️' };
  return { text: 'Good evening', emoji: '🌙' };
};

function StatCard({ icon: Icon, label, value, iconClass, to }) {
  return (
    <Card className="stat-card border-0 h-100">
      <div className="stat-card-inner d-flex flex-column h-100">
        <div className={`stat-icon ${iconClass}`}><Icon size={20} /></div>
        <p className="stat-label mb-0">{label}</p>
        <h2 className="stat-value mb-auto">{value}</h2>
        {to && (
          <Link to={to} className="stat-link">
            View <LuArrowRight size={14} />
          </Link>
        )}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ users: 0, departments: 0, employees: 0, leaveTypes: 0, pending: 0, mine: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const greeting = getGreeting();
  const isManager = canViewAllLeaveRequests(user?.role);

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const fetches = [getLeaveRequests()];
        if (isManager) fetches.push(getUsers(), getDepartments(), getEmployees(), getLeaveTypes());
        const results = await Promise.all(fetches);
        const lrRes = results[0];
        if (!lrRes.success) { setError(lrRes.message); return; }

        const requests = lrRes.data || [];
        const visible = isManager ? requests : requests.filter((r) => r.employeeId === user?.employeeId);
        setRecentRequests(visible.slice(0, 5));
        setStats({
          users: isManager && results[1]?.success ? results[1].data?.length || 0 : 0,
          departments: isManager && results[2]?.success ? results[2].data?.length || 0 : 0,
          employees: isManager && results[3]?.success ? results[3].data?.length || 0 : 0,
          leaveTypes: isManager && results[4]?.success ? results[4].data?.length || 0 : 0,
          pending: requests.filter((r) => r.status === LEAVE_STATUS.PENDING).length,
          mine: requests.filter((r) => r.employeeId === user?.employeeId).length,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.employeeId, isManager]);

  const recentColumns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'leaveTypeName', label: 'Type' },
    { key: 'startDate', label: 'From' },
    { key: 'totalDays', label: 'Days' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div>
      <div className="welcome-banner">
        <div>
          <span className="welcome-badge">{user?.role}</span>
          <h2 className="welcome-title mb-1">
            <span className="welcome-emoji">{greeting.emoji}</span>
            {greeting.text}, {user?.username}!
          </h2>
          <p className="welcome-sub mb-0">
            {isManager
              ? 'Here\'s a quick look at your team\'s leave activity.'
              : 'Need time off? Apply for leave or check your requests below.'}
          </p>
        </div>
        <div className="welcome-actions">
          <Button as={Link} to="/leave-requests/new" className="btn-primary-custom btn-icon">
            <LuPlus size={18} /> Apply Leave
          </Button>
          {canReviewLeave(user?.role) && (
            <Button as={Link} to="/leave-requests" className="btn-soft btn-icon">
              <LuClipboardList size={18} /> Review
            </Button>
          )}
        </div>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <div className="stats-grid">
        {isManager ? (
          <>
            <StatCard icon={LuUsers} label="Users" value={stats.users} iconClass="stat-icon-primary" to="/users" />
            <StatCard icon={LuBuilding2} label="Departments" value={stats.departments} iconClass="stat-icon-violet" to="/departments" />
            <StatCard icon={LuUserRound} label="Employees" value={stats.employees} iconClass="stat-icon-teal" to="/employees" />
            <StatCard icon={LuCalendarDays} label="Leave Types" value={stats.leaveTypes} iconClass="stat-icon-amber" to="/leave-types" />
            <StatCard icon={LuClock} label="Pending" value={stats.pending} iconClass="stat-icon-rose" to="/leave-requests" />
          </>
        ) : (
          <>
            <StatCard icon={LuClipboardList} label="My Requests" value={stats.mine} iconClass="stat-icon-primary" to="/leave-requests" />
            <StatCard icon={LuClock} label="Pending" value={stats.pending} iconClass="stat-icon-amber" to="/leave-requests" />
          </>
        )}
      </div>

      <Card className="content-card border-0">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h5 className="section-title mb-1">Recent Leave Requests</h5>
              <p className="section-sub mb-0">Latest updates</p>
            </div>
            <Button as={Link} to="/leave-requests" className="btn-soft btn-icon" size="sm">
              View all <LuArrowRight size={14} />
            </Button>
          </div>
          <DataTable
            columns={recentColumns}
            data={recentRequests.map((r) => ({ ...r, _key: r.leaveRequestId }))}
            emptyMessage="No leave requests yet — you're all caught up!"
            emptyAction={
              <Button as={Link} to="/leave-requests/new" size="sm" className="btn-primary-custom">
                Apply for leave
              </Button>
            }
          />
        </Card.Body>
      </Card>
    </div>
  );
}
