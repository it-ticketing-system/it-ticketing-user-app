'use client';

import { Button } from '@heroui/react';
import { Download, Smartphone, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { IosInstallModal } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePwa } from '@/hooks';

const InstallPrompt = () => {
  const t = useTranslations('pwa.install');
  const {
    canInstall,
    isIos,
    isInstallPromptDismissed,
    isStandalone,
    dismissInstallPrompt,
    promptInstall,
  } = usePwa();
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);

  if (isStandalone || isInstallPromptDismissed) {
    return null;
  }

  if (!isIos && !canInstall) {
    return null;
  }

  return (
    <>
      <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3 text-start">
          <div className="bg-primary-50 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
            {isIos ? (
              <Smartphone aria-hidden="true" className={ICON_SIZE_CLASS.md} />
            ) : (
              <Download aria-hidden="true" className={ICON_SIZE_CLASS.md} />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-title text-foreground">{t('title')}</p>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label={t('dismiss')}
                className="size-8 min-w-8 shrink-0 p-0 lg:hidden"
                onPress={dismissInstallPrompt}
              >
                <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
              </Button>
            </div>

            <p className="text-body-sm text-muted leading-6">
              {t('description')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:shrink-0">
          {isIos ? (
            <Button
              type="button"
              size="sm"
              variant="primary"
              className="h-9 w-full lg:w-auto"
              onPress={() => setIsIosModalOpen(true)}
            >
              {t('iosGuideButton')}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="primary"
              className="h-9 w-full lg:w-auto"
              onPress={promptInstall}
            >
              {t('confirm')}
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={t('dismiss')}
            className="hidden h-9 min-w-9 px-0 lg:inline-flex"
            onPress={dismissInstallPrompt}
          >
            <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          </Button>
        </div>
      </div>

      {isIos ? (
        <IosInstallModal
          isOpen={isIosModalOpen}
          onOpenChange={setIsIosModalOpen}
        />
      ) : null}
    </>
  );
};

export default InstallPrompt;
