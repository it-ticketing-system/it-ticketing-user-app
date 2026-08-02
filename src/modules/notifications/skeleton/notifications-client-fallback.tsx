import NotificationsTableModeFallback from './notifications-table-mode-fallback';

const NotificationsClientFallback = () => {
  return (
    <div aria-hidden="true" className="space-y-4 lg:space-y-6">
      <div className="border-border bg-surface rounded-xl border p-3 shadow-sm lg:p-4">
        <div className="-mx-1 flex gap-2 overflow-hidden px-1 pb-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:p-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-neutral-100"
            />
          ))}
        </div>
      </div>

      <NotificationsTableModeFallback />
    </div>
  );
};

export default NotificationsClientFallback;
