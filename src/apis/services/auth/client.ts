'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createAuthServices } from './_services';

export const clientAuthServices = createAuthServices(clientApiRequest);

export type {
  ChangePasswordRequest,
  ChangePasswordResult,
  LoginResult,
  RegisterRequest,
  RegisterResult,
  UpdateProfileRequest,
  UpdateProfileResult,
} from './_types';
