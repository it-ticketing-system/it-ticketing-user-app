import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import type { ApiResponse } from '@/apis/core/types/api-response';
import type {
  LoginResponseDto,
  LoginRequestDto,
} from '@/apis/services/auth/_dto';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

interface LoginBackendResponseDto extends LoginResponseDto {
  accessToken: string;
}

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined');
  }
  return API_BASE_URL;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as LoginRequestDto;

  const backendResponse = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload =
    (await backendResponse.json()) as ApiResponse<LoginBackendResponseDto>;

  if (!backendResponse.ok || !payload.success) {
    return NextResponse.json(payload, {
      status: backendResponse.status,
    });
  }

  const { accessToken, tokenType, user } = payload.data;

  if (user.role !== 'USER') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid user role',
        },
      },
      {
        status: 422,
      },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  const safeResponse: ApiResponse<LoginResponseDto> = {
    success: true,
    data: {
      tokenType,
      user,
    },
  };

  return NextResponse.json(safeResponse);
}
