'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createPushServices } from './_services';

export const clientPushServices = createPushServices(clientApiRequest);

export type {
  CreatePushSubscriptionRequest,
  PushConfigResponse,
  PushSubscriptionActionResult,
  PushSubscriptionResponse,
  UnsubscribeCurrentBrowserRequest,
} from './_types';
