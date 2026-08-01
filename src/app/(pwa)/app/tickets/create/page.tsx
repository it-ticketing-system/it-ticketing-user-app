import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CreateTicketModule } from '@/modules';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('createTicket.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => {
  return <CreateTicketModule />;
};
export default Page;
