import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RegisterModule } from '@/modules';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.register');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function Register() {
  return <RegisterModule />;
}
