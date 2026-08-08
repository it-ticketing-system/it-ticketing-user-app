import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TicketDetailsModule } from '@/modules';
import { getTicketDetailsInitialData } from '@/modules/ticket-details/ticket-details.server';

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
