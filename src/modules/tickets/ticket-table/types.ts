import type { ApiRequestError } from '@/apis/core/api-error';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ITicket } from '@/models';
import type { ReactNode } from 'react';

export type TicketTableItem = ITicket;

export type TicketTableData = PaginatedResult<TicketTableItem>;

export interface TicketsTableViewProps extends TicketTableData {
  error?: ApiRequestError | null;

  isLoading?: boolean;
  isPending?: boolean;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
}

export interface TicketsTableProps {
  data: TicketTableData;

  error?: ApiRequestError | null;

  topContent?: ReactNode;

  isLoading?: boolean;
  isPending?: boolean;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
}
