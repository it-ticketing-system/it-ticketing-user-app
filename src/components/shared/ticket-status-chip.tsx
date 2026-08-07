import { Chip } from '@heroui/react';
import type { TicketStatus } from '@/models';

interface TicketStatusChipProps {
  status: TicketStatus;
  label: string;
}

interface TicketStatusStyle {
  chip: string;
  dot: string;
}

const STATUS_STYLES: Record<TicketStatus, TicketStatusStyle> = {
  open: {
    chip: 'border-info-200 bg-info-soft text-info-soft-foreground',
    dot: 'bg-info',
  },

  inProgress: {
    chip: 'border-warning-200 bg-warning-soft text-warning-soft-foreground',
    dot: 'bg-warning',
  },

  waitingUser: {
    chip: 'border-violet-200 bg-violet-50 text-violet-700',
    dot: 'bg-violet-500',
  },

  resolved: {
    chip: 'border-success-200 bg-success-soft text-success-soft-foreground',
    dot: 'bg-success',
  },

  closed: {
    chip: 'border-neutral-300 bg-neutral-100 text-neutral-600',
    dot: 'bg-neutral-400',
  },
};

const TicketStatusChip = ({ status, label }: TicketStatusChipProps) => {
  const styles = STATUS_STYLES[status];

  return (
    <Chip
      size="md"
      variant="secondary"
      className={`gap-1.5 rounded-sm border px-2.5 ${styles.chip}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${styles.dot}`}
      />

      <Chip.Label className="text-caption font-semibold">{label}</Chip.Label>
    </Chip>
  );
};

export default TicketStatusChip;
