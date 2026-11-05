import { createContext } from 'react';

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  /** Akun ini mewajibkan verifikasi dua langkah (dipakai pack `two-factor`). */
  twoFactor?: boolean;
}

/** Hasil autentikasi yang disimpan sebagai sesi. */
export interface AuthSession {
  user: AuthUser;
  token: string;
  /** Sudah dinormalisasi (bentuk compact `modul:aksi` di-expand). */
  permissions: string[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  isAuthenticated: boolean;
  /** Simpan sesi hasil login (dipanggil pack `login` setelah kredensial valid). */
  signIn: (session: AuthSession) => void;
  /** Bersihkan sesi lokal lalu arahkan ke `/login`. */
  logout: () => void;
  can: (key: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
