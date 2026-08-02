export const NOTIFICATION_ENDPOINTS = {
  list: '/notifications',
  markRead: (notificationId: string) => `/notifications/${notificationId}/read`,
  markAllRead: '/notifications/read-all',
} as const;
