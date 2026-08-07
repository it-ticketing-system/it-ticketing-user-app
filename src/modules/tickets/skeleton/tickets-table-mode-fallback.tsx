'use client';

import { DesktopTicketsTableSkeleton } from './desktop-tickets-table-skeleton';
import { MobileTicketsListSkeleton } from './mobile-tickets-list-skeleton';

const TicketsTableModeFallback = () => {
  return (
    <>
      <DesktopTicketsTableSkeleton />
      <MobileTicketsListSkeleton />
    </>
  );
};

export default TicketsTableModeFallback;
