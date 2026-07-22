'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createAuthServices } from './_services';

export const authServices = createAuthServices(clientApiRequest);

export type { LoginRequestDto, RegisterRequestDto } from './_dto';
