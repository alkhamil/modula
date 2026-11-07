import { useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { getStoredPermissions, hasPermissionKey } from '../../shared/utils';
import { AuthContext, type AuthContextValue, type AuthSession } from './auth-context';
import type { AppRole, UserProfile } from '../../modules/auth/types';
import { getStoredToken, getStoredUser, setStoredSession, clearStoredSession, logoutWithApi } from '../../modules/auth/authApi';

export function AuthProvider() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(() =>
    getStoredToken() ? getStoredUser() : null,
  );
  const [permissions, setPermissions] = useState<string[]>(() =>
    getStoredToken() ? (getStoredUser()?.permissions ?? getStoredPermissions()) : [],
  );

  const signIn = useCallback((session: AuthSession) => {
    setStoredSession(session.token, session.user);
    setUser(session.user);
    const perms = session.permissions && session.permissions.length > 0 ? session.permissions : session.user.permissions ?? [];
    setPermissions(perms);
    try {
      localStorage.setItem('permissions', JSON.stringify(perms));
    } catch {}
  }, []);

  const logout = useCallback(() => {
    void logoutWithApi();
    clearStoredSession();
    setUser(null);
    setPermissions([]);
    navigate('/login', { replace: true });
  }, [navigate]);

  const can = useCallback(
    (key: string) => {
      if (permissions.includes('*')) return true;
      return hasPermissionKey(permissions, key);
    },
    [permissions],
  );

  const hasRole = useCallback(
    (targetRole: AppRole | AppRole[]) => {
      if (!user) return false;
      if (user.role === 'SUPER_ADMIN') return true;
      if (Array.isArray(targetRole)) {
        return targetRole.includes(user.role);
      }
      return user.role === targetRole;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      isAuthenticated: user !== null,
      signIn,
      logout,
      can,
      hasRole,
    }),
    [user, permissions, signIn, logout, can, hasRole],
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
