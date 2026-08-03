import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TicketsModule, type TicketsSearchParams } from '@/modules';

type TicketsPageProps = {
  searchParams: Promise<TicketsSearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('tickets.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = ({ searchParams }: TicketsPageProps) => {
  return <TicketsModule searchParams={searchParams} />;
};

export default Page;
