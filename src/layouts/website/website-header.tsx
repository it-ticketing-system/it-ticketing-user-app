import { buttonVariants, Link } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/shared';
import { ROUTES } from '@/constants';

const WebsiteHeader = () => {
  const t = useTranslations('header');

  return (
    <header className="bg-surface mx-auto flex h-14 max-w-7xl items-center justify-between border-b px-4 sm:px-5 md:px-6 lg:px-8 xl:h-16">
      <Link href={ROUTES.home} className="flex items-center gap-2 no-underline">
        <Logo />
        <span className="text-h3">{t('title')}</span>
      </Link>

      <div className="flex gap-2">
        <Link
          href={ROUTES.login}
          className={buttonVariants({ variant: 'outline' })}
        >
          {t('actions.login')}
        </Link>

        <Link href={ROUTES.register} className={buttonVariants()}>
          {t('actions.register')}
        </Link>
      </div>
    </header>
  );
};

export default WebsiteHeader;
