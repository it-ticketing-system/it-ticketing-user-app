export const TICKET_ATTACHMENT_MAX_FILES = 5;
export const TICKET_ATTACHMENT_MAX_SIZE = 5 * 1024 * 1024;
export const TICKET_ATTACHMENT_ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'pdf',
  'docx',
] as const;
export const TICKET_ATTACHMENT_ACCEPT =
  TICKET_ATTACHMENT_ALLOWED_EXTENSIONS.map((extension) => `.${extension}`).join(
    ',',
  );
