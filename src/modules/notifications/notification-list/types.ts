import type { ApiRequestError } from '@/apis/core/api-error';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { INotification, NotificationTab } from '@/models';

export type NotificationListItem = INotification;

export type NotificationListData = PaginatedResult<NotificationListItem>;

export interface NotificationListViewProps extends NotificationListData {
  activeTab: NotificationTab;
  error?: ApiRequestError | null;
  isLoading?: boolean;
  isPending?: boolean;
  onClearFilters?: () => void;
  onNotificationOpen?: (notification: NotificationListItem) => void;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
}

export interface NotificationListProps {
  activeTab: NotificationTab;
  data: NotificationListData;
  error?: ApiRequestError | null;
  topContent?: React.ReactNode;
  isLoading?: boolean;
  isPending?: boolean;
  onClearFilters?: () => void;
  onNotificationOpen?: (notification: NotificationListItem) => void;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
}
