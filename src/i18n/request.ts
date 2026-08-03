import { getRequestConfig } from 'next-intl/server';
import auth from '../../messages/fa/auth.json';
import common from '../../messages/fa/common.json';
import createTicket from '../../messages/fa/createTicket.json';
import footer from '../../messages/fa/footer.json';
import header from '../../messages/fa/header.json';
import home from '../../messages/fa/home.json';
import mainLayout from '../../messages/fa/mainLayout.json';
import notifications from '../../messages/fa/notifications.json';
import offline from '../../messages/fa/offline.json';
import pageHeader from '../../messages/fa/pageHeader.json';
import profile from '../../messages/fa/profile.json';
import pwa from '../../messages/fa/pwa.json';
import pwaLayout from '../../messages/fa/pwaLayout.json';
import ticketDetails from '../../messages/fa/ticketDetails.json';
import tickets from '../../messages/fa/tickets.json';

export default getRequestConfig(async () => {
  return {
    locale: 'fa',

    messages: {
      mainLayout,
      notifications,
      header,
      home,
      footer,
      auth,
      common,
      offline,
      pageHeader,
      profile,
      pwa,
      pwaLayout,
      tickets,
      createTicket,
      ticketDetails,
    },
  };
});
