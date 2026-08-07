import { Download, FileImage, FileText } from 'lucide-react';
import { ICON_SIZE_CLASS } from '@/constants';
import { formatFileSize, isImageMimeType } from '@/utils';
import type { IUploadedFile } from '@/models';

interface FileAttachmentLinkProps {
  attachment: IUploadedFile;
}

const FileAttachmentLink = ({ attachment }: FileAttachmentLinkProps) => {
  const Icon = isImageMimeType(attachment.mimeType) ? FileImage : FileText;

  return (
    <a
      href={attachment.href}
      download
      className="border-border bg-surface focus-visible:ring-focus/20 flex min-h-11 max-w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg border px-3 py-2 transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-md">
        <Icon aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          dir="ltr"
          className="text-body-sm text-foreground truncate text-end font-medium"
        >
          {attachment.name}
        </p>
      </div>

      <span className="text-caption text-muted shrink-0">
        {formatFileSize(attachment.size)}
      </span>

      <Download
        aria-hidden="true"
        className={`text-muted ${ICON_SIZE_CLASS.sm} shrink-0`}
      />
    </a>
  );
};

export default FileAttachmentLink;
