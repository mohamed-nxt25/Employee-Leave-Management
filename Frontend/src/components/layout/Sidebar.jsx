import { NavLink } from 'react-router-dom';
import {
  LuLayoutDashboard, LuUsers, LuBuilding2, LuUserRound,
  LuTags, LuClipboardList, LuKeyRound, LuBriefcase,
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import {
  canManageUsers, canManageDepartments, canManageEmployees, canManageLeaveTypes,
} from '../../roles';

const linkClass = ({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`;

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink to={to} className={linkClass} onClick={onClick}>
      <span className="nav-icon">
        <Icon size={17} />
      </span>
      <span className="nav-label">{label}</span>
    </NavLink>
  );
}

function NavSection({ title, children }) {
  return (
    <div className="nav-section">
      {title && <span className="nav-section-title">{title}</span>}
      <div className="nav-section-links">{children}</div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const role = user?.role;

  const handleNav = () => onClose?.();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <LuBriefcase size={20} />
        </div>
        <div className="brand-text">
          <p className="brand-title mb-0">Employee Portal</p>
          <span className="brand-sub">Management System</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavSection title="Menu">
          <NavItem to="/dashboard" icon={LuLayoutDashboard} label="Dashboard" onClick={handleNav} />
        </NavSection>

        {(canManageUsers(role) || canManageDepartments(role) || canManageEmployees(role)) && (
          <NavSection title="People">
            {canManageUsers(role) && (
              <NavItem to="/users" icon={LuUsers} label="Users" onClick={handleNav} />
            )}
            {canManageDepartments(role) && (
              <NavItem to="/departments" icon={LuBuilding2} label="Departments" onClick={handleNav} />
            )}
            {canManageEmployees(role) && (
              <NavItem to="/employees" icon={LuUserRound} label="Employees" onClick={handleNav} />
            )}
          </NavSection>
        )}

        <NavSection title="Leave">
          {canManageLeaveTypes(role) && (
            <NavItem to="/leave-types" icon={LuTags} label="Leave Types" onClick={handleNav} />
          )}
          <NavItem to="/leave-requests" icon={LuClipboardList} label="Leave Requests" onClick={handleNav} />
        </NavSection>

        <NavSection title="Account">
          <NavItem to="/change-password" icon={LuKeyRound} label="Password" onClick={handleNav} />
        </NavSection>
      </nav>
    </aside>
  );
}
