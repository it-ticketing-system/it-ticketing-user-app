import { cn } from '@/utils';

type NotificationBadgeProps = {
  count: number;
  className?: string;
};

export const getNotificationBadgeLabel = (count: number) => {
  return count > 99 ? '۹۹+' : new Intl.NumberFormat('fa-IR').format(count);
};

const NotificationBadge = ({ count, className }: NotificationBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className={cn(
        'bg-danger text-badge border-surface absolute flex min-w-5 items-center justify-center rounded-full border-2 px-1 text-white',
        className,
      )}
    >
      {getNotificationBadgeLabel(count)}
    </span>
  );
};

export default NotificationBadge;
