'use client';

import { WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePwa } from '@/hooks';

const NetworkIndicator = () => {
  const t = useTranslations('pwa.network');
  const { isOnline } = usePwa();

  if (isOnline) {
    return null;
  }

  return (
    <div className="border-warning bg-warning-soft text-warning-soft-foreground flex items-start gap-2 rounded-xl border px-3 py-2 text-start">
      <WifiOff aria-hidden="true" className={`${ICON_SIZE_CLASS.sm} mt-1 shrink-0`} />
      <p className="text-body-sm leading-6">{t('offline')}</p>
    </div>
  );
};

export default NetworkIndicator;
