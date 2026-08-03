import { getTranslations } from 'next-intl/server';
import { OfflineModule } from '@/modules';
import type { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('offline.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
};

const Page = () => {
  return <OfflineModule />;
};

export default Page;
