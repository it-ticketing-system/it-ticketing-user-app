import 'server-only';

import { notFound } from 'next/navigation';
import { normalizeApiError } from '@/apis/core/api-error';
import { serverTicketServices } from '@/apis/services/tickets/server';

const normalizeTicketId = (value: string): string => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    notFound();
  }

  return normalizedValue;
};

export const getTicketDetailsInitialData = async (rawTicketId: string) => {
  const ticketId = normalizeTicketId(rawTicketId);

  return serverTicketServices.getTicketDetails(ticketId).catch((error) => {
    const apiError = normalizeApiError(error);

    if (apiError.code === 'TICKET_NOT_FOUND' || apiError.status === 404) {
      notFound();
    }

    throw error;
  });
};
