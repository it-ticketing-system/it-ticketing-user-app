import { PWA_QUERY_PERSISTENCE } from '@/constants';
import type { Query, QueryClient, QueryKey } from '@tanstack/react-query';

type PersistedQuery = {
  queryKey: QueryKey;
  data: unknown;
  dataUpdatedAt: number;
};

type PersistedQueryCache = {
  buster: string;
  persistedAt: number;
  schemaVersion: string;
  userId: number;
  queries: PersistedQuery[];
};

const getPersistenceKey = (userId: number) => {
  return `${PWA_QUERY_PERSISTENCE.cacheKeyPrefix}:${userId}:${PWA_QUERY_PERSISTENCE.schemaVersion}`;
};

const openDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(
      PWA_QUERY_PERSISTENCE.dbName,
      PWA_QUERY_PERSISTENCE.dbVersion,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (
        !database.objectStoreNames.contains(PWA_QUERY_PERSISTENCE.storeName)
      ) {
        database.createObjectStore(PWA_QUERY_PERSISTENCE.storeName);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const withStore = async <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
) => {
  const database = await openDatabase();

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(
      PWA_QUERY_PERSISTENCE.storeName,
      mode,
    );
    const request = callback(
      transaction.objectStore(PWA_QUERY_PERSISTENCE.storeName),
    );

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
};

export const isPersistableQueryKey = (queryKey: QueryKey) => {
  if (!Array.isArray(queryKey)) {
    return false;
  }

  const [scope, type] = queryKey;

  if (scope === 'auth' && type === 'me') {
    return true;
  }

  if (scope === 'lookups' && type === 'departments') {
    return true;
  }

  if (scope === 'tickets' && (type === 'list' || type === 'details')) {
    return true;
  }

  if (
    scope === 'notifications' &&
    (type === 'list' || type === 'unread-count')
  ) {
    return true;
  }

  return false;
};

export const persistReadableQueries = async (
  userId: number,
  queryClient: QueryClient,
) => {
  if (!('indexedDB' in window)) {
    return;
  }

  const queries = queryClient
    .getQueryCache()
    .getAll()
    .filter((query: Query) => {
      return (
        query.state.status === 'success' &&
        query.state.dataUpdatedAt > 0 &&
        isPersistableQueryKey(query.queryKey)
      );
    })
    .map<PersistedQuery>((query) => ({
      queryKey: query.queryKey,
      data: query.state.data,
      dataUpdatedAt: query.state.dataUpdatedAt,
    }));

  const payload: PersistedQueryCache = {
    buster: PWA_QUERY_PERSISTENCE.buster,
    persistedAt: Date.now(),
    schemaVersion: PWA_QUERY_PERSISTENCE.schemaVersion,
    userId,
    queries,
  };

  await withStore('readwrite', (store) =>
    store.put(payload, getPersistenceKey(userId)),
  );
};

export const restoreReadableQueries = async (
  userId: number,
  queryClient: QueryClient,
) => {
  if (!('indexedDB' in window)) {
    return;
  }

  const payload = await withStore<PersistedQueryCache | undefined>(
    'readonly',
    (store) => store.get(getPersistenceKey(userId)),
  );

  if (
    !payload ||
    payload.userId !== userId ||
    payload.schemaVersion !== PWA_QUERY_PERSISTENCE.schemaVersion ||
    payload.buster !== PWA_QUERY_PERSISTENCE.buster ||
    Date.now() - payload.persistedAt > PWA_QUERY_PERSISTENCE.maxAgeMs
  ) {
    await removePersistedQueries(userId);
    return;
  }

  payload.queries.forEach((query) => {
    const currentState = queryClient.getQueryState(query.queryKey);

    if (
      currentState?.dataUpdatedAt &&
      currentState.dataUpdatedAt >= query.dataUpdatedAt
    ) {
      return;
    }

    queryClient.setQueryData(query.queryKey, query.data, {
      updatedAt: query.dataUpdatedAt,
    });
  });
};

export const removePersistedQueries = async (userId: number) => {
  if (!('indexedDB' in window)) {
    return;
  }

  await withStore('readwrite', (store) =>
    store.delete(getPersistenceKey(userId)),
  );
};

export const clearAllPersistedQueryCaches = async () => {
  if (!('indexedDB' in window)) {
    return;
  }

  await withStore('readwrite', (store) => store.clear());
};
