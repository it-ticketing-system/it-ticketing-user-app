import { Card, Skeleton } from '@heroui/react';

const ProfileSkeleton = () => {
  return (
    <section
      aria-busy="true"
      className="grid w-full flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start lg:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
        <Card className="border-border bg-surface overflow-hidden rounded-xl border shadow-sm">
          <Card.Content className="space-y-5 p-4 lg:p-6">
            <div className="bg-primary-50 border-border rounded-xl border p-4 md:p-5">
              <div className="grid min-w-0 grid-cols-1 items-center gap-4 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-5">
                <Skeleton className="mx-auto size-28 max-w-full shrink-0 rounded-xl md:mx-0" />

                <div className="flex min-w-0 flex-col gap-3">
                  <div className="w-full space-y-3">
                    <Skeleton className="mx-auto h-5 w-36 rounded-md md:mx-0" />
                    <Skeleton className="mx-auto h-4 w-28 rounded-md md:mx-0" />
                    <Skeleton className="mx-auto h-4 w-24 rounded-md md:mx-0" />
                  </div>

                  <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto">
                    <Skeleton className="h-10 min-w-0 rounded-md sm:w-36" />
                    <Skeleton className="size-10 shrink-0 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Skeleton className="h-16 rounded-md" />
              <Skeleton className="h-16 rounded-md" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>

            <Skeleton className="h-11 w-full rounded-md lg:ms-auto lg:w-36" />
          </Card.Content>
        </Card>

        <Card className="border-border bg-surface rounded-xl border shadow-sm">
          <Card.Content className="space-y-5 p-4 lg:p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Skeleton className="h-16 rounded-md" />
              <Skeleton className="h-16 rounded-md" />
              <Skeleton className="h-16 rounded-md lg:col-span-2" />
            </div>
          </Card.Content>
        </Card>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:gap-6">
        <Card className="border-border bg-surface rounded-xl border shadow-sm">
          <Card.Content className="p-4 lg:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <Skeleton className="size-10 shrink-0 rounded-md" />

                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>

              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </Card.Content>
        </Card>
      </aside>
    </section>
  );
};

export default ProfileSkeleton;
