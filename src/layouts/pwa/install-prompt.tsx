'use client';

import { Button } from '@heroui/react';
import { Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePwa } from '@/hooks';

const InstallPrompt = () => {
  const t = useTranslations('pwa.install');
  const { canInstall, dismissInstallPrompt, promptInstall } = usePwa();

  if (!canInstall) {
    return null;
  }

  return (
    <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 text-start">
        <div className="bg-primary-50 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Download aria-hidden="true" className={ICON_SIZE_CLASS.md} />
        </div>

        <div className="space-y-1">
          <p className="text-title text-foreground">{t('title')}</p>
          <p className="text-body-sm text-muted leading-6">{t('description')}</p>
        </div>
      </div>

      <div className="flex gap-2 sm:shrink-0">
        <Button
          type="button"
          size="sm"
          variant="primary"
          className="h-9 flex-1 sm:flex-none"
          onPress={promptInstall}
        >
          {t('confirm')}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label={t('dismiss')}
          className="h-9 min-w-9 px-0"
          onPress={dismissInstallPrompt}
        >
          <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
        </Button>
      </div>
    </div>
  );
};

export default InstallPrompt;
