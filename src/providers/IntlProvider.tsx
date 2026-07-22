import { NextIntlClientProvider } from 'next-intl';

const IntlProvider: FCC = ({ children }) => {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
};

export default IntlProvider;
