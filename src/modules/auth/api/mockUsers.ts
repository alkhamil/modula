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

/** Config akun demo (mock only). */
export const mockUserRecords: MockUserRecord[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    permissions: ['*'],
    description: 'Akses penuh (wildcard)',
  },
  {
    username: 'editor',
    password: 'editor123',
    name: 'Editor',
    role: 'editor',
    permissions: [
      'user:view,create,update,export,bulk_upload',
      'company.view',
      'company.create',
      'company.update',
    ],
    description: 'Kelola user & company tanpa hapus',
  },
  {
    username: 'viewer',
    password: 'viewer123',
    name: 'Viewer',
    role: 'viewer',
    permissions: ['user.view', 'user.export', 'company.view'],
    description: 'Lihat + export saja',
  },
];

/** Akun demo untuk ditampilkan di halaman login (mock only). */
export const demoAccounts = mockUserRecords.map(
  ({ username, password, role, description }) => ({ username, password, role, description }),
);
