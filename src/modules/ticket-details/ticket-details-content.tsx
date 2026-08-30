'use client';

import { clientTicketServices } from '@/apis/services/tickets/client';
import { QUERY_KEYS } from '@/constants';
import { useGetRequest } from '@/hooks';
import TicketConversation from './ticket-conversation';
import TicketInfoCard from './ticket-info-card';
import type { TicketDetailsInitialData } from './types';

interface TicketDetailsContentProps {
  ticketId: string;
  initialData: TicketDetailsInitialData;
}

const TicketDetailsContent = ({
  ticketId,
  initialData,
}: TicketDetailsContentProps) => {
  const { data } = useGetRequest({
    queryKey: QUERY_KEYS.tickets.details(ticketId),
    requestFn: () => clientTicketServices.getTicketDetails(ticketId),
    initialData,
    showErrorToast: false,
    staleTime: 30_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const { ticket, messages } = data ?? initialData;

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
