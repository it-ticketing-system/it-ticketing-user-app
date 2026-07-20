import { getRequestConfig } from 'next-intl/server';

import main_layout from '../../messages/fa/main-layout.json';
import header from '../../messages/fa/header.json';
import home from '../../messages/fa/home.json';
import footer from '../../messages/fa/footer.json';

export default getRequestConfig(async () => {
  return {
    locale: 'fa',

    messages: {
      main_layout,
      header,
      home,
      footer,
    },
  };
});
