import { useContext } from 'react';
import { PwaContext } from '@/contexts';

const usePwa = () => {
  const context = useContext(PwaContext);

  if (!context) {
    throw new Error('usePwa must be used within PWAProvider.');
  }

  return context;
};

export default usePwa;
