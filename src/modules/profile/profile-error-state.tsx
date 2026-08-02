import { Button } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';

interface ProfileErrorStateProps {
  isFetching: boolean;
  onRetry: () => void;
}

const ProfileErrorState = ({ isFetching, onRetry }: ProfileErrorStateProps) => {
  const t = useTranslations('profile.states');

  return (
    <div className="border-border bg-surface flex min-h-60 flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center shadow-sm">
      <div className="space-y-1">
        <p className="text-title text-foreground">{t('errorTitle')}</p>
        <p className="text-body-sm text-muted">{t('errorDescription')}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        isPending={isFetching}
        onPress={onRetry}
      >
        <RefreshCw aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
        {t('retry')}
      </Button>
    </div>
  );
};

export default ProfileErrorState;
