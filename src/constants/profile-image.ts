export const PROFILE_IMAGE_MAX_SIZE = 2 * 1024 * 1024;
export const PROFILE_IMAGE_ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'] as const;
export const PROFILE_IMAGE_ACCEPT =
  PROFILE_IMAGE_ALLOWED_EXTENSIONS.map((extension) => `.${extension}`).join(',');
