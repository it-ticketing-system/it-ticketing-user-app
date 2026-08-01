import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';

const API_BASE_URL = process.env.API_BASE_URL;

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined');
  }
  return API_BASE_URL;
}

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  try {
    const backendResponse = await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },

      body: JSON.stringify({}),
      cache: 'no-store',
    });

    const responseBody = await backendResponse.arrayBuffer();

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: {
        'Content-Type':
          backendResponse.headers.get('content-type') ?? 'application/json',
      },
    });
  } finally {
    cookieStore.delete(AUTH_COOKIE_NAME);
  }
}
