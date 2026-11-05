import { addMockUser } from '../../login/api';
import type { RegisterPayload } from '../types';

/** Saklar sumber data: `true` = mock lokal tanpa backend. */
export const USE_MOCK = {
  register: true,
};

/** Akun baru disimpan di localStorage mock dan langsung bisa dipakai login. */
export async function mockRegister(payload: RegisterPayload): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  addMockUser({
    username: payload.username.trim().toLowerCase(),
    password: payload.password,
    email: payload.email.trim(),
    name: payload.name.trim(),
    role: 'user',
    permissions: [],
    description: 'Registered account',
  });
}
