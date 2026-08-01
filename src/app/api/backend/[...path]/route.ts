import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined');
  }

  return API_BASE_URL;
}

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const backendUrl = new URL(`${getApiBaseUrl()}/${path.join('/')}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  headers.set('Accept', request.headers.get('accept') ?? 'application/json');
  const contentType = request.headers.get('content-type');

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const backendResponse = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  if (backendResponse.status === 401) {
    cookieStore.delete(AUTH_COOKIE_NAME);
  }

  const responseBody = await backendResponse.arrayBuffer();
  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get('content-type');

  if (responseContentType) {
    responseHeaders.set('Content-Type', responseContentType);
  }

  const contentDisposition = backendResponse.headers.get('content-disposition');

  if (contentDisposition) {
    responseHeaders.set('Content-Disposition', contentDisposition);
  }

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
