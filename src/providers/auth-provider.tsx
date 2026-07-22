'use client';

import { type PropsWithChildren, useMemo } from 'react';
import { authServices } from '@/apis/services/auth/client';
import { AuthContext } from '@/contexts/auth-context';
import { useGetRequest } from '@/hooks';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    data: user,
    error,
    isLoading,
    isFetching,
    refetch,
    reset,
  } = useGetRequest({
    requestFn: authServices.getMe,
    showErrorToast: false,
  });

  const isUnauthenticated = error?.status === 401;
  const isAuthenticated = user !== null && !isUnauthenticated;

  const status = useMemo(() => {
    if (isLoading) {
      return 'loading' as const;
    }

    if (isUnauthenticated) {
      return 'unauthenticated' as const;
    }

    if (isAuthenticated) {
      return 'authenticated' as const;
    }

    if (error) {
      return 'error' as const;
    }

    return 'loading' as const;
  }, [isLoading, isUnauthenticated, isAuthenticated, error]);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated,
      isUnauthenticated,
      isLoading,
      isFetching,
      error,
      refresh: refetch,
      reset,
    }),
    [
      user,
      status,
      isAuthenticated,
      isUnauthenticated,
      isLoading,
      isFetching,
      error,
      refetch,
      reset,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
