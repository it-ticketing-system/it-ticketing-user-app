export type AuthUserRoleDto = 'USER' | 'SUPPORT' | 'ADMIN';

export type SupportAvailabilityStatusDto =
  | 'AVAILABLE'
  | 'ON_LEAVE'
  | 'INACTIVE';

export interface AuthDepartmentDto {
  id: number;
  name: string;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  tokenType: 'Bearer';
  user: {
    role: AuthUserRoleDto;
    name: string;
  };
}

export interface RegisterRequestDto {
  name: string;
  username: string;
  password: string;
}

export interface RegisterResponseDto {
  name: string;
}

export interface LogoutResponseDto {
  message: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface ChangePasswordResponseDto {
  message: string;
}

export interface UpdateProfileRequestDto {
  name?: string;
  username?: string;
  profileImageFileId?: number | null;
}

export interface GetMeResponseDto {
  id: number;
  name: string;
  username: string;
  role: AuthUserRoleDto;
  profileImageUrl: string | null;
  permissions?: string[];
  departments?: AuthDepartmentDto[];
  availabilityStatus?: SupportAvailabilityStatusDto;
  createdAt?: string;
  lastLoginAt?: string | null;
}
