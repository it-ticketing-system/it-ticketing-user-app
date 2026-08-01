import { Toast } from '@heroui/react';
import IntlProvider from './IntlProvider';
import ReactQueryProvider from './react-query-provider';

const Providers: FCC = ({ children }) => {
  return (
    <IntlProvider>
      <ReactQueryProvider>
        <Toast.Provider
          maxVisibleToasts={3}
          placement="top end"
          className="rtl z-100 text-right [direction:rtl]"
        />

        {children}
      </ReactQueryProvider>
    </IntlProvider>
  );
};

export default Providers;
