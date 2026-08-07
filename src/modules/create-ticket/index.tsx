import { ROUTES } from '@/constants';
import CreateTicketForm from './create-ticket-form';
import { getCreateTicketInitialData } from './create-ticket.server';

const CreateTicketModule = async () => {
  const { departments } = await getCreateTicketInitialData();

  return (
    <section className="flex min-h-0 w-full flex-1">
      <CreateTicketForm departments={departments} cancelHref={ROUTES.tickets} />
    </section>
  );
};

export default CreateTicketModule;
