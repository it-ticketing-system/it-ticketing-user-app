import {
  type ApiPaginatedRequestFunction,
  type ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import { NOTIFICATION_ENDPOINTS } from './_endpoints';
import {
  toGetNotificationsRequestDto,
  toMarkNotificationReadResult,
  toNotification,
} from './_mappers';
import type {
  GetNotificationsRequestDto,
  MarkAllNotificationsReadResponseDto,
  MarkNotificationReadResponseDto,
  NotificationDto,
} from './_dto';
import type {
  GetNotificationsRequest,
  GetNotificationsResponse,
  MarkAllNotificationsReadResult,
  MarkNotificationReadResult,
} from './_types';

export function createNotificationServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getNotifications(
    params: GetNotificationsRequest,
    signal?: AbortSignal,
  ): Promise<GetNotificationsResponse> {
    const response = await paginatedRequest<
      NotificationDto,
      GetNotificationsRequestDto
    >({
      url: NOTIFICATION_ENDPOINTS.list,
      method: 'GET',
      params: toGetNotificationsRequestDto(params),
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: response.items.map(toNotification),
      meta: response.meta,
    };
  }

  async function markNotificationAsRead(
    notificationId: string,
  ): Promise<MarkNotificationReadResult> {
    const response = await request<
      MarkNotificationReadResponseDto,
      Record<string, never>
    >({
      url: NOTIFICATION_ENDPOINTS.markRead(notificationId),
      method: 'PATCH',
      data: {},
      meta: {
        auth: 'required',
      },
    });

    return toMarkNotificationReadResult(response);
  }

  async function markAllNotificationsAsRead(): Promise<MarkAllNotificationsReadResult> {
    return request<MarkAllNotificationsReadResponseDto, Record<string, never>>({
      url: NOTIFICATION_ENDPOINTS.markAllRead,
      method: 'PATCH',
      data: {},
      meta: {
        auth: 'required',
      },
    });
  }

  async function getUnreadNotificationsCount(
    signal?: AbortSignal,
  ): Promise<number> {
    const response = await getNotifications(
      {
        tab: 'unread',
        page: 1,
        perPage: 1,
      },
      signal,
    );

    return response.meta.total;
  }

  return {
    getNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
}
