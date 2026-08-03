import { cn } from '@/utils';
import AppHeader from './app-header';
import BottomNavigation from './bottom-navigation';
import InstallPrompt from './install-prompt';
import NetworkIndicator from './network-indicator';
import PushPermission from './push-permission';
import {
  PWA_CONTENT_MIN_HEIGHT_CLASS,
  PWA_CONTENT_SPACING_CLASS,
  PWA_SHELL_CONTAINER_CLASS,
} from './shared';
import UpdateAvailable from './update-available';

const PWALayout: FCC = ({ children }) => {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <AppHeader />
      <div
        className={cn(
          PWA_SHELL_CONTAINER_CLASS,
          'flex flex-col gap-2 pt-3 lg:pt-4',
        )}
      >
        <NetworkIndicator />
        <UpdateAvailable />
        <InstallPrompt />
        <PushPermission />
      </div>
      <main
        className={cn(
          PWA_SHELL_CONTAINER_CLASS,
          PWA_CONTENT_MIN_HEIGHT_CLASS,
          PWA_CONTENT_SPACING_CLASS,
          'flex flex-col pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0',
        )}
      >
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default PWALayout;
