import type { AuthUser, LoginPayload, LoginResult } from '../types';
import { normalizePermissions } from '../../../../shared/utils';

/** Saklar sumber data auth: `true` = mock lokal tanpa backend. */
export const USE_MOCK = {
  login: true,
};

export interface MockUserRecord extends AuthUser {
  password: string;
  email?: string;
  /**
   * Permission list akun ini — dikembalikan di response login.
   * Boleh bentuk penuh (`user.view`) atau compact (`user:view,create`)
   * yang di-expand saat login via `normalizePermissions`.
   * Wildcard `'*'` = akses penuh.
   */
  permissions: string[];
  description: string;
}

/** Akun seed mock-only. Dipakai mock login + daftar akun demo di halaman login. */
const seedUsers: MockUserRecord[] = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    name: 'Administrator',
    role: 'admin',
    twoFactor: true,
    permissions: ['*'],
    description: 'Akses penuh (wildcard)',
  },
];

const REGISTERED_KEY = 'mock_registered_users_v1';
const PASSWORDS_KEY = 'mock_password_overrides_v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Seed + akun hasil register (localStorage), dengan password hasil reset diterapkan. */
function listMockUsers(): MockUserRecord[] {
  const overrides = readJson<Record<string, string>>(PASSWORDS_KEY, {});
  return [...seedUsers, ...readJson<MockUserRecord[]>(REGISTERED_KEY, [])].map((record) =>
    overrides[record.username] ? { ...record, password: overrides[record.username] } : record,
  );
}

/** Tambah akun mock baru (dipakai pack `register`). Gagal bila username sudah ada. */
export function addMockUser(record: MockUserRecord): void {
  const username = record.username.trim().toLowerCase();
  if (listMockUsers().some((candidate) => candidate.username === username)) {
    throw new Error('auth.usernameTaken');
  }
  const registered = readJson<MockUserRecord[]>(REGISTERED_KEY, []);
  localStorage.setItem(REGISTERED_KEY, JSON.stringify([...registered, { ...record, username }]));
}

export function findMockUserByEmail(email: string): MockUserRecord | undefined {
  const needle = email.trim().toLowerCase();
  return listMockUsers().find((candidate) => candidate.email?.toLowerCase() === needle);
}

/** Ganti password akun mock (dipakai pack `forgot-password`). */
export function updateMockPassword(username: string, password: string): void {
  const overrides = readJson<Record<string, string>>(PASSWORDS_KEY, {});
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify({ ...overrides, [username]: password }));
}

/** Akun demo untuk ditampilkan di halaman login (mock only). */
export const demoAccounts = seedUsers.map(({ username, password, role, description }) => ({
  username,
  password,
  role,
  description,
}));

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Auth mock-only (tanpa BE): kredensial dicek terhadap daftar akun mock. */
export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  await delay(500);
  const record = listMockUsers().find(
    (candidate) => candidate.username === payload.username.trim().toLowerCase(),
  );
  if (!record || record.password !== payload.password) {
    throw new Error('auth.invalidCredentials');
  }
  return {
    user: { username: record.username, name: record.name, role: record.role, twoFactor: record.twoFactor },
    token: `mock-token-${record.username}-${Date.now()}`,
    permissions: normalizePermissions(record.permissions),
  };
}
