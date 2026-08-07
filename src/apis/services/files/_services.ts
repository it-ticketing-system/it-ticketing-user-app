import { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import { FILE_ENDPOINTS } from './_endpoints';
import { toUploadFileResult } from './_mappers';
import type { UploadFileResponseDto } from './_dto';
import type { UploadFileResult } from './_types';

export function createFileServices(request: ApiRequestFunction) {
  async function uploadFile(file: File): Promise<UploadFileResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await request<UploadFileResponseDto, FormData>({
      url: FILE_ENDPOINTS.upload,
      method: 'POST',
      data: formData,
      meta: {
        auth: 'required',
      },
    });

    return toUploadFileResult(response);
  }

  return {
    uploadFile,
  };
}
