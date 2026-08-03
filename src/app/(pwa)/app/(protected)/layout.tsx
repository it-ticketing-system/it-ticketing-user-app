import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, ROUTES } from '@/constants';
import { PWALayout } from '@/layouts';
import { AuthProvider } from '@/providers';

const Layout: FCC = async ({ children }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    redirect(ROUTES.login);
  }

  return (
    <AuthProvider>
      <PWALayout>{children}</PWALayout>
    </AuthProvider>
  );
};

export default Layout;
