import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';
import { LuCalendar, LuChevronDown, LuLogOut, LuMenu } from 'react-icons/lu';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const todayFull = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });
  const todayShort = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="btn-menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <LuMenu size={20} />
        </button>
        <div className="topbar-date">
          <LuCalendar size={16} />
          <span className="topbar-date-full">{todayFull}</span>
          <span className="topbar-date-short">{todayShort}</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-user-menu" ref={menuRef}>
          <button
            type="button"
            className="topbar-user"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <div className="topbar-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div className="topbar-user-info">
              <span className="topbar-name">{user?.username}</span>
              <StatusBadge status={user?.role} />
            </div>
            <LuChevronDown size={16} className={`topbar-caret ${menuOpen ? 'open' : ''}`} />
          </button>

          {menuOpen && (
            <div className="topbar-dropdown">
              <div className="topbar-dropdown-header">
                <span className="topbar-dropdown-name">{user?.username}</span>
                <span className="topbar-dropdown-role">{user?.role}</span>
              </div>
              <button type="button" className="topbar-dropdown-item" onClick={handleLogout}>
                <LuLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
