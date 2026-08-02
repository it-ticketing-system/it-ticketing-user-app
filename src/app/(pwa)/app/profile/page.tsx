import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProfileModule } from '@/modules';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('profile.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => {
  return <ProfileModule />;
};

export default Page;
