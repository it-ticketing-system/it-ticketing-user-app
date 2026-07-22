import { FC, PropsWithChildren } from 'react';
import common from './messages/fa/common.json';
import footer from './messages/fa/footer.json';
import header from './messages/fa/header.json';
import home from './messages/fa/home.json';
import main_layout from './messages/fa/main-layout.json';

type Messages = {
  main_layout: typeof main_layout;
  header: typeof header;
  home: typeof home;
  footer: typeof footer;
  common: typeof common;
};

declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
declare global {
  type FCC<P = object> = FC<PropsWithChildren<P>>;
}
