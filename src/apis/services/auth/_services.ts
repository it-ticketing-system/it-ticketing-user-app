import { AUTH_ENDPOINTS } from './_endpoints';
import {
  type GetMeResponse,
  type LoginRequest,
  type LoginResult,
  type LogoutResult,
  type RegisterRequest,
  type RegisterResult,
} from './_types';
import type {
  GetMeResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from './_dto';
import type { ApiRequestFunction } from '@/apis/core/types/api-request.types';

export function createAuthServices(request: ApiRequestFunction) {
  async function login(payload: LoginRequest): Promise<LoginResult> {
    const dto = await request<LoginResponseDto, LoginRequestDto>({
      url: AUTH_ENDPOINTS.login,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'none',
      },
    });

    return {
      name: dto.user.name,
    };
  }

  async function register(payload: RegisterRequest): Promise<RegisterResult> {
    const dto = await request<RegisterResponseDto, RegisterRequestDto>({
      url: AUTH_ENDPOINTS.register,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'none',
      },
    });

    return {
      name: dto.name,
    };
  }

  async function getMe(signal?: AbortSignal): Promise<GetMeResponse> {
    const dto = await request<GetMeResponseDto>({
      url: AUTH_ENDPOINTS.me,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      id: dto.id,
      name: dto.name,
      username: dto.username,
      profileImageUrl: dto.profileImageUrl,
    };
  }

  async function logout(): Promise<LogoutResult> {
    return request<LogoutResponseDto, Record<string, never>>({
      url: AUTH_ENDPOINTS.logout,
      method: 'POST',
      data: {},
      meta: {
        auth: 'required',
        skipUnauthorizedRedirect: true,
      },
    });
  }

  return {
    login,
    register,
    getMe,
    logout,
  };
}
