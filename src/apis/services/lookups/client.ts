'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createLookupServices } from './_services';

export const clientLookupServices = createLookupServices(clientApiRequest);
