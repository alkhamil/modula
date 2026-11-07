import { createContext } from 'react';
import type { AppRole, UserProfile } from '../../modules/auth/types';

export type AuthUser = UserProfile;

export interface AuthSession {
  user: UserProfile;
  token: string;
  permissions: string[];
}

export interface AuthContextValue {
  user: UserProfile | null;
  permissions: string[];
  isAuthenticated: boolean;
  signIn: (session: AuthSession) => void;
  logout: () => void;
  can: (key: string) => boolean;
  hasRole: (role: AppRole | AppRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
