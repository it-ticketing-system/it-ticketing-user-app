import { FC } from 'react';
import WebsiteHeader from './website-header';
import WebsiteFooter from './website-footer';

const WebsiteLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <WebsiteHeader />
      <main>{children}</main>
      <WebsiteFooter />
    </div>
  );
};

export default WebsiteLayout;
