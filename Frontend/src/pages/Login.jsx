import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import {
  LuLock, LuUser, LuBriefcase, LuEye, LuEyeOff,
  LuCalendarDays, LuShield, LuLayoutDashboard,
} from 'react-icons/lu';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';
import ApiStatus from '../components/common/ApiStatus';
import { APP_NAME } from '../constants';

const FEATURES = [
  { icon: LuCalendarDays, text: 'Apply & track leave requests' },
  { icon: LuShield, text: 'Secure role-based access' },
  { icon: LuLayoutDashboard, text: 'Real-time team dashboard' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: saveUser } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      if (!res.success) { setError(res.message); return; }
      saveUser(res.data);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page-enter">
      {/* Left showcase panel */}
      <div className="login-showcase">
        <div className="login-showcase-inner">
          <div className="login-showcase-brand">
            <div className="login-showcase-icon">
              <LuBriefcase size={26} />
            </div>
            <div>
              <h2 className="login-showcase-title">{APP_NAME}</h2>
              <p className="login-showcase-tagline">Streamline leave management for your entire organization</p>
            </div>
          </div>

          <ul className="login-feature-list">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="login-feature-item">
                <span className="login-feature-icon"><Icon size={18} /></span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="login-showcase-glow login-showcase-glow-1" />
        <div className="login-showcase-glow login-showcase-glow-2" />
      </div>

      {/* Right form panel */}
      <div className="login-panel">
        <div className="login-box">
          <div className="login-top">
            <div className="login-brand-icon"><LuBriefcase size={26} /></div>
            <h1 className="login-brand-title">Welcome back</h1>
            <p className="login-form-sub mb-0">Sign in to your account to continue</p>
          </div>

          <AlertMessage type="danger" message={error} onClose={() => setError('')} />

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Username</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><LuUser size={18} /></InputGroup.Text>
                <Form.Control
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">Password</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><LuLock size={18} /></InputGroup.Text>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="link"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button type="submit" className="w-100 btn-primary-custom btn-lg-login" disabled={loading}>
              {loading ? <><Spinner size="sm" className="me-2" /> Signing in...</> : 'Sign In'}
            </Button>
          </Form>

          <div className="login-api-status">
            <ApiStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
