'use client';

import ErrorModule from '@/modules/error';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Global Error]:', error);
  }

  return (
    <html lang="fa" dir="rtl">
      <body>
        <ErrorModule reset={reset} />
      </body>
    </html>
  );
};

export default GlobalError;
