const TicketsClientFallback = () => {
  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="flex items-center gap-3 lg:hidden">
        <div className="h-11 min-w-0 flex-1 animate-pulse rounded-md bg-neutral-100" />
        <div className="size-11 shrink-0 animate-pulse rounded-md bg-neutral-100" />
      </div>

      <div className="border-border bg-surface hidden rounded-xl border p-4 shadow-sm lg:block">
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_160px_160px_176px_112px]">
          <div className="h-11 animate-pulse rounded-md bg-neutral-100 lg:col-span-2 xl:col-span-1" />
          <div className="h-11 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-11 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-11 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-11 animate-pulse rounded-md bg-neutral-100" />
        </div>
      </div>

      <div className="border-border bg-surface hidden overflow-hidden rounded-xl border shadow-sm lg:block">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-separator grid h-16 grid-cols-[150px_minmax(260px,1fr)_180px_160px_190px_96px] items-center gap-4 border-b px-4 last:border-b-0"
          >
            <div className="h-4 animate-pulse rounded-sm bg-neutral-100" />
            <div className="h-5 animate-pulse rounded-sm bg-neutral-100" />
            <div className="h-4 animate-pulse rounded-sm bg-neutral-100" />
            <div className="h-6 animate-pulse rounded-full bg-neutral-100" />
            <div className="h-4 animate-pulse rounded-sm bg-neutral-100" />
            <div className="size-8 animate-pulse rounded-md bg-neutral-100" />
          </div>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-surface min-h-34 rounded-xl border p-4 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-20 animate-pulse rounded-sm bg-neutral-100" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-100" />
              </div>

              <div className="space-y-2">
                <div className="h-5 w-3/4 animate-pulse rounded-sm bg-neutral-100" />
                <div className="h-4 w-28 animate-pulse rounded-sm bg-neutral-100" />
              </div>

              <div className="border-separator flex items-center justify-between border-t pt-3">
                <div className="h-4 w-24 animate-pulse rounded-sm bg-neutral-100" />
                <div className="h-4 w-16 animate-pulse rounded-sm bg-neutral-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsClientFallback;
