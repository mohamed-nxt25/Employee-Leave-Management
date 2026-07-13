import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { clearCurrentUser, setCurrentUser, setOnUnauthorized } from '../api/axios';
import { getMe, logout as logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

const normalizeUser = (data) => ({
  userId: data.userId ?? data.UserId,
  username: data.username ?? data.Username ?? '',
  role: data.role ?? data.Role ?? '',
  employeeId: data.employeeId ?? data.EmployeeId ?? 0,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setOnUnauthorized(() => () => setUser(null));
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await getMe();
        if (!active) return;
        if (res.success && res.data) {
          const sessionUser = normalizeUser(res.data);
          setUser(sessionUser);
          setCurrentUser(sessionUser);
        }
      } catch {
        if (active) {
          setUser(null);
          clearCurrentUser();
        }
      } finally {
        if (active) setInitializing(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((userData) => {
    const sessionUser = normalizeUser(userData);
    setUser(sessionUser);
    setCurrentUser(sessionUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Clear local session even if the API call fails.
    }
    setUser(null);
    clearCurrentUser();
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    initializing,
    login,
    logout,
  }), [user, initializing, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
