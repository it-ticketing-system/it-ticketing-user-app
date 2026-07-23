import { Bell, Tickets, UserRound } from 'lucide-react';
import { ROUTES } from '@/constants';

export const navigationItems = [
  {
    key: 'tickets',
    label: 'tickets',
    href: ROUTES.tickets,
    icon: Tickets,
  },
  {
    key: 'notifications',
    label: 'notifications',
    href: ROUTES.notifications,
    icon: Bell,
  },
  {
    key: 'profile',
    label: 'profile',
    href: ROUTES.profile,
    icon: UserRound,
  },
] as const;

export const isRouteActive = (href: string, pathname: string) => {
  return pathname === href || pathname.startsWith(`${href}/`);
};
