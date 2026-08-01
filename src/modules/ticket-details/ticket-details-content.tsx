'use client';

import { useQuery } from '@tanstack/react-query';
import { clientTicketServices } from '@/apis/services/tickets/client';
import { QUERY_KEYS } from '@/constants';
import TicketConversation from './ticket-conversation';
import TicketInfoCard from './ticket-info-card';
import type { TicketDetailsInitialData } from './types';

interface TicketDetailsContentProps {
  initialData: TicketDetailsInitialData;
}

const TicketDetailsContent = ({ initialData }: TicketDetailsContentProps) => {
  const { data } = useQuery({
    queryKey: QUERY_KEYS.tickets.details(initialData.ticket.id),
    queryFn: () => clientTicketServices.getTicketDetails(initialData.ticket.id),
    initialData,
    staleTime: 30_000,
  });

  const { ticket, messages } = data;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:gap-6">
      <TicketInfoCard ticket={ticket} />

      <TicketConversation
        ticketId={ticket.id}
        messages={messages}
        status={ticket.status}
      />
    </div>
  );
};

export default TicketDetailsContent;
