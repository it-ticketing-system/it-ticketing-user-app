import { Toast } from '@heroui/react';
import { LucideProvider } from 'lucide-react';
import { DEFAULT_ICON_SIZE, DEFAULT_ICON_STROKE_WIDTH } from '@/constants';
import IntlProvider from './intl-provider';
import ReactQueryProvider from './react-query-provider';

const AppProviders: FCC = ({ children }) => {
  return (
    <IntlProvider>
      <ReactQueryProvider>
        <LucideProvider
          size={DEFAULT_ICON_SIZE}
          strokeWidth={DEFAULT_ICON_STROKE_WIDTH}
        >
          <Toast.Provider
            maxVisibleToasts={3}
            placement="top end"
            className="rtl z-100 text-right [direction:rtl]"
          />

          {children}
        </LucideProvider>
      </ReactQueryProvider>
    </IntlProvider>
  );
};

export default AppProviders;
