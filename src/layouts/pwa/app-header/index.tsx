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
        'h-11 shrink-0 justify-center max-lg:size-10 max-lg:min-w-10 max-lg:px-0 lg:min-w-36',
      )}
    >
      <span className="hidden lg:inline">{label}</span>
      <Icon aria-hidden="true" className={cn(ICON_SIZE_CLASS.md, 'shrink-0')} />
    </Link>
  );
};

const AppHeader = () => {
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
          'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[minmax(14rem,1fr)_auto_minmax(14rem,1fr)]',
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
          </span>
        </Link>

        <nav
          aria-label={t('mainNavigation')}
          className="hidden h-full items-center justify-center gap-6 lg:flex"
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

        <div className="flex shrink-0 items-center justify-end gap-1 lg:justify-self-end lg:gap-3">
          <div className="flex h-11 min-w-10 shrink-0 items-center justify-end lg:min-w-36">
            {pageHeader?.action ? (
              <PageHeaderAction
                action={pageHeader.action}
                label={tPageHeader(`${pageHeader.messageKey}.actionText`)}
              />
            ) : null}
          </div>

          <NotificationLink />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
