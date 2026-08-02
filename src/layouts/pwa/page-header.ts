import { ChevronLeft, Plus } from 'lucide-react';
import { ROUTES } from '@/constants';
import type { ButtonVariants } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';

export type PwaPageHeaderMessageKey =
  | 'tickets'
  | 'createTicket'
  | 'ticketDetails'
  | 'notifications'
  | 'profile';

export type PwaPageHeaderActionConfig = {
  href: string;
  icon: LucideIcon;
  size?: ButtonVariants['size'];
  variant?: ButtonVariants['variant'];
};

export type PwaPageHeaderConfig = {
  messageKey: PwaPageHeaderMessageKey;
  action?: PwaPageHeaderActionConfig;
  match: (pathname: string) => boolean;
};

export const pwaPageHeaderRoutes: readonly PwaPageHeaderConfig[] = [
  {
    messageKey: 'createTicket',
    match: (pathname) => pathname === ROUTES.createTicket,
    action: {
      href: ROUTES.tickets,
      icon: ChevronLeft,
      size: 'md',
      variant: 'outline',
    },
  },
  {
    messageKey: 'ticketDetails',
    match: (pathname) =>
      pathname.startsWith(`${ROUTES.tickets}/`) &&
      pathname !== ROUTES.createTicket,
    action: {
      href: ROUTES.tickets,
      icon: ChevronLeft,
      size: 'md',
      variant: 'outline',
    },
  },
  {
    messageKey: 'tickets',
    match: (pathname) => pathname === ROUTES.tickets,
    action: {
      href: ROUTES.createTicket,
      icon: Plus,
      size: 'md',
      variant: 'primary',
    },
  },
  {
    messageKey: 'notifications',
    match: (pathname) => pathname === ROUTES.notifications,
  },
  {
    messageKey: 'profile',
    match: (pathname) => pathname === ROUTES.profile,
  },
] as const;

export const getPwaPageHeaderConfig = (pathname: string) => {
  return pwaPageHeaderRoutes.find((item) => item.match(pathname));
};
