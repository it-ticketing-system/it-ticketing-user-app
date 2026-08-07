'use client';

import { Button, Card } from '@heroui/react';
import {
  BellRing,
  CheckCircle2,
  Download,
  RefreshCw,
  Smartphone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { IosInstallModal, PushPermission } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePwa } from '@/hooks';
import SectionHeader from './section-header';

const PwaSettingsCard = () => {
  const t = useTranslations('profile.pwaSettings');
  const tPwaInstall = useTranslations('pwa.install');
  const tPwaUpdate = useTranslations('pwa.update');
  const {
    canInstall,
    isIos,
    isStandalone,
    isUpdateAvailable,
    promptInstall,
    reloadForUpdate,
  } = usePwa();
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);

  return (
    <>
      <Card className="border-border bg-surface rounded-xl border shadow-sm">
        <SectionHeader
          icon={BellRing}
          title={t('title')}
          description={t('description')}
        />

        <Card.Content className="space-y-4">
          {isUpdateAvailable ? (
            <div className="border-border bg-primary-50 flex flex-col gap-3 rounded-xl border p-4 text-start lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-surface text-accent flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs">
                  <RefreshCw
                    aria-hidden="true"
                    className={ICON_SIZE_CLASS.md}
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-title text-foreground">
                    {tPwaUpdate('title')}
                  </p>
                  <p className="text-body-sm text-muted leading-6">
                    {tPwaUpdate('description')}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                variant="primary"
                className="h-9 w-full lg:w-auto lg:shrink-0"
                onPress={reloadForUpdate}
              >
                <RefreshCw aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
                {tPwaUpdate('confirm')}
              </Button>
            </div>
          ) : null}

          <PushPermission />

          <div className="border-border bg-primary-50/50 flex flex-col gap-3 rounded-xl border p-4 text-start lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-surface text-accent flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs">
                {isIos ? (
                  <Smartphone
                    aria-hidden="true"
                    className={ICON_SIZE_CLASS.md}
                  />
                ) : (
                  <Download aria-hidden="true" className={ICON_SIZE_CLASS.md} />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-title text-foreground">
                  {tPwaInstall('title')}
                </p>
                <p className="text-body-sm text-muted leading-6">
                  {isStandalone
                    ? t('appInstalled')
                    : tPwaInstall('description')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:shrink-0">
              {isStandalone ? (
                <div className="bg-success-50 text-success-700 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium lg:w-auto">
                  <CheckCircle2
                    aria-hidden="true"
                    className={ICON_SIZE_CLASS.sm}
                  />
                  {t('appInstalled')}
                </div>
              ) : isIos ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 w-full lg:w-auto"
                  onPress={() => setIsIosModalOpen(true)}
                >
                  <Smartphone
                    aria-hidden="true"
                    className={ICON_SIZE_CLASS.sm}
                  />
                  {t('iosGuideButton')}
                </Button>
              ) : canInstall ? (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="h-9 w-full lg:w-auto"
                  onPress={promptInstall}
                >
                  <Download aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
                  {tPwaInstall('confirm')}
                </Button>
              ) : null}
            </div>
          </div>
        </Card.Content>
      </Card>

      <IosInstallModal
        isOpen={isIosModalOpen}
        onOpenChange={setIsIosModalOpen}
      />
    </>
  );
};

export default PwaSettingsCard;
