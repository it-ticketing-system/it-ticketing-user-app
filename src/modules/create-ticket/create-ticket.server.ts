import 'server-only';

import { serverLookupServices } from '@/apis/services/lookups/server';
import type { IDepartmentLookup } from '@/models';

type CreateTicketInitialData = {
  departments: IDepartmentLookup[];
};

export const getCreateTicketInitialData =
  async (): Promise<CreateTicketInitialData> => {
    const departments = await serverLookupServices
      .getDepartments()
      .catch((): IDepartmentLookup[] => []);

    return {
      departments,
    };
  };
