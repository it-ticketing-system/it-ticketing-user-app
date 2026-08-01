import TicketDetailsContent from './ticket-details-content';
import type { TicketDetailsModuleProps } from './types';

const TicketDetailsModule = ({ initialData }: TicketDetailsModuleProps) => {
  return (
    <section
      dir="rtl"
      className="flex h-[calc(100dvh-9rem-env(safe-area-inset-bottom))] min-h-0 w-full flex-1 overflow-hidden lg:h-[calc(100dvh-6rem)]"
    >
      <TicketDetailsContent initialData={initialData} />
    </section>
  );
};

export default TicketDetailsModule;
