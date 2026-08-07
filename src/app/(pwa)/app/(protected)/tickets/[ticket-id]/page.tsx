import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getTicketDetailsInitialData, TicketDetailsModule } from '@/modules';

type TicketDetailsPageProps = {
  params: Promise<{
    'ticket-id': string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ticketDetails.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = async ({ params }: TicketDetailsPageProps) => {
  const { 'ticket-id': rawTicketId } = await params;
  const ticketDetails = await getTicketDetailsInitialData(rawTicketId);

  return (
    <TicketDetailsModule ticketId={rawTicketId} initialData={ticketDetails} />
  );
};

export default Page;
