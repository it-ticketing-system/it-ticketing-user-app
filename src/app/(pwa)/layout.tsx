import { PWALayout } from '@/layouts';
import { AuthProvider } from '@/providers';

const Layout: FCC = ({ children }) => {
  return (
    <AuthProvider>
      <PWALayout>{children}</PWALayout>
    </AuthProvider>
  );
};

export default Layout;
