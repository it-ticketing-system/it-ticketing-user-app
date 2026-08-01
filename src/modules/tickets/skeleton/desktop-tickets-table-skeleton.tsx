'use client';

import { Skeleton } from '@heroui/react';

const DESKTOP_FALLBACK_ROWS = 5;

const DesktopTicketRowSkeleton = () => {
  return (
    <div className="border-separator grid h-16 grid-cols-[150px_minmax(260px,1fr)_180px_160px_190px_96px] border-b">
      <div className="flex items-center px-4">
        <Skeleton className="h-4 w-24 rounded-sm" />
      </div>

      <div className="flex items-center px-4">
        <Skeleton className="h-5 w-full max-w-80 rounded-sm" />
      </div>

      <div className="flex items-center px-4">
        <Skeleton className="h-4 w-28 rounded-sm" />
      </div>

      <div className="flex items-center px-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="flex items-center px-4">
        <Skeleton className="h-4 w-32 rounded-sm" />
      </div>

      <div className="flex items-center justify-center px-4">
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>
  );
};

export const DesktopTicketsTableSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="border-border bg-surface hidden overflow-hidden rounded-xl border shadow-sm lg:block"
    >
      <div className="overflow-x-hidden">
        <div dir="rtl" className="min-w-225">
          <div className="border-separator grid h-14 grid-cols-[150px_minmax(260px,1fr)_180px_160px_190px_96px] border-b bg-neutral-50">
            <div className="flex items-center px-4">
              <Skeleton className="h-4 w-24 rounded-sm" />
            </div>

            <div className="flex items-center px-4">
              <Skeleton className="h-4 w-20 rounded-sm" />
            </div>

            <div className="flex items-center px-4">
              <Skeleton className="h-4 w-24 rounded-sm" />
            </div>

            <div className="flex items-center px-4">
              <Skeleton className="h-4 w-20 rounded-sm" />
            </div>

            <div className="flex items-center px-4">
              <Skeleton className="h-4 w-28 rounded-sm" />
            </div>

            <div className="flex items-center justify-center px-4">
              <Skeleton className="h-4 w-12 rounded-sm" />
            </div>
          </div>

          {Array.from({ length: DESKTOP_FALLBACK_ROWS }).map((_, index) => (
            <DesktopTicketRowSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className="bg-surface flex h-14 items-center justify-between px-4">
        <Skeleton className="h-4 w-40 rounded-sm" />

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="size-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};
