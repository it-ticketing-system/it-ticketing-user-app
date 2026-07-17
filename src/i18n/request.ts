import { getRequestConfig } from 'next-intl/server';

import main_layout from '../../messages/fa/main-layout.json';
import home from '../../messages/fa/home.json';

export default getRequestConfig(async () => {
  return {
    locale: 'fa',

    messages: {
      main_layout,
      home,
    },
  };
});
