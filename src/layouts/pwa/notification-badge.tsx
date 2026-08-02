import { cn } from '@/utils';

type NotificationBadgeProps = {
  count: number;
  className?: string;
};

export const getNotificationBadgeLabel = (count: number) => {
  return count > 99 ? '99+' : String(count);
};

const NotificationBadge = ({ count, className }: NotificationBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={cn(
        'bg-danger text-danger-foreground border-surface text-badge absolute flex min-w-5 items-center justify-center rounded-full border-2 px-1',
        className,
      )}
    >
      {getNotificationBadgeLabel(count)}
    </span>
  );
};

export default NotificationBadge;
