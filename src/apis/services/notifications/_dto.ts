export type NotificationTypeDto =
  | 'NEW_TICKET_CREATED'
  | 'TICKET_ASSIGNED'
  | 'TICKET_REASSIGNED'
  | 'TICKET_DEPARTMENT_CHANGED'
  | 'NEW_MESSAGE'
  | 'TICKET_STATUS_CHANGED'
  | 'SYSTEM_NOTIFICATION';

export type NotificationTabDto =
  'all' | 'unread' | 'messages' | 'assignments' | 'system';

export interface GetNotificationsRequestDto {
  tab?: NotificationTabDto;
  page?: number;
  perPage?: number;
}

export interface NotificationRelatedEntityDto {
  type: 'TICKET' | string;
  id: number;
  ticketNumber?: string;
  url?: string;
}

export interface NotificationDto {
  id: number;
  type: NotificationTypeDto;
  title: string;
  body: string;
  isRead: boolean;
  relatedEntity?: NotificationRelatedEntityDto | null;
  createdAt: string;
}

export interface MarkNotificationReadResponseDto {
  id: number;
  isRead: boolean;
  readAt: string;
}

export interface MarkAllNotificationsReadResponseDto {
  updatedCount: number;
  message: string;
}
