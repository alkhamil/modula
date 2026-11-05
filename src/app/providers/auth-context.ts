import { createContext } from 'react';

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  twoFactor?: boolean;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  permissions: string[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  isAuthenticated: boolean;
  signIn: (session: AuthSession) => void;
  logout: () => void;
  can: (key: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
