export const DesktopNotificationsTableSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="border-border bg-surface hidden overflow-hidden rounded-xl border shadow-sm lg:block"
    >
      <div className="border-separator grid h-12 grid-cols-[112px_minmax(180px,1fr)_minmax(260px,1.4fr)_160px_176px_80px] items-center gap-4 border-b bg-neutral-50 px-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-4 animate-pulse rounded-sm bg-neutral-100"
          />
        ))}
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="border-separator grid min-h-18 grid-cols-[112px_minmax(180px,1fr)_minmax(260px,1.4fr)_160px_176px_80px] items-center gap-4 border-b px-4 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <div className="size-2 animate-pulse rounded-full bg-neutral-100" />
            <div className="size-10 animate-pulse rounded-xl bg-neutral-100" />
          </div>
          <div className="h-5 animate-pulse rounded-sm bg-neutral-100" />
          <div className="h-4 animate-pulse rounded-sm bg-neutral-100" />
          <div className="h-7 animate-pulse rounded-md bg-neutral-100" />
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded-sm bg-neutral-100" />
            <div className="h-3 w-20 animate-pulse rounded-sm bg-neutral-100" />
          </div>
          <div className="mx-auto size-8 animate-pulse rounded-md bg-neutral-100" />
        </div>
      ))}
    </div>
  );
};
