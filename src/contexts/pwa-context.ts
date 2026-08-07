'use client';

import { createContext } from 'react';

export type PwaPushSupport = {
  hasNotification: boolean;
  hasPushManager: boolean;
  hasServiceWorker: boolean;
  isSecureContext: boolean;
  isSupported: boolean;
};

export type PwaContextValue = {
  canInstall: boolean;
  isIos: boolean;
  isInstallPromptDismissed: boolean;
  isOnline: boolean;
  isPushPromptDismissed: boolean;
  isStandalone: boolean;
  isUpdateAvailable: boolean;
  pushSupport: PwaPushSupport;
  dismissInstallPrompt: () => void;
  dismissPushPrompt: () => void;
  promptInstall: () => Promise<void>;
  reloadForUpdate: () => void;
};

export const PwaContext = createContext<PwaContextValue | null>(null);
