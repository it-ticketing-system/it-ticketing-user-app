'use client';

import { Button, Modal } from '@heroui/react';
import { CheckCircle2, PlusSquare, Share2, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';

interface IosInstallModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const IosInstallModal = ({ isOpen, onOpenChange }: IosInstallModalProps) => {
  const t = useTranslations('profile.pwaSettings.iosModal');

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="opaque"
        className="bg-backdrop"
      >
        <Modal.Container placement="center" scroll="inside" size="md">
          <Modal.Dialog
            aria-label={t('title')}
            className="bg-surface w-full max-w-md rounded-xl p-0 shadow-xl"
          >
            {({ close }) => (
              <>
                <Modal.Header className="border-separator flex items-center gap-3 border-b p-4">
                  <div className="bg-primary-50 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Smartphone
                      aria-hidden="true"
                      className={ICON_SIZE_CLASS.md}
                    />
                  </div>
                  <Modal.Heading className="text-title text-foreground">
                    {t('title')}
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="space-y-4 p-4 text-start">
                  <div className="bg-primary-50/50 border-border flex items-start gap-3 rounded-xl border p-3">
                    <div className="bg-surface text-accent flex size-8 shrink-0 items-center justify-center rounded-lg shadow-xs">
                      <Share2
                        aria-hidden="true"
                        className={ICON_SIZE_CLASS.sm}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-body-sm text-foreground font-medium">
                        {t('step1Title')}
                      </p>
                      <p className="text-caption text-muted leading-6">
                        {t('step1')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-50/50 border-border flex items-start gap-3 rounded-xl border p-3">
                    <div className="bg-surface text-accent flex size-8 shrink-0 items-center justify-center rounded-lg shadow-xs">
                      <PlusSquare
                        aria-hidden="true"
                        className={ICON_SIZE_CLASS.sm}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-body-sm text-foreground font-medium">
                        {t('step2Title')}
                      </p>
                      <p className="text-caption text-muted leading-6">
                        {t('step2')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-50/50 border-border flex items-start gap-3 rounded-xl border p-3">
                    <div className="bg-surface text-accent flex size-8 shrink-0 items-center justify-center rounded-lg shadow-xs">
                      <CheckCircle2
                        aria-hidden="true"
                        className={ICON_SIZE_CLASS.sm}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-body-sm text-foreground font-medium">
                        {t('step3Title')}
                      </p>
                      <p className="text-caption text-muted leading-6">
                        {t('step3')}
                      </p>
                    </div>
                  </div>
                </Modal.Body>

                <Modal.Footer className="border-separator border-t p-4">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    onPress={close}
                  >
                    {t('close')}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default IosInstallModal;
