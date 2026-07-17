import main_layout from './messages/fa/main-layout.json';
import home from './messages/fa/home.json';

type Messages = {
  main_layout: typeof main_layout;
  home: typeof home;
};

declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
