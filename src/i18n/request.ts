import { getRequestConfig } from 'next-intl/server';
import common from '../../messages/fa/common.json';
import footer from '../../messages/fa/footer.json';
import header from '../../messages/fa/header.json';
import home from '../../messages/fa/home.json';
import main_layout from '../../messages/fa/main-layout.json';

export default getRequestConfig(async () => {
  return {
    locale: 'fa',

    messages: {
      main_layout,
      header,
      home,
      footer,
      common,
    },
  };
});
