import { Bell, Tickets, UserRound } from 'lucide-react';
import { ROUTES } from '@/constants';

export const PWA_SHELL_CONTAINER_CLASS =
  'mx-auto w-full max-w-[90rem] px-4 sm:px-5 md:px-6 lg:px-8';
export const PWA_HEADER_HEIGHT_CLASS = 'h-16 lg:h-18';
export const PWA_CONTENT_SPACING_CLASS = 'pt-4 lg:pt-6';
export const PWA_CONTENT_MIN_HEIGHT_CLASS =
  'min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-4.5rem)]';

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
