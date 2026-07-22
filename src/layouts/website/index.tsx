import WebsiteFooter from './website-footer';
import WebsiteHeader from './website-header';

const WebsiteLayout: FCC = ({ children }) => {
  return (
    <div>
      <WebsiteHeader />
      <main>{children}</main>
      <WebsiteFooter />
    </div>
  );
};

export default WebsiteLayout;
