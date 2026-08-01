import { cn } from '@/utils';
import AppHeader from './app-header';
import BottomNavigation from './bottom-navigation';
import {
  PWA_CONTENT_MIN_HEIGHT_CLASS,
  PWA_CONTENT_SPACING_CLASS,
  PWA_SHELL_CONTAINER_CLASS,
} from './shared';

const PWALayout: FCC = ({ children }) => {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <AppHeader />
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
