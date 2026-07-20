import { Button } from '@heroui/react';
import { PhoneIcon, PlusIcon } from 'lucide-react';

type HeroActionsProps = {
  newTicketLabel: string;
  contactUsLabel: string;
};

const HeroActions = ({ newTicketLabel, contactUsLabel }: HeroActionsProps) => {
  return (
    <div className="col-start-1 row-start-3 flex w-full max-w-sm shrink-0 flex-col gap-2 lg:row-start-2 lg:max-w-md lg:flex-row lg:gap-3">
      <Button fullWidth className="h-10 lg:h-12">
        {newTicketLabel}
        <PlusIcon size={20} />
      </Button>

      <Button fullWidth variant="outline" className="h-10 lg:h-12">
        {contactUsLabel}
        <PhoneIcon size={20} />
      </Button>
    </div>
  );
};

export default HeroActions;
