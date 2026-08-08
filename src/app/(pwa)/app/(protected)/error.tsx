'use client';

import ErrorModule from '@/modules/error';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ProtectedErrorPage = ({ error, reset }: ErrorPageProps) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[PWA Route Error]:', error);
  }

  return <ErrorModule reset={reset} />;
};

export default ProtectedErrorPage;
