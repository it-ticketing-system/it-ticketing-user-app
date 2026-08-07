'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PWA_CACHE_PREFIX,
  PWA_INSTALL_PROMPT,
  PWA_PUSH_PROMPT,
  PWA_UPDATE_RELOAD_SESSION_KEY,
} from '@/constants';
import {
  PwaContext,
  type PwaContextValue,
  type PwaPushSupport,
} from '@/contexts';

type BeforeInstallPromptChoice = {
  outcome: 'accepted' | 'dismissed';
  platform: string;
};

type BeforeInstallPromptEvent = Event & {
  platforms: string[];
  userChoice: Promise<BeforeInstallPromptChoice>;
  prompt: () => Promise<void>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const getPushSupport = (): PwaPushSupport => {
  if (typeof window === 'undefined') {
    return {
      hasNotification: false,
      hasPushManager: false,
      hasServiceWorker: false,
      isSecureContext: false,
      isSupported: false,
    };
  }

  const hasNotification = 'Notification' in window;
  const hasPushManager = 'PushManager' in window;
  const hasServiceWorker = 'serviceWorker' in navigator;
  const isSecureContext = window.isSecureContext;

  return {
    hasNotification,
    hasPushManager,
    hasServiceWorker,
    isSecureContext,
    isSupported:
      hasNotification && hasPushManager && hasServiceWorker && isSecureContext,
  };
};

const getIsStandalone = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorWithStandalone = navigator as NavigatorWithStandalone;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  );
};

const getIsIos = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string;
    };
  };

  if (nav.userAgentData?.platform) {
    if (nav.userAgentData.platform.toLowerCase() === 'ios') {
      return true;
    }
  }

  const userAgent = navigator.userAgent || '';

  return (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1)
  );
};

const getInstallPromptDismissed = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const dismissedUntil = Number(
    window.localStorage.getItem(PWA_INSTALL_PROMPT.dismissedUntilKey),
  );

  return Number.isFinite(dismissedUntil) && dismissedUntil > Date.now();
};

const getPushPromptDismissed = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const dismissedUntil = Number(
    window.localStorage.getItem(PWA_PUSH_PROMPT.dismissedUntilKey),
  );

  return Number.isFinite(dismissedUntil) && dismissedUntil > Date.now();
};

const cleanupDevelopmentServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(
    registrations.map((registration) => {
      const scripts = [
        registration.active?.scriptURL,
        registration.installing?.scriptURL,
        registration.waiting?.scriptURL,
      ].filter(Boolean);

      if (scripts.some((scriptUrl) => scriptUrl?.endsWith('/sw.js'))) {
        return registration.unregister();
      }

      return Promise.resolve(false);
    }),
  );

  if ('caches' in window) {
    const cacheKeys = await window.caches.keys();
    await Promise.all(
      cacheKeys
        .filter((cacheKey) => cacheKey.startsWith(PWA_CACHE_PREFIX))
        .map((cacheKey) => window.caches.delete(cacheKey)),
    );
  }
};

const PWAProvider: FCC = ({ children }) => {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isInstallPromptDismissed, setIsInstallPromptDismissed] =
    useState(false);
  const [isPushPromptDismissed, setIsPushPromptDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [pushSupport] = useState<PwaPushSupport>(() => getPushSupport());
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  useEffect(() => {
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const hydrationTimeoutId = window.setTimeout(() => {
      setIsOnline(navigator.onLine);
      setIsIos(getIsIos());
      setIsStandalone(getIsStandalone());
      setIsInstallPromptDismissed(getInstallPromptDismissed());
      setIsPushPromptDismissed(getPushPromptDismissed());
    }, 0);
    const updateOnlineState = () => setIsOnline(navigator.onLine);
    const updateStandaloneState = () => setIsStandalone(getIsStandalone());

    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);
    displayModeQuery.addEventListener('change', updateStandaloneState);

    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
      displayModeQuery.removeEventListener('change', updateStandaloneState);
      window.clearTimeout(hydrationTimeoutId);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsStandalone(true);
      window.localStorage.removeItem(PWA_INSTALL_PROMPT.dismissedUntilKey);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      cleanupDevelopmentServiceWorker();
      return;
    }

    let isReloading = false;
    let updateRegistration: (() => void) | null = null;
    let handleVisibilityChange: (() => void) | null = null;

    const handleControllerChange = () => {
      if (isReloading) {
        return;
      }

      if (
        window.sessionStorage.getItem(PWA_UPDATE_RELOAD_SESSION_KEY) === '1'
      ) {
        return;
      }

      isReloading = true;
      window.sessionStorage.setItem(PWA_UPDATE_RELOAD_SESSION_KEY, '1');
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange,
    );

    navigator.serviceWorker
      .register('/sw.js', { scope: '/app' })
      .then((registration) => {
        window.sessionStorage.removeItem(PWA_UPDATE_RELOAD_SESSION_KEY);

        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(Boolean(navigator.serviceWorker.controller));
        }

        updateRegistration = () => {
          void registration.update().catch(() => undefined);
        };

        handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            updateRegistration?.();
          }
        };

        window.addEventListener('online', updateRegistration);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;

          if (!installingWorker) {
            return;
          }

          installingWorker.onstatechange = () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(installingWorker);
              setIsUpdateAvailable(true);
            }
          };
        };
      })
      .catch(() => {
        setIsUpdateAvailable(false);
      });

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange,
      );

      if (updateRegistration) {
        window.removeEventListener('online', updateRegistration);
      }

      if (handleVisibilityChange) {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      }
    };
  }, []);

  const dismissInstallPrompt = useCallback(() => {
    const dismissedUntil = Date.now() + PWA_INSTALL_PROMPT.dismissTtlMs;
    window.localStorage.setItem(
      PWA_INSTALL_PROMPT.dismissedUntilKey,
      String(dismissedUntil),
    );
    setIsInstallPromptDismissed(true);
  }, []);

  const dismissPushPrompt = useCallback(() => {
    const dismissedUntil = Date.now() + PWA_PUSH_PROMPT.dismissTtlMs;
    window.localStorage.setItem(
      PWA_PUSH_PROMPT.dismissedUntilKey,
      String(dismissedUntil),
    );
    setIsPushPromptDismissed(true);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPromptEvent) {
      return;
    }

    await installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;

    setInstallPromptEvent(null);

    if (choice.outcome === 'dismissed') {
      dismissInstallPrompt();
    }
  }, [dismissInstallPrompt, installPromptEvent]);

  const reloadForUpdate = useCallback(() => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
  }, [waitingWorker]);

  const value = useMemo<PwaContextValue>(
    () => ({
      canInstall: Boolean(installPromptEvent) && !isStandalone,
      isIos,
      isInstallPromptDismissed,
      isOnline,
      isPushPromptDismissed,
      isStandalone,
      isUpdateAvailable,
      pushSupport,
      dismissInstallPrompt,
      dismissPushPrompt,
      promptInstall,
      reloadForUpdate,
    }),
    [
      dismissInstallPrompt,
      dismissPushPrompt,
      installPromptEvent,
      isIos,
      isInstallPromptDismissed,
      isOnline,
      isPushPromptDismissed,
      isStandalone,
      isUpdateAvailable,
      promptInstall,
      pushSupport,
      reloadForUpdate,
    ],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};

export default PWAProvider;
