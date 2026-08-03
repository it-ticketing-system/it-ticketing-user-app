'use client';

import { Button } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePwa } from '@/hooks';

const UpdateAvailable = () => {
  const t = useTranslations('pwa.update');
  const { isUpdateAvailable, reloadForUpdate } = usePwa();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="border-border bg-primary-50 flex flex-col gap-3 rounded-xl border p-3 text-start sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-title text-foreground">{t('title')}</p>
        <p className="text-body-sm text-muted leading-6">{t('description')}</p>
      </div>

      <Button
        type="button"
        size="sm"
        variant="primary"
        className="h-9 sm:shrink-0"
        onPress={reloadForUpdate}
      >
        <RefreshCw aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
        {t('confirm')}
      </Button>
    </div>
  );
};

export default UpdateAvailable;
