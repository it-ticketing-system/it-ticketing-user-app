import { Button, Card } from '@heroui/react';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { useAuth } from '@/hooks';

const LogoutSection = () => {
  const t = useTranslations('profile.logout');
  const { logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Card className="border-border bg-surface rounded-xl border shadow-sm">
      <Card.Content className="gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="bg-danger-soft text-danger-soft-foreground flex size-10 shrink-0 items-center justify-center rounded-md"
          >
            <LogOut className={ICON_SIZE_CLASS.md} />
          </span>

          <div className="min-w-0 space-y-1">
            <h2 className="text-title text-foreground">{t('title')}</h2>

            <p className="text-caption text-muted">{t('description')}</p>
          </div>
        </div>

        <Button
          fullWidth
          type="button"
          size="md"
          variant="outline"
          className="border-danger-500 text-danger-600 hover:bg-danger-soft"
          isPending={isLoggingOut}
          onPress={handleLogout}
        >
          <LogOut aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('action')}
        </Button>
      </Card.Content>
    </Card>
  );
};

export default LogoutSection;
