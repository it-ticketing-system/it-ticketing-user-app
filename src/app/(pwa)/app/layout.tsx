import { PWAProvider } from '@/providers';

const Layout: FCC = ({ children }) => {
  return <PWAProvider>{children}</PWAProvider>;
};

export default Layout;
