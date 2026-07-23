import AppHeader from './app-header';
import BottomNavigation from './bottom-navigation';

const PWALayout: FCC = ({ children }) => {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-[calc(64px+env(safe-area-inset-bottom))] sm:px-5 md:px-6 lg:px-8 lg:pb-0">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default PWALayout;
