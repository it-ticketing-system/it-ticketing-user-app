import { ROUTES } from '@/constants';
import { formatPersianDateTime, formatPersianRelativeDateTime } from '@/utils';
import type {
  MarkNotificationReadResponseDto,
  NotificationDto,
  NotificationTabDto,
  NotificationTypeDto,
} from './_dto';
import type { GetNotificationsRequest } from './_types';
import type {
  INotification,
  INotificationRelatedEntity,
  NotificationTab,
  NotificationType,
} from '@/models';

const NOTIFICATION_TYPE_MAP = {
  NEW_TICKET_CREATED: 'newTicketCreated',
  TICKET_ASSIGNED: 'ticketAssigned',
  TICKET_REASSIGNED: 'ticketReassigned',
  TICKET_DEPARTMENT_CHANGED: 'ticketDepartmentChanged',
  NEW_MESSAGE: 'newMessage',
  TICKET_STATUS_CHANGED: 'ticketStatusChanged',
  SYSTEM_NOTIFICATION: 'systemNotification',
} as const satisfies Record<NotificationTypeDto, NotificationType>;

const NOTIFICATION_TAB_DTO_MAP = {
  all: 'all',
  unread: 'unread',
  messages: 'messages',
  assignments: 'assignments',
  system: 'system',
} as const satisfies Record<NotificationTab, NotificationTabDto>;

const toRelatedEntity = (
  notification: NotificationDto,
): INotificationRelatedEntity | null => {
  const relatedEntity = notification.relatedEntity;

  if (!relatedEntity) {
    return null;
  }

  return {
    type: relatedEntity.type,
    id: String(relatedEntity.id),
    ticketNumber: relatedEntity.ticketNumber,
    href:
      relatedEntity.type === 'TICKET'
        ? ROUTES.ticketDetails(String(relatedEntity.id))
        : relatedEntity.url,
  };
};

export const toGetNotificationsRequestDto = (
  params: GetNotificationsRequest,
) => ({
  page: params.page,
  perPage: params.perPage,
  tab: params.tab ? NOTIFICATION_TAB_DTO_MAP[params.tab] : undefined,
});

export const toNotification = (
  notification: NotificationDto,
): INotification => ({
  id: String(notification.id),
  type: NOTIFICATION_TYPE_MAP[notification.type],
  title: notification.title,
  body: notification.body,
  isRead: notification.isRead,
  relatedEntity: toRelatedEntity(notification),
  createdAtLabel: formatPersianDateTime(notification.createdAt),
  createdAtRelativeLabel: formatPersianRelativeDateTime(notification.createdAt),
});

export const toMarkNotificationReadResult = (
  dto: MarkNotificationReadResponseDto,
) => ({
  id: String(dto.id),
  isRead: dto.isRead,
  readAt: dto.readAt,
});
