'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createFileServices } from './_services';

export const clientFileServices = createFileServices(clientApiRequest);
