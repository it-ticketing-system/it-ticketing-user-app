export const PWA_CACHE_PREFIX = 'it-ticketing-user-app';

export const PWA_QUERY_PERSISTENCE = {
  dbName: 'it-ticketing-user-app-pwa',
  dbVersion: 1,
  storeName: 'react-query-cache',
  cacheKeyPrefix: 'query-cache',
  schemaVersion: 'v1',
  buster: 'pwa-read-cache-v1',
  maxAgeMs: 7 * 24 * 60 * 60 * 1000,
} as const;

export const PWA_INSTALL_PROMPT = {
  dismissedUntilKey: 'pwa:install-dismissed-until',
  dismissTtlMs: 7 * 24 * 60 * 60 * 1000,
} as const;

export const PWA_UPDATE_RELOAD_SESSION_KEY = 'pwa:update-reload-requested';
