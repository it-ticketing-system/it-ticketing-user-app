import TicketDetailsContent from './ticket-details-content';
import type { TicketDetailsModuleProps } from './types';

const TicketDetailsModule = ({ initialData }: TicketDetailsModuleProps) => {
  return (
    <section dir="rtl" className="flex min-h-0 w-full flex-1 pb-6 lg:pb-8">
      <TicketDetailsContent initialData={initialData} />
    </section>
  );
};

export default TicketDetailsModule;
