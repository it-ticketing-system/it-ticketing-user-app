import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginModule } from '@/modules';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.login');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function Login() {
  return <LoginModule />;
}
