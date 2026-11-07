import type { UserProfile } from './types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: UserProfile): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('permissions');
  } catch {}
}

export async function loginWithApi(
  email: string,
  pass: string,
): Promise<{ user: UserProfile; token: string }> {
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    if (res.ok) {
      const data = (await res.json()) as { user: UserProfile; token: string };
      setStoredSession(data.token, data.user);
      return data;
    }
  } catch {
    // Backend offline / network unreachable -> fallback ke local seed mock
  }

  // Fallback lokal jika server offline
  const normalized = email.trim().toLowerCase();
  const roleMatch = normalized.includes('superadmin')
    ? 'SUPER_ADMIN'
    : normalized.includes('admin')
      ? 'ADMIN'
      : normalized.includes('presales')
        ? 'PRESALES'
        : normalized.includes('bpa')
          ? 'BPA'
          : normalized.includes('uiux')
            ? 'UI_UX'
            : normalized.includes('developer')
              ? 'DEVELOPER'
              : normalized.includes('qa')
                ? 'QA'
                : 'PRESALES';

  const mockUser: UserProfile = {
    id: `usr-${Date.now()}`,
    name: normalized.split('@')[0]!.toUpperCase(),
    email: normalized,
    role: roleMatch,
    status: 'ACTIVE',
    permissions: roleMatch === 'SUPER_ADMIN' || roleMatch === 'ADMIN' ? ['*'] : ['projects.view', 'projects.create', 'builder.view'],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  const mockToken = `mock-token-${Date.now()}`;
  setStoredSession(mockToken, mockUser);
  return { user: mockUser, token: mockToken };
}

export async function logoutWithApi(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }
  clearStoredSession();
}
