import { FC, PropsWithChildren } from 'react';
import auth from './messages/fa/auth.json';
import common from './messages/fa/common.json';
import createTicket from './messages/fa/create-ticket.json';
import footer from './messages/fa/footer.json';
import header from './messages/fa/header.json';
import home from './messages/fa/home.json';
import main_layout from './messages/fa/main-layout.json';
import pageHeader from './messages/fa/page-header.json';
import pwa_layout from './messages/fa/pwa-layout.json';
import ticketDetails from './messages/fa/ticket-details.json';
import tickets from './messages/fa/tickets.json';

type Messages = {
  main_layout: typeof main_layout;
  pwa_layout: typeof pwa_layout;
  header: typeof header;
  home: typeof home;
  footer: typeof footer;
  common: typeof common;
  pageHeader: typeof pageHeader;
  auth: typeof auth;
  tickets: typeof tickets;
  createTicket: typeof createTicket;
  ticketDetails: typeof ticketDetails;
};

declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
declare global {
  type FCC<P = object> = FC<PropsWithChildren<P>>;
  type UserRole = 'USER' | 'SUPPORT' | 'ADMIN';
  type PageQueryValue = string | string[] | undefined;
  type SelectOption<T = string> = {
    value: T;
    label: string;
  };
}
