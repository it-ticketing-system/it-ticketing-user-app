export type UserRole = 'USER' | 'SUPPORT' | 'ADMIN';

export interface IUserDepartment {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  profileImageUrl: string | null;
  permissions: string[];
  departments: IUserDepartment[];
  availabilityStatus: 'AVAILABLE' | 'ON_LEAVE' | 'INACTIVE' | null;
  createdAt: string | null;
  lastLoginAt: string | null;
}
