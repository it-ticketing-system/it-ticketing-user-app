'use client';

import { DesktopNotificationsTableSkeleton } from './desktop-notifications-table-skeleton';
import { MobileNotificationsListSkeleton } from './mobile-notifications-list-skeleton';

const NotificationsTableModeFallback = () => {
  return (
    <>
      <DesktopNotificationsTableSkeleton />
      <MobileNotificationsListSkeleton />
    </>
  );
};

export default NotificationsTableModeFallback;
