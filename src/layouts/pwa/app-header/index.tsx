'use client';

import { buttonVariants } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/shared';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';
import { cn } from '@/utils';
import {
  getPwaPageHeaderConfig,
  type PwaPageHeaderActionConfig,
} from '../page-header';
import {
  isRouteActive,
  navigationItems,
  PWA_HEADER_HEIGHT_CLASS,
  PWA_SHELL_CONTAINER_CLASS,
} from '../shared';
import NotificationLink from './notification-link';
import UserMenu from './user-menu';

type AppHeaderProps = {
  unreadNotificationsCount?: number;
};

type PageHeaderActionProps = {
  action: PwaPageHeaderActionConfig;
  label: string;
};

const PageHeaderAction = ({ action, label }: PageHeaderActionProps) => {
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      aria-label={label}
      className={cn(
        buttonVariants({
          size: action.size,
          variant: action.variant,
        }),
        'shrink-0 max-lg:size-10 max-lg:min-w-10 max-lg:px-0',
      )}
    >
      <span className="hidden lg:inline">{label}</span>
      <Icon
        aria-hidden="true"
        className={cn(ICON_SIZE_CLASS.md, 'shrink-0')}
      />
    </Link>
  );
};

const AppHeader = ({ unreadNotificationsCount = 1000 }: AppHeaderProps) => {
  const t = useTranslations('pwaLayout.appHeader');
  const tCommon = useTranslations('common');
  const tPageHeader = useTranslations('pageHeader');

  const pathname = usePathname();
  const pageHeader = getPwaPageHeaderConfig(pathname);

  return (
    <header
      className={cn(
        'border-border bg-surface sticky top-0 z-95 w-full border-b',
        PWA_HEADER_HEIGHT_CLASS,
      )}
    >
      <div
        className={cn(
          PWA_SHELL_CONTAINER_CLASS,
          PWA_HEADER_HEIGHT_CLASS,
          'flex items-center justify-between gap-3',
        )}
      >
        <Link
          href={ROUTES.tickets}
          aria-label={tCommon('brand.appName')}
          className="focus-visible:ring-focus flex min-w-0 items-center gap-3 rounded-md transition-colors duration-(--motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Logo />

          <span className="min-w-0 text-start">
            <span className="text-body-sm text-foreground lg:text-title block truncate font-semibold">
              {pageHeader
                ? tPageHeader(`${pageHeader.messageKey}.title`)
                : tCommon('brand.appName')}
            </span>

            {pageHeader ? (
              <span className="text-caption text-muted lg:text-body-sm mt-0.5 hidden max-w-[44rem] truncate sm:block">
                {tPageHeader(`${pageHeader.messageKey}.description`)}
              </span>
            ) : null}
          </span>
        </Link>

        <nav
          aria-label={t('mainNavigation')}
          className="hidden h-full items-center gap-6 lg:flex"
        >
          {navigationItems.map((item) => {
            const isActive = isRouteActive(item.href, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-body-sm focus-visible:ring-focus relative flex h-full items-center justify-center px-2 font-medium transition-colors duration-(--motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-inset ${
                  isActive ? 'text-accent' : 'text-muted hover:text-foreground'
                } `}
              >
                {t(item.label)}

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="bg-accent absolute bottom-0 left-1/2 h-0.75 w-10 -translate-x-1/2 rounded-t-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 lg:gap-3">
          {pageHeader?.action ? (
            <PageHeaderAction
              action={pageHeader.action}
              label={tPageHeader(`${pageHeader.messageKey}.actionText`)}
            />
          ) : null}

          <NotificationLink
            unreadNotificationsCount={unreadNotificationsCount}
          />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
