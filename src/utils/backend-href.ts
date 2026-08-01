const BACKEND_PROXY_PREFIX = '/api/backend';

export const toBackendProxyHref = (href: string): string => {
  if (!href || href.startsWith(`${BACKEND_PROXY_PREFIX}/`)) {
    return href;
  }

  if (href.startsWith('/')) {
    return `${BACKEND_PROXY_PREFIX}${href}`;
  }

  try {
    const url = new URL(href);

    if (url.pathname.startsWith('/files/')) {
      return `${BACKEND_PROXY_PREFIX}${url.pathname}${url.search}`;
    }

    return href;
  } catch {
    return `${BACKEND_PROXY_PREFIX}/${href.replace(/^\/+/, '')}`;
  }
};
