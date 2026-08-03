import { cn } from '@/utils';

interface OnlineOnlyNoticeProps {
  children: string;
  className?: string;
}

const OnlineOnlyNotice = ({ children, className }: OnlineOnlyNoticeProps) => {
  return (
    <p
      role="status"
      className={cn(
        'border-warning bg-warning-soft text-warning-soft-foreground text-body-sm rounded-lg border px-3 py-2',
        className,
      )}
    >
      {children}
    </p>
  );
};

export default OnlineOnlyNotice;
