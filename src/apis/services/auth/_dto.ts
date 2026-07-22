export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  tokenType: 'Bearer';
  user: {
    role: UserRole;
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
