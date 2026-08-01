import { getRequestConfig } from 'next-intl/server';
import auth from '../../messages/fa/auth.json';
import common from '../../messages/fa/common.json';
import createTicket from '../../messages/fa/create-ticket.json';
import footer from '../../messages/fa/footer.json';
import header from '../../messages/fa/header.json';
import home from '../../messages/fa/home.json';
import main_layout from '../../messages/fa/main-layout.json';
import pageHeader from '../../messages/fa/page-header.json';
import pwa_layout from '../../messages/fa/pwa-layout.json';
import ticketDetails from '../../messages/fa/ticket-details.json';
import tickets from '../../messages/fa/tickets.json';

export default getRequestConfig(async () => {
  return {
    locale: 'fa',

    messages: {
      main_layout,
      header,
      home,
      footer,
      auth,
      common,
      pageHeader,
      pwa_layout,
      tickets,
      createTicket,
      ticketDetails,
    },
  };
});
