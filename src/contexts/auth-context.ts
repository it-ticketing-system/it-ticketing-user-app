'use client';

import { createContext } from 'react';
import { IUser } from '@/models/user';
import type { ApiException } from '@/apis/core/api-error';

export type AuthStatus =
  'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthContextValue {
  user: IUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  isFetching: boolean;
  error: ApiException | null;
  refresh: () => Promise<IUser>;
  reset: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
