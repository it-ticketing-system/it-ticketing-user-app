import AuthProvider from '@/providers/auth-provider';

const Layout: FCC = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
export default Layout;
