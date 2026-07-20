import main_layout from './messages/fa/main-layout.json';
import header from './messages/fa/header.json';
import home from './messages/fa/home.json';
import footer from './messages/fa/footer.json';

type Messages = {
  main_layout: typeof main_layout;
  header: typeof header;
  home: typeof home;
  footer: typeof footer;
};

declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
