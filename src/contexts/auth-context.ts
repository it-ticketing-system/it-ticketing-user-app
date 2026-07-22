'use client';

import { createContext } from 'react';
import type { ApiException } from '@/apis/core/api-error';
import type { AuthUserModel } from '@/models/auth';

export type AuthStatus =
  'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthContextValue {
  user: AuthUserModel | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiException | null;
  refresh: () => Promise<AuthUserModel>;
  reset: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
