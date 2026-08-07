import { serverApiRequest } from '@/apis/core/server/api-request';
import { createLookupServices } from './_services';

export const serverLookupServices = createLookupServices(serverApiRequest);
