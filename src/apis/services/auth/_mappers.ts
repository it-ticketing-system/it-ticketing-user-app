import { toBackendProxyHref } from '@/utils';
import type { GetMeResponseDto } from './_dto';
import type { IUser } from '@/models';

export const toUserModel = (dto: GetMeResponseDto): IUser => ({
  id: dto.id,
  name: dto.name,
  username: dto.username,
  role: dto.role,
  profileImageUrl: dto.profileImageUrl
    ? toBackendProxyHref(dto.profileImageUrl)
    : null,
  permissions: dto.permissions ?? [],
  departments: dto.departments ?? [],
  availabilityStatus: dto.availabilityStatus ?? null,
  createdAt: dto.createdAt ?? null,
  lastLoginAt: dto.lastLoginAt ?? null,
});
