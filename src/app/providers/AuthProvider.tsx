import { useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { getStoredPermissions, hasPermissionKey } from '../../shared/utils';
import { AuthContext, type AuthContextValue, type AuthSession, type AuthUser } from './auth-context';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PERMISSIONS_KEY = 'permissions';

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() =>
    localStorage.getItem(TOKEN_KEY) ? readUser() : null,
  );
  const [permissions, setPermissions] = useState<string[]>(() =>
    localStorage.getItem(TOKEN_KEY) ? getStoredPermissions() : [],
  );

  const signIn = useCallback((session: AuthSession) => {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(session.permissions));
    setUser(session.user);
    setPermissions(session.permissions);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
    setUser(null);
    setPermissions([]);
    navigate('/login', { replace: true });
  }, [navigate]);

  const can = useCallback((key: string) => hasPermissionKey(permissions, key), [permissions]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, permissions, isAuthenticated: user !== null, signIn, logout, can }),
    [user, permissions, signIn, logout, can],
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
