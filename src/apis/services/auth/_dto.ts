type AuthUserRoleDto = 'USER' | 'SUPPORT' | 'ADMIN';

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

export interface GetMeResponseDto {
  id: number;
  name: string;
  username: string;
  profileImageUrl: string | null;
}
