import { getTranslations } from 'next-intl/server';
import { NotificationsModule, type NotificationsSearchParams } from '@/modules';
import type { Metadata } from 'next';

type NotificationsPageProps = {
  searchParams: Promise<NotificationsSearchParams>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('notifications.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
};

const NotificationsPage = ({ searchParams }: NotificationsPageProps) => {
  return <NotificationsModule searchParams={searchParams} />;
};

export default NotificationsPage;
