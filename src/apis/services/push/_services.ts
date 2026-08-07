import { PUSH_ENDPOINTS } from './_endpoints';
import type {
  CreatePushSubscriptionRequestDto,
  PushConfigResponseDto,
  PushSubscriptionActionResponseDto,
  PushSubscriptionResponseDto,
  UnsubscribeCurrentBrowserRequestDto,
} from './_dto';
import type {
  CreatePushSubscriptionRequest,
  PushConfigResponse,
  PushSubscriptionActionResult,
  PushSubscriptionResponse,
  UnsubscribeCurrentBrowserRequest,
} from './_types';
import type { ApiRequestFunction } from '@/apis/core/types/api-request.types';

export function createPushServices(request: ApiRequestFunction) {
  async function getConfig(signal?: AbortSignal): Promise<PushConfigResponse> {
    return request<PushConfigResponseDto>({
      url: PUSH_ENDPOINTS.config,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });
  }

  async function createOrUpdateSubscription(
    payload: CreatePushSubscriptionRequest,
  ): Promise<PushSubscriptionResponse> {
    return request<
      PushSubscriptionResponseDto,
      CreatePushSubscriptionRequestDto
    >({
      url: PUSH_ENDPOINTS.subscriptions,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });
  }

  async function unsubscribeCurrentBrowser(
    payload: UnsubscribeCurrentBrowserRequest,
  ): Promise<PushSubscriptionActionResult> {
    return request<
      PushSubscriptionActionResponseDto,
      UnsubscribeCurrentBrowserRequestDto
    >({
      url: PUSH_ENDPOINTS.unsubscribeCurrentBrowser,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
        skipUnauthorizedRedirect: true,
      },
    });
  }

  return {
    getConfig,
    createOrUpdateSubscription,
    unsubscribeCurrentBrowser,
  };
}
