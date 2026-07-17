import { NextIntlClientProvider } from 'next-intl';
import React, { FC } from 'react';

const IntlProvider: FC<{ children: React.ReactNode }> = ({ children }) => {


    
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
};

export default IntlProvider;
