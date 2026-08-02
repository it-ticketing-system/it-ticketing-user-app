'use client';

import { useAuth } from '@/hooks';
import AccountSecurity from './account-security';
import LogoutSection from './logout-section';
import ProfileEditor from './profile-editor';
import ProfileErrorState from './profile-error-state';
import ProfileSkeleton from './profile-skeleton';

const ProfileModule = () => {
  const { user, isLoading, isFetching, error, refresh } = useAuth();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user || error) {
    return (
      <ProfileErrorState
        isFetching={isFetching}
        onRetry={() => {
          void refresh();
        }}
      />
    );
  }

  return (
    <section className="grid w-full flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start lg:gap-6">
      <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
        <ProfileEditor user={user} onProfileRefresh={refresh} />
        <AccountSecurity />
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:gap-6">
        <LogoutSection />
      </aside>
    </section>
  );
};

export default ProfileModule;
