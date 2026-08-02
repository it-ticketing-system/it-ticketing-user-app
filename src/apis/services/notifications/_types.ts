import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { INotification, NotificationTab } from '@/models';

export interface GetNotificationsRequest {
  tab?: NotificationTab;
  page?: number;
  perPage?: number;
}

export type GetNotificationsResponse = PaginatedResult<INotification>;

export interface MarkNotificationReadResult {
  id: string;
  isRead: boolean;
  readAt: string;
}

export interface MarkAllNotificationsReadResult {
  updatedCount: number;
  message: string;
}
