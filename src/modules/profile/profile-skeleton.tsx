import { Card, Skeleton } from '@heroui/react';

const ProfileSkeleton = () => {
  return (
    <section
      aria-busy="true"
      className="grid w-full flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start lg:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
        <Card className="border-border bg-surface overflow-hidden rounded-xl border shadow-sm">
          <Card.Content className="space-y-5">
            <div className="border-border bg-surface relative overflow-hidden rounded-xl border p-4 shadow-sm lg:p-5">
              <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                <Skeleton className="size-20 shrink-0 rounded-xl lg:size-24 lg:size-28" />

                <div className="min-w-0 flex-1 space-y-2 text-start">
                  <Skeleton className="h-6 w-36 rounded-md lg:w-44" />
                  <Skeleton className="h-4 w-28 rounded-md lg:w-36" />
                  <Skeleton className="mt-2 hidden h-3.5 w-48 rounded-md lg:block" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border bg-surface space-y-2 rounded-xl border p-3"
                >
                  <Skeleton className="h-3.5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-28 rounded-md" />
                </div>
              ))}
            </div>

            <div className="border-separator flex border-t pt-4">
              <Skeleton className="h-11 w-full rounded-md lg:ms-auto lg:w-32" />
            </div>
          </Card.Content>
        </Card>

        <Card className="border-border bg-surface rounded-xl border shadow-sm">
          <Card.Header className="flex-row items-start gap-3">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-4 w-60 rounded-md" />
            </div>
          </Card.Header>

          <Card.Content className="space-y-4">
            <div className="border-border bg-primary-50/50 flex flex-col gap-3 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="h-4 w-52 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-md lg:w-28 lg:shrink-0" />
            </div>

            <div className="border-border bg-primary-50/50 flex flex-col gap-3 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-md lg:w-28 lg:shrink-0" />
            </div>
          </Card.Content>
        </Card>

        <Card className="border-border bg-surface rounded-xl border shadow-sm">
          <Card.Header className="flex-row items-start gap-3">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-4 w-52 rounded-md" />
            </div>
          </Card.Header>

          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md lg:col-span-2" />
            </div>
          </Card.Content>
        </Card>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:gap-6">
        <Card className="border-border bg-surface rounded-xl border shadow-sm">
          <Card.Content className="gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <Skeleton className="size-10 shrink-0 rounded-md" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-11 w-full rounded-md" />
          </Card.Content>
        </Card>
      </aside>
    </section>
  );
};

export default ProfileSkeleton;
