import { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import { LOOKUP_ENDPOINTS } from './_endpoints';
import { toDepartmentLookup } from './_mappers';
import type { DepartmentLookupDto } from './_dto';
import type { GetDepartmentsResponse } from './_types';

export function createLookupServices(request: ApiRequestFunction) {
  async function getDepartments(
    signal?: AbortSignal,
  ): Promise<GetDepartmentsResponse> {
    const response = await request<DepartmentLookupDto[]>({
      url: LOOKUP_ENDPOINTS.departments,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return response.map(toDepartmentLookup);
  }

  return {
    getDepartments,
  };
}
