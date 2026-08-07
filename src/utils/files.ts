export const formatFileSize = (size = 0): string => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileExtension = (file: Pick<File, 'name'>) => {
  return file.name.split('.').pop()?.toLowerCase();
};

export const isAllowedFileExtension = (
  extension: string | undefined,
  allowedExtensions: readonly string[],
) => {
  return Boolean(extension && allowedExtensions.includes(extension));
};

export const isImageMimeType = (mimeType?: string) => {
  return mimeType?.startsWith('image/') ?? false;
};
