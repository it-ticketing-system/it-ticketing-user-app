import { connection } from 'next/server';
import { Suspense } from 'react';
import TicketsClientFallback from './skeleton/tickets-client-fallback';
import TicketsClient from './tickets-client';
import { getTicketsInitialData } from './tickets.server';
import type { TicketsSearchParams } from './tickets-query';

type TicketsModuleProps = {
  searchParams: Promise<TicketsSearchParams>;
};

const TicketsModule = async ({ searchParams }: TicketsModuleProps) => {
  await connection();
  const ticketsInitialData = await getTicketsInitialData(await searchParams);

  return (
    <div>
      <Suspense fallback={<TicketsClientFallback />}>
        <TicketsClient {...ticketsInitialData} />
      </Suspense>
    </div>
  );
};

export default TicketsModule;
