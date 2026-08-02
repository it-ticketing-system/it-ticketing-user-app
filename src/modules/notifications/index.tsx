import { connection } from 'next/server';
import { Suspense } from 'react';
import NotificationsClient from './notifications-client';
import { getNotificationsInitialData } from './notifications.server';
import NotificationsClientFallback from './skeleton/notifications-client-fallback';
import type { NotificationsSearchParams } from './notifications-query';

type NotificationsModuleProps = {
  searchParams: Promise<NotificationsSearchParams>;
};

const NotificationsModule = async ({
  searchParams,
}: NotificationsModuleProps) => {
  await connection();
  const initialData = await getNotificationsInitialData(await searchParams);

  return (
    <div className="space-y-6">
      <Suspense fallback={<NotificationsClientFallback />}>
        <NotificationsClient {...initialData} />
      </Suspense>
    </div>
  );
};

export default NotificationsModule;
