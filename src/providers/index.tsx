import { Toast } from '@heroui/react';
import IntlProvider from './IntlProvider';

const Providers: FCC = ({ children }) => {
  return (
    <IntlProvider>
      <Toast.Provider
        maxVisibleToasts={3}
        placement="top end"
        className="rtl text-right [direction:rtl]"
      />

      {children}
    </IntlProvider>
  );
};

export default Providers;
