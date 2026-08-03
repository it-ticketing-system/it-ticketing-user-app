import type { CreatePushSubscriptionRequest } from '@/apis/services/push/client';

type PushSubscriptionJson = PushSubscriptionJSON & {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

const SERVICE_WORKER_READY_TIMEOUT_MS = 3000;

const getAppServiceWorkerRegistration = async () => {
  const registration = await navigator.serviceWorker.getRegistration('/app');

  if (registration) {
    return registration;
  }

  return Promise.race<ServiceWorkerRegistration | null>([
    navigator.serviceWorker.ready,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(null), SERVICE_WORKER_READY_TIMEOUT_MS);
    }),
  ]);
};

const getBrowserName = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Edg/')) {
    return 'Edge';
  }

  if (userAgent.includes('Chrome/')) {
    return 'Chrome';
  }

  if (userAgent.includes('Firefox/')) {
    return 'Firefox';
  }

  if (userAgent.includes('Safari/')) {
    return 'Safari';
  }

  return 'Browser';
};

export const urlBase64ToUint8Array = (value: string) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
};

export const getCurrentPushSubscription = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  const registration = await getAppServiceWorkerRegistration();

  if (!registration) {
    return null;
  }

  return registration.pushManager.getSubscription();
};

export const toPushSubscriptionRequest = (
  subscription: PushSubscription,
): CreatePushSubscriptionRequest => {
  const json = subscription.toJSON() as PushSubscriptionJson;

  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
    throw new Error('Push subscription is missing required browser keys.');
  }

  return {
    endpoint: json.endpoint,
    expirationTime: json.expirationTime ?? null,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
    device: {
      name: `${getBrowserName()} on ${navigator.platform || 'Unknown'}`,
      platform: navigator.platform || undefined,
      userAgent: navigator.userAgent,
    },
  };
};

export const subscribeCurrentBrowserToPush = async (vapidPublicKey: string) => {
  const registration = await getAppServiceWorkerRegistration();

  if (!registration) {
    throw new Error('Service worker registration is not available.');
  }

  const existingSubscription = await registration.pushManager.getSubscription();

  return (
    existingSubscription ??
    (await registration.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      userVisibleOnly: true,
    }))
  );
};

export const unsubscribeCurrentBrowserFromPush = async () => {
  const subscription = await getCurrentPushSubscription();

  if (!subscription) {
    return;
  }

  await subscription.unsubscribe().catch(() => undefined);
};
