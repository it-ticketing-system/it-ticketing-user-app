import { WebsiteLayout } from '@/layouts';
import { FC } from 'react';

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WebsiteLayout>{children}</WebsiteLayout>;
};

export default Layout;
