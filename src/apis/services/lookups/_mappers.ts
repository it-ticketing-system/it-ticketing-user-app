import type { DepartmentLookupDto } from './_dto';
import type { IDepartmentLookup } from '@/models';

export const toDepartmentLookup = (
  department: DepartmentLookupDto,
): IDepartmentLookup => ({
  id: String(department.id),
  name: department.name,
});
