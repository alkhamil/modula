import type { AuthSession, AuthUser } from '../../../../app/providers';

export type { AuthUser };

export interface LoginPayload {
  username: string;
  password: string;
}

/** Response login = sesi yang disimpan `AuthProvider.signIn`. */
export type LoginResult = AuthSession;
