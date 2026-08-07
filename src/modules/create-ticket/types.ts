import type { IDepartmentLookup } from '@/models';

export interface CreateTicketFormProps {
  departments: IDepartmentLookup[];
  cancelHref?: string;
}
