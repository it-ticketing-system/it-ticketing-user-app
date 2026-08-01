'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { clientAuthServices } from '@/apis/services/auth/client';
import { QUERY_KEYS, ROUTES } from '@/constants';
import { AuthContext } from '@/contexts/auth-context';
import { useGetRequest } from '@/hooks';

const AuthProvider: FCC = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    data: user,
    error,
    isLoading,
    isFetching,
    refetch,
    reset,
  } = useGetRequest({
    queryKey: QUERY_KEYS.auth.me,
    requestFn: clientAuthServices.getMe,
    showErrorToast: false,
  });

  const isUnauthenticated = error?.status === 401;
  const isAuthenticated = Boolean(user) && !isUnauthenticated;

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

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await clientAuthServices.logout();
      queryClient.clear();
      reset();

      router.replace(ROUTES.login);
    } finally {
      setIsLoggingOut(false);
    }
  }, [queryClient, reset, router]);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated,
      isUnauthenticated,
      isLoading,
      isFetching,
      isLoggingOut,
      error,
      refresh: refetch,
      reset,
      logout,
    }),
    [
      user,
      status,
      isAuthenticated,
      isUnauthenticated,
      isLoading,
      isFetching,
      isLoggingOut,
      error,
      refetch,
      reset,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
