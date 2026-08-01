import type { UploadFileResponseDto } from './_dto';
import type { UploadFileResult } from './_types';

export const toUploadFileResult = (
  file: UploadFileResponseDto,
): UploadFileResult => ({
  id: file.id,
  name: file.originalName,
  mimeType: file.mimeType,
  size: file.size,
  href: file.url,
  createdAt: file.createdAt,
});
