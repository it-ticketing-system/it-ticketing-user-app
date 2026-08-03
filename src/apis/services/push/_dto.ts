export interface PushConfigResponseDto {
  enabled: boolean;
  vapidPublicKey: string | null;
}

export interface PushSubscriptionKeysDto {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionDeviceDto {
  name?: string;
  platform?: string;
  userAgent?: string;
}

export interface CreatePushSubscriptionRequestDto {
  endpoint: string;
  expirationTime: number | null;
  keys: PushSubscriptionKeysDto;
  device?: PushSubscriptionDeviceDto;
}

export interface PushSubscriptionResponseDto {
  id: string;
  userId: number;
  endpointFingerprint: string;
  browser: string | null;
  platform: string | null;
  isActive: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}

export interface UnsubscribeCurrentBrowserRequestDto {
  endpoint: string;
}

export interface PushSubscriptionActionResponseDto {
  message: string;
}
