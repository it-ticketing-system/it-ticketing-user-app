import { Card } from '@heroui/react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: 'accent' | 'danger';
}

const SectionHeader = ({
  title,
  description,
  icon: Icon,
  tone = 'accent',
}: SectionHeaderProps) => {
  const iconClassName =
    tone === 'danger'
      ? 'bg-danger-soft text-danger-soft-foreground'
      : 'bg-accent-soft text-accent-soft-foreground';

  return (
    <Card.Header className="flex-row items-start gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-md',
          iconClassName,
        )}
      >
        <Icon className={ICON_SIZE_CLASS.md} />
      </span>

      <div className="min-w-0 space-y-1">
        <Card.Title className="text-title text-foreground">{title}</Card.Title>

        <Card.Description className="text-caption text-muted">
          {description}
        </Card.Description>
      </div>
    </Card.Header>
  );
};

export default SectionHeader;
