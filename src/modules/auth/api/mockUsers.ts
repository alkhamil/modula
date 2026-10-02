import type { AuthUser } from '../types';

export interface MockUserRecord extends AuthUser {
  password: string;
  /**
   * Permission list akun ini — dikembalikan di response login.
   * Boleh bentuk penuh (`user.view`) atau compact (`user:view,create`)
   * yang di-expand saat login via `normalizePermissions`.
   * Wildcard `'*'` = akses penuh.
   */
  permissions: string[];
  description: string;
}

/**
 * Config akun demo mock-only.
 * Dipakai mock login + daftar akun di halaman login.
 */
export const mockUserRecords: MockUserRecord[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    permissions: ['*'],
    description: 'Akses penuh (wildcard)',
  },
];

/** Akun demo untuk ditampilkan di halaman login (mock only). */
export const demoAccounts = mockUserRecords.map(
  ({ username, password, role, description }) => ({ username, password, role, description }),
);
