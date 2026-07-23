import { buttonVariants, Link } from '@heroui/react';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/shared';
import { AUTH_COOKIE_NAME, ROUTES } from '@/constants';

const WebsiteHeader = async () => {
  const t = await getTranslations('header');
  const tCommon = await getTranslations('common');
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  return (
    <header className="bg-surface mx-auto flex h-14 max-w-7xl items-center justify-between border-b px-4 sm:px-5 md:px-6 lg:px-8 xl:h-16">
      <Link href={ROUTES.home} className="flex items-center gap-2 no-underline">
        <Logo />
        <span className="text-h3">{tCommon('brand.appName')}</span>
      </Link>

      <div className="flex gap-2">
        {isAuthenticated ? (
          <Link href={ROUTES.tickets} className={buttonVariants()}>
            {t('actions.dashboard')}
          </Link>
        ) : (
          <>
            <Link
              href={ROUTES.login}
              className={buttonVariants({ variant: 'outline' })}
            >
              {t('actions.login')}
            </Link>

            <Link href={ROUTES.register} className={buttonVariants()}>
              {t('actions.register')}
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default WebsiteHeader;
