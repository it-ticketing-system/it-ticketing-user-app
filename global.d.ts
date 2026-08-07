import { FC, PropsWithChildren } from 'react';
import auth from './messages/fa/auth.json';
import common from './messages/fa/common.json';
import createTicket from './messages/fa/createTicket.json';
import footer from './messages/fa/footer.json';
import header from './messages/fa/header.json';
import home from './messages/fa/home.json';
import mainLayout from './messages/fa/mainLayout.json';
import notifications from './messages/fa/notifications.json';
import offline from './messages/fa/offline.json';
import pageHeader from './messages/fa/pageHeader.json';
import profile from './messages/fa/profile.json';
import pwa from './messages/fa/pwa.json';
import pwaLayout from './messages/fa/pwaLayout.json';
import ticketDetails from './messages/fa/ticketDetails.json';
import tickets from './messages/fa/tickets.json';

type Messages = {
  mainLayout: typeof mainLayout;
  notifications: typeof notifications;
  pwaLayout: typeof pwaLayout;
  header: typeof header;
  home: typeof home;
  footer: typeof footer;
  common: typeof common;
  offline: typeof offline;
  pageHeader: typeof pageHeader;
  profile: typeof profile;
  pwa: typeof pwa;
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
  type PageQueryValue = string | string[] | undefined;
  type SelectOption<T = string> = {
    value: T;
    label: string;
  };
}
