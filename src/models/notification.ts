export type NotificationType =
  | 'newTicketCreated'
  | 'ticketAssigned'
  | 'ticketReassigned'
  | 'ticketDepartmentChanged'
  | 'newMessage'
  | 'ticketStatusChanged'
  | 'systemNotification';

export type NotificationTab =
  'all' | 'unread' | 'messages' | 'assignments' | 'system';

export interface INotificationRelatedEntity {
  type: 'TICKET' | string;
  id: string;
  ticketNumber?: string;
  href?: string;
}

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  relatedEntity: INotificationRelatedEntity | null;
  createdAtLabel: string;
  createdAtRelativeLabel: string;
}
