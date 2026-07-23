import { PWALayout } from '@/layouts';
import AuthProvider from '@/providers/auth-provider';

const Layout: FCC = ({ children }) => {
  return (
    <AuthProvider>
      <PWALayout>{children}</PWALayout>
    </AuthProvider>
  );
};

export default Layout;
