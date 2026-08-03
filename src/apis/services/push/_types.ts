export interface PushConfigResponse {
  enabled: boolean;
  vapidPublicKey: string | null;
}

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionDevice {
  name?: string;
  platform?: string;
  userAgent?: string;
}

export interface CreatePushSubscriptionRequest {
  endpoint: string;
  expirationTime: number | null;
  keys: PushSubscriptionKeys;
  device?: PushSubscriptionDevice;
}

export interface PushSubscriptionResponse {
  id: string;
  userId: number;
  endpointFingerprint: string;
  browser: string | null;
  platform: string | null;
  isActive: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}

export interface UnsubscribeCurrentBrowserRequest {
  endpoint: string;
}

export interface PushSubscriptionActionResult {
  message: string;
}
