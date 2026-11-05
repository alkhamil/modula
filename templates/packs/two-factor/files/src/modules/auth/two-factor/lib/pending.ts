import type { AuthSession } from '../../../../app/providers';

const PENDING_KEY = 'auth_pending_2fa';

/** Akun ini harus verifikasi dua langkah sebelum sesi dibuat. */
export function needsTwoFactor(session: AuthSession): boolean {
  return session.user.twoFactor === true;
}

/** Simpan sesi sementara (sessionStorage) sampai kode diverifikasi. */
export function storePendingSession(session: AuthSession): void {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(session));
}

export function readPendingSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function clearPendingSession(): void {
  sessionStorage.removeItem(PENDING_KEY);
}
