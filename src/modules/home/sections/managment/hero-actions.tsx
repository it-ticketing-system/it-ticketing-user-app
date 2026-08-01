import { Button } from '@heroui/react';
import { PhoneIcon, PlusIcon } from 'lucide-react';
import { ICON_SIZE_CLASS } from '@/constants';

type HeroActionsProps = {
  newTicketLabel: string;
  contactUsLabel: string;
};

const HeroActions = ({ newTicketLabel, contactUsLabel }: HeroActionsProps) => {
  return (
    <div className="col-start-1 row-start-3 flex w-full max-w-sm shrink-0 flex-col gap-2 lg:row-start-2 lg:max-w-md lg:flex-row lg:gap-3">
      <Button fullWidth className="h-10 lg:h-12">
        {newTicketLabel}
        <PlusIcon className={ICON_SIZE_CLASS.md} />
      </Button>

      <Button fullWidth variant="outline" className="h-10 lg:h-12">
        {contactUsLabel}
        <PhoneIcon className={ICON_SIZE_CLASS.md} />
      </Button>
    </div>
  );
};

export default HeroActions;
