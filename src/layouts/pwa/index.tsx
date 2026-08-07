'use client';

import { usePathname } from 'next/navigation';
import { PushPermission } from '@/components/shared';
import { ROUTES } from '@/constants';
import { cn } from '@/utils';
import AppHeader from './app-header';
import BottomNavigation from './bottom-navigation';
import InstallPrompt from './install-prompt';
import NetworkIndicator from './network-indicator';
import {
  PWA_CONTENT_MIN_HEIGHT_CLASS,
  PWA_SHELL_CONTAINER_CLASS,
} from './shared';
import UpdateAvailable from './update-available';

const PWALayout: FCC = ({ children }) => {
  const pathname = usePathname();
  const isProfilePage = pathname === ROUTES.profile;

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <AppHeader />

      <main
        className={cn(
          PWA_SHELL_CONTAINER_CLASS,
          PWA_CONTENT_MIN_HEIGHT_CLASS,
          'flex flex-col gap-2 pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0',
        )}
      >
        <div className={cn('mt-2 flex flex-col gap-2')}>
          <NetworkIndicator />
          {!isProfilePage ? (
            <>
              <UpdateAvailable />
              <InstallPrompt />
              <PushPermission hideIfSubscribed showDismissButton />
            </>
          ) : null}
        </div>
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default PWALayout;
