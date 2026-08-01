'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createAuthServices } from './_services';

export const clientAuthServices = createAuthServices(clientApiRequest);

export type {
  GetMeResponse,
  LoginRequest,
  LoginResult,
  LogoutResult,
  RegisterRequest,
  RegisterResult,
} from './_types';
