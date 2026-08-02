export const MobileNotificationCardSkeleton = () => {
  return (
    <div className="border-border bg-surface min-h-28 rounded-xl border p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-xl bg-neutral-100" />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="h-5 w-36 animate-pulse rounded-sm bg-neutral-100" />
            <div className="size-2 animate-pulse rounded-full bg-neutral-100" />
          </div>
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded-sm bg-neutral-100" />
            <div className="h-4 w-2/3 animate-pulse rounded-sm bg-neutral-100" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-20 animate-pulse rounded-sm bg-neutral-100" />
            <div className="h-4 w-16 animate-pulse rounded-sm bg-neutral-100" />
          </div>
        </div>
      </div>

      <div className="mt-3 h-9 animate-pulse rounded-md bg-neutral-100" />
    </div>
  );
};

export const MobileNotificationsListSkeleton = () => {
  return (
    <div aria-hidden="true" className="space-y-3 lg:hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <MobileNotificationCardSkeleton key={index} />
      ))}
    </div>
  );
};
