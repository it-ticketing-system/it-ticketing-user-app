import { AUTH_ENDPOINTS } from './_endpoints';
import { toUserModel } from './_mappers';
import {
  type ChangePasswordRequest,
  type ChangePasswordResult,
  type GetMeResponse,
  type LoginRequest,
  type LoginResult,
  type LogoutResult,
  type RegisterRequest,
  type RegisterResult,
  type UpdateProfileRequest,
  type UpdateProfileResult,
} from './_types';
import type {
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
  GetMeResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UpdateProfileRequestDto,
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

    return toUserModel(dto);
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

  async function updateProfile(
    payload: UpdateProfileRequest,
  ): Promise<UpdateProfileResult> {
    const dto = await request<GetMeResponseDto, UpdateProfileRequestDto>({
      url: AUTH_ENDPOINTS.updateProfile,
      method: 'PATCH',
      data: {
        name: payload.name,
        username: payload.username,
        profileImageFileId: payload.profileImageFileId,
      },
      meta: {
        auth: 'required',
      },
    });

    return toUserModel(dto);
  }

  async function changePassword(
    payload: ChangePasswordRequest,
  ): Promise<ChangePasswordResult> {
    return request<ChangePasswordResponseDto, ChangePasswordRequestDto>({
      url: AUTH_ENDPOINTS.changePassword,
      method: 'PATCH',
      data: {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        newPasswordConfirmation: payload.confirmPassword,
      },
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    login,
    register,
    getMe,
    logout,
    updateProfile,
    changePassword,
  };
}
