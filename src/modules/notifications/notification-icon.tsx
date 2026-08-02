import {
  Building2,
  Info,
  Mail,
  MessageCircle,
  RefreshCw,
  Ticket,
  UserRoundCheck,
} from 'lucide-react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';
import type { NotificationType } from '@/models';
import type { LucideIcon } from 'lucide-react';

const NOTIFICATION_ICON_CONFIG = {
  newTicketCreated: {
    icon: Ticket,
    className: 'bg-info-50 text-info-600',
  },
  ticketAssigned: {
    icon: UserRoundCheck,
    className: 'bg-primary-50 text-primary-600',
  },
  ticketReassigned: {
    icon: UserRoundCheck,
    className: 'bg-primary-50 text-primary-600',
  },
  ticketDepartmentChanged: {
    icon: Building2,
    className: 'bg-warning-50 text-warning-600',
  },
  newMessage: {
    icon: MessageCircle,
    className: 'bg-violet-50 text-violet-600',
  },
  ticketStatusChanged: {
    icon: RefreshCw,
    className: 'bg-warning-50 text-warning-600',
  },
  systemNotification: {
    icon: Info,
    className: 'bg-info-50 text-info-600',
  },
} as const satisfies Record<
  NotificationType,
  { icon: LucideIcon; className: string }
>;

interface NotificationIconProps {
  type: NotificationType;
  isRead: boolean;
}

const NotificationIcon = ({ type, isRead }: NotificationIconProps) => {
  const config = NOTIFICATION_ICON_CONFIG[type];
  const Icon = type === 'newMessage' ? Mail : config.icon;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl',
        isRead ? 'bg-neutral-100 text-neutral-500' : config.className,
      )}
    >
      <Icon className={ICON_SIZE_CLASS.md} />
    </span>
  );
};

export default NotificationIcon;
