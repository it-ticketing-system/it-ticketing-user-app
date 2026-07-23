'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { isRouteActive, navigationItems } from './shared';

const BottomNavigation = () => {
  const t = useTranslations('pwa_layout.bottomNavigation');

  const pathname = usePathname();

  return (
    <nav
      aria-label={t('navigation')}
      className="border-border bg-surface fixed inset-x-0 bottom-0 z-50 border-t lg:hidden"
    >
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-3 px-4 sm:px-5 md:px-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isRouteActive(item.href, pathname);

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="focus-visible:ring-focus relative flex min-w-0 flex-col items-center justify-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-inset"
            >
              <span
                className={`flex size-7 items-center justify-center transition-colors duration-(--motion-fast) ${
                  isActive ? 'text-accent' : 'text-muted'
                } `}
              >
                <Icon strokeWidth={2} />
              </span>
              <span
                className={`text-badge max-w-full truncate transition-colors duration-(--motion-fast) ${
                  isActive ? 'text-accent' : 'text-muted'
                } `}
              >
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="bg-surface h-[env(safe-area-inset-bottom)]"
      />
    </nav>
  );
};

export default BottomNavigation;
