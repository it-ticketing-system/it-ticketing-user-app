'use client';

import { Button, Label, TextArea, TextField } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LockKeyhole, Paperclip, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { clientFileServices } from '@/apis/services/files/client';
import {
  clientTicketServices,
  type SendTicketMessageRequest,
  type SendTicketMessageResult,
} from '@/apis/services/tickets/client';
import { OnlineOnlyNotice, SelectedFilesList } from '@/components/shared';
import {
  QUERY_KEYS,
  ICON_SIZE_CLASS,
  TICKET_ATTACHMENT_ACCEPT,
  TICKET_ATTACHMENT_ALLOWED_EXTENSIONS,
  TICKET_ATTACHMENT_MAX_FILES,
  TICKET_ATTACHMENT_MAX_SIZE,
} from '@/constants';
import { usePostRequest, usePwa } from '@/hooks';
import { cn, getFileExtension, isAllowedFileExtension } from '@/utils';
import {
  createMessageComposerSchema,
  type MessageComposerFormValues,
} from './message-composer.schema';

interface MessageComposerProps {
  ticketId: string;
  isClosed: boolean;
}

const MessageComposer = ({ ticketId, isClosed }: MessageComposerProps) => {
  const t = useTranslations('ticketDetails.composer');
  const tPwa = useTranslations('pwa.onlineOnly');
  const { isOnline } = usePwa();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createMessageComposerSchema({
        bodyRequired: t('validation.body.required'),
        bodyMaxLength: t('validation.body.maxLength'),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageComposerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      body: '',
    },
  });

  const message = useWatch({
    control,
    name: 'body',
  });

  const addFiles = (incomingFiles: File[]) => {
    setFileError(null);

    const nextFiles = [...files];

    for (const file of incomingFiles) {
      if (nextFiles.length >= TICKET_ATTACHMENT_MAX_FILES) {
        setFileError(t('errors.maxFiles'));
        break;
      }

      const extension = getFileExtension(file);

      if (
        !isAllowedFileExtension(extension, TICKET_ATTACHMENT_ALLOWED_EXTENSIONS)
      ) {
        setFileError(t('errors.unsupportedFormat'));
        continue;
      }

      if (file.size > TICKET_ATTACHMENT_MAX_SIZE) {
        setFileError(t('errors.maxSize'));
        continue;
      }

      const exists = nextFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified,
      );

      if (!exists) {
        nextFiles.push(file);
      }
    }

    setFiles(nextFiles);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.currentTarget.files ?? []));
    event.currentTarget.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((currentFiles) =>
      currentFiles.filter((_, currentIndex) => currentIndex !== index),
    );
    setFileError(null);
  };

  const submitMessage = useCallback(
    async (
      data: MessageComposerFormValues,
    ): Promise<SendTicketMessageResult> => {
      const uploadedFiles = await Promise.all(
        files.map((file) => clientFileServices.uploadFile(file)),
      );

      const payload: SendTicketMessageRequest = {
        body: data.body,
        fileIds: uploadedFiles.map((file) => file.id),
      };

      return clientTicketServices.sendTicketMessage(ticketId, payload);
    },
    [files, ticketId],
  );

  const { mutateAsync: sendMessage, isPending } = usePostRequest<
    MessageComposerFormValues,
    SendTicketMessageResult
  >({
    requestFn: submitMessage,
    getSuccessDescription: () => t('toast.success'),
    onSuccess: async () => {
      reset();
      setFiles([]);
      setFileError(null);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tickets.details(ticketId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tickets.lists,
        }),
      ]);
    },
  });

  const onSubmit = async (data: MessageComposerFormValues) => {
    if (isClosed || isPending || !isOnline) {
      return;
    }

    await sendMessage(data);
  };

  const isSubmitDisabled =
    isClosed || isPending || !isOnline || !message.trim();

  if (isClosed) {
    return (
      <div className="w-full min-w-0 space-y-3">
        <div className="border-warning-200 bg-warning-soft flex items-start gap-3 rounded-lg border p-3">
          <LockKeyhole
            aria-hidden="true"
            className={cn(
              'text-warning-600 mt-0.5 shrink-0',
              ICON_SIZE_CLASS.sm,
            )}
          />

          <div>
            <p className="text-body-sm text-foreground font-semibold">
              {t('closed.title')}
            </p>

            <p className="text-caption text-muted mt-1">
              {t('closed.description')}
            </p>
          </div>
        </div>

        <div className="flex w-full min-w-0 items-end gap-2">
          <Button
            type="button"
            isIconOnly
            variant="outline"
            isDisabled
            aria-label={t('attachment')}
            className="button button--md button--icon-only shrink-0 rounded-lg"
          >
            <Paperclip />
          </Button>

          <TextArea
            disabled
            rows={1}
            fullWidth
            variant="secondary"
            placeholder={t('closed.placeholder')}
            className="min-h-11 min-w-0 resize-none rounded-lg"
          />

          <Button
            type="button"
            isIconOnly
            isDisabled
            className="button button--md button--icon-only shrink-0 rounded-lg"
            aria-label={t('send')}
          >
            <Send aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full min-w-0 space-y-3"
      noValidate
    >
      {files.length > 0 ? (
        <div className="border-border max-h-32 overflow-y-auto rounded-lg border bg-neutral-50 p-2 lg:max-h-40 lg:p-3">
          <SelectedFilesList
            files={files}
            isDisabled={isPending}
            removeAriaLabel={(name) => t('removeFile', { name })}
            onRemove={removeFile}
          />
        </div>
      ) : null}

      {fileError ? (
        <p role="alert" className="text-caption text-danger-600">
          {fileError}
        </p>
      ) : null}

      {!isOnline ? (
        <OnlineOnlyNotice>{tPwa('sendMessage')}</OnlineOnlyNotice>
      ) : null}

      <input
        ref={fileInputRef}
        hidden
        multiple
        type="file"
        accept={TICKET_ATTACHMENT_ACCEPT}
        disabled={isPending || !isOnline}
        onChange={handleFileChange}
      />

      <div className="flex w-full min-w-0 items-end gap-2">
        <Button
          type="button"
          isIconOnly
          variant="outline"
          isDisabled={isPending || !isOnline}
          aria-label={t('attachment')}
          onPress={() => fileInputRef.current?.click()}
          className="button button--md button--icon-only shrink-0 rounded-lg"
        >
          <Paperclip />
        </Button>

        <TextField
          fullWidth
          isInvalid={Boolean(errors.body)}
          className="min-w-0 flex-1"
        >
          <Label className="sr-only">{t('label')}</Label>

          <TextArea
            {...register('body')}
            rows={1}
            maxLength={4000}
            variant="secondary"
            disabled={!isOnline}
            placeholder={t('placeholder')}
            className="max-h-32 min-h-11 min-w-0 resize-none rounded-lg"
          />
        </TextField>

        <Button
          type="submit"
          isIconOnly
          isPending={isPending}
          isDisabled={isSubmitDisabled}
          aria-label={t('send')}
          className="button button--md button--icon-only shrink-0 rounded-lg lg:hidden"
        >
          <Send aria-hidden="true" />
        </Button>

        <Button
          type="submit"
          isPending={isPending}
          isDisabled={isSubmitDisabled}
          className="button button--md hidden h-11 min-w-24 shrink-0 rounded-lg lg:flex"
        >
          <Send
            aria-hidden="true"
            className={cn(ICON_SIZE_CLASS.sm, 'shrink-0')}
          />
          {t('send')}
        </Button>
      </div>
    </form>
  );
};

export default MessageComposer;
