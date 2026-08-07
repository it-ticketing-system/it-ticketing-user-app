const APP_CACHE_PREFIX = 'it-ticketing-user-app';
const CACHE_VERSION = 'v2';
const SHELL_CACHE = `${APP_CACHE_PREFIX}-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `${APP_CACHE_PREFIX}-static-${CACHE_VERSION}`;
const OFFLINE_URL = '/app/offline';
const NOTIFICATIONS_URL = '/app/notifications';
const APP_SCOPE = '/app';
const PRECACHE_URLS = [
  OFFLINE_URL,
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];
const PRIVATE_API_PREFIXES = [
  '/api/backend/auth',
  '/api/backend/user',
  '/api/backend/notifications',
  '/api/backend/files',
  '/api/backend/push',
];
const PUBLIC_ASSET_PREFIXES = ['/icons/', '/logo/', '/auth/', '/hero/'];

const isPrivateApiRequest = (url) => {
  return PRIVATE_API_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
};

const isPublicAssetRequest = (url) => {
  return PUBLIC_ASSET_PREFIXES.some((prefix) =>
    url.pathname.startsWith(prefix),
  );
};

const getSafeAppUrl = (value) => {
  if (typeof value !== 'string') {
    return NOTIFICATIONS_URL;
  }

  try {
    const url = new URL(value, self.location.origin);

    if (url.origin !== self.location.origin) {
      return NOTIFICATIONS_URL;
    }

    if (!url.pathname.startsWith(APP_SCOPE)) {
      return NOTIFICATIONS_URL;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return NOTIFICATIONS_URL;
  }
};

const getPushPayload = (event) => {
  try {
    return event.data?.json?.() ?? {};
  } catch {
    return {};
  }
};

const putIfCacheable = async (cacheName, request, response) => {
  if (!response || !response.ok || response.type !== 'basic') {
    return;
  }

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
};

const networkFirstNavigation = async (request) => {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const response = await fetch(request);
    await putIfCacheable(SHELL_CACHE, request, response);
    return response;
  } catch {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const offlineResponse = await cache.match(OFFLINE_URL);

    if (offlineResponse) {
      return offlineResponse;
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};

const rscNetworkFirst = async (request) => {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const response = await fetch(request);
    await putIfCacheable(SHELL_CACHE, request, response);
    return response;
  } catch {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response('RSC Offline Fallback', {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  const networkResponsePromise = fetch(request)
    .then(async (response) => {
      await putIfCacheable(STATIC_CACHE, request, response);
      return response;
    })
    .catch(() => undefined);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await networkResponsePromise;

  if (networkResponse) {
    return networkResponse;
  }

  return new Response('', { status: 504, statusText: 'Gateway Timeout' });
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheKeys) =>
        Promise.all(
          cacheKeys
            .filter(
              (cacheKey) =>
                cacheKey.startsWith(APP_CACHE_PREFIX) &&
                ![SHELL_CACHE, STATIC_CACHE].includes(cacheKey),
            )
            .map((cacheKey) => caches.delete(cacheKey)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || isPrivateApiRequest(url)) {
    return;
  }

  if (url.searchParams.has('_rsc') && url.pathname.startsWith(APP_SCOPE)) {
    event.respondWith(rscNetworkFirst(request));
    return;
  }

  if (request.mode === 'navigate' && url.pathname.startsWith(APP_SCOPE)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isPublicAssetRequest(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener('push', (event) => {
  const payload = getPushPayload(event);
  const title =
    typeof payload.title === 'string' ? payload.title : 'اعلان جدید';
  const body =
    typeof payload.body === 'string'
      ? payload.body
      : 'یک اعلان جدید برای شما ثبت شد.';
  const url = getSafeAppUrl(payload.data?.url ?? payload.url);
  const tag =
    typeof payload.tag === 'string'
      ? payload.tag
      : `notification:${payload.notificationId ?? Date.now()}`;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      dir: 'rtl',
      lang: 'fa',
      data: {
        url,
      },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = getSafeAppUrl(event.notification.data?.url);
  const absoluteUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const existingClient = clients.find((client) => {
          return client.url.startsWith(self.location.origin);
        });

        if (existingClient) {
          existingClient.focus();
          return existingClient.navigate(absoluteUrl);
        }

        return self.clients.openWindow(absoluteUrl);
      }),
  );
});
