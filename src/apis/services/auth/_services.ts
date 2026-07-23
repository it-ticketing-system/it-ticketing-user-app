import { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import { AuthUserModel } from '@/models';
import { IUser } from '@/models/user';
import {
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from './_dto';
import { AUTH_ENDPOINTS } from './_endpoints';

export function createAuthServices(request: ApiRequestFunction) {
  async function login(payload: LoginRequestDto): Promise<AuthUserModel> {
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

  async function register(payload: RegisterRequestDto): Promise<AuthUserModel> {
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

  async function getMe(signal?: AbortSignal): Promise<IUser> {
    return request<IUser>({
      url: AUTH_ENDPOINTS.me,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });
  }

  async function logout(): Promise<LogoutResponseDto> {
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
