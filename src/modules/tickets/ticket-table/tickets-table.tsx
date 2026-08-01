'use client';

import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks';
import TicketsTableModeFallback from '../skeleton/tickets-table-mode-fallback';
import type { TicketsTableProps } from './types';

type TicketsTableMode = 'desktop' | 'mobile';

const TicketsDesktopTable = dynamic(() => import('./tickets-desktop-table'), {
  ssr: false,
  loading: () => <TicketsTableModeFallback />,
});

const MobileTicketsList = dynamic(() => import('../mobile-tickets-list'), {
  ssr: false,
  loading: () => <TicketsTableModeFallback />,
});

const TicketsTable = ({
  data,
  error = null,
  topContent,
  isLoading = false,
  isPending = false,
  onPageChange,
  onRetry,
}: TicketsTableProps) => {
  const { isDesktop } = useMediaQuery();
  const mode: TicketsTableMode | null =
    isDesktop === null ? null : isDesktop ? 'desktop' : 'mobile';

  const viewProps = {
    items: data.items,
    meta: data.meta,
    error,
    isLoading,
    isPending,
    onPageChange,
    onRetry,
  };

  return (
    <section className="space-y-6">
      {topContent}
      {mode === null && <TicketsTableModeFallback />}
      {mode === 'desktop' && <TicketsDesktopTable {...viewProps} />}
      {mode === 'mobile' && <MobileTicketsList {...viewProps} />}
    </section>
  );
};

export default TicketsTable;
