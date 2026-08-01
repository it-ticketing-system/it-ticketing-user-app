'use client';

import { CloudUpload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, DragEvent, useState } from 'react';
import { SelectedFilesList } from '@/components/shared';
import {
  TICKET_ATTACHMENT_ACCEPT,
  TICKET_ATTACHMENT_ALLOWED_EXTENSIONS,
  TICKET_ATTACHMENT_MAX_FILES,
  TICKET_ATTACHMENT_MAX_SIZE,
} from '@/constants';
import { cn, getFileExtension, isAllowedFileExtension } from '@/utils';

interface AttachmentFieldProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  isDisabled?: boolean;
}

const AttachmentField = ({
  files,
  isDisabled = false,
  onFilesChange,
}: AttachmentFieldProps) => {
  const t = useTranslations('createTicket.form.attachments');

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (incomingFiles: File[]) => {
    if (isDisabled) {
      return;
    }

    setError(null);

    const nextFiles = [...files];

    for (const file of incomingFiles) {
      if (nextFiles.length >= TICKET_ATTACHMENT_MAX_FILES) {
        setError(t('errors.maxFiles'));
        break;
      }

      const extension = getFileExtension(file);

      if (
        !isAllowedFileExtension(extension, TICKET_ATTACHMENT_ALLOWED_EXTENSIONS)
      ) {
        setError(t('errors.unsupportedFormat'));
        continue;
      }

      if (file.size > TICKET_ATTACHMENT_MAX_SIZE) {
        setError(t('errors.maxSize'));
        continue;
      }

      const isDuplicate = nextFiles.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );

      if (!isDuplicate) {
        nextFiles.push(file);
      }
    }

    onFilesChange(nextFiles);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.currentTarget.files ?? []));
    event.currentTarget.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    if (isDisabled) {
      return;
    }

    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="label">{t('label')}</p>

        <div
          onDragEnter={(event) => {
            event.preventDefault();

            if (!isDisabled) {
              setIsDragging(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();

            if (!isDisabled) {
              setIsDragging(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            'relative flex min-h-[132px] items-center justify-center',
            'rounded-lg border border-dashed p-4',
            'transition-colors duration-150',
            'lg:min-h-40 lg:p-6',
            isDragging
              ? 'border-accent bg-accent-soft'
              : 'border-primary-200 bg-neutral-50',
            'focus-within:ring-focus/20 focus-within:ring-2',
            isDisabled && 'cursor-wait opacity-70',
          )}
        >
          <input
            type="file"
            multiple
            accept={TICKET_ATTACHMENT_ACCEPT}
            disabled={isDisabled}
            onChange={handleInputChange}
            aria-label={t('selectFile')}
            className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-wait"
          />

          <div className="pointer-events-none flex flex-col items-center text-center">
            <CloudUpload
              aria-hidden="true"
              className="text-muted mb-2 size-7 lg:size-8"
            />

            <p className="text-body-sm text-foreground font-medium">
              <span className="hidden lg:inline">{t('drop')}</span>

              <span className="lg:hidden">{t('selectFile')}</span>
            </p>

            <p className="text-body-sm text-accent mt-0.5">{t('click')}</p>

            <p className="text-caption text-muted mt-2">{t('helper')}</p>
          </div>
        </div>

        {error ? (
          <p role="alert" className="text-caption text-danger-600">
            {error}
          </p>
        ) : null}
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          <p className="text-body-sm text-foreground font-medium">
            {t('selected')}
          </p>

          <SelectedFilesList
            files={files}
            isDisabled={isDisabled}
            removeAriaLabel={(name) => t('remove', { name })}
            onRemove={removeFile}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AttachmentField;
