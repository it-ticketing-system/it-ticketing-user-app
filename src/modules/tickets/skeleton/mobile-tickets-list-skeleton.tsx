'use client';

import { Skeleton } from '@heroui/react';

const MOBILE_FALLBACK_CARDS = 3;

export const MobileTicketCardSkeleton = () => {
  return (
    <div className="border-border bg-surface min-h-34 rounded-xl border p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-20 rounded-sm" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-sm" />
          <Skeleton className="h-4 w-28 rounded-sm" />
        </div>

        <div className="border-separator flex items-center justify-between border-t pt-3">
          <Skeleton className="h-4 w-24 rounded-sm" />
          <Skeleton className="h-4 w-16 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export const MobileTicketsListSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-3 lg:hidden">
      {Array.from({ length: MOBILE_FALLBACK_CARDS }).map((_, index) => (
        <MobileTicketCardSkeleton key={index} />
      ))}
    </div>
  );
};
