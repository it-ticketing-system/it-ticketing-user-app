'use client';

import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { clientFileServices } from '@/apis/services/files/client';
import {
  clientTicketServices,
  type CreateTicketRequest,
  type CreateTicketResult,
} from '@/apis/services/tickets/client';
import { OnlineOnlyNotice } from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS, ROUTES } from '@/constants';
import { usePostRequest, usePwa } from '@/hooks';
import AttachmentField from './attachment-field';
import {
  createTicketSchema,
  type CreateTicketFormValues,
} from './create-ticket.schema';
import type { CreateTicketFormProps } from './types';

const DESCRIPTION_MAX_LENGTH = 2000;

const getSelectValue = (
  value: string | number | readonly (string | number)[] | null | undefined,
): string => {
  if (Array.isArray(value)) {
    return value[0] === undefined ? '' : String(value[0]);
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const CreateTicketForm = ({
  departments,
  cancelHref = ROUTES.tickets,
}: CreateTicketFormProps) => {
  const t = useTranslations('createTicket.form');
  const tV = useTranslations('createTicket.validation');
  const tPwa = useTranslations('pwa.onlineOnly');
  const { isOnline } = usePwa();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<File[]>([]);

  const schema = useMemo(
    () =>
      createTicketSchema({
        titleRequired: tV('title.required'),
        titleMinLength: tV('title.minLength'),
        titleMaxLength: tV('title.maxLength'),
        departmentRequired: tV('department.required'),
        initialMessageRequired: tV('initialMessage.required'),
        initialMessageMinLength: tV('initialMessage.minLength'),
        initialMessageMaxLength: tV('initialMessage.maxLength'),
      }),
    [tV],
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: '',
      departmentId: '',
      initialMessage: '',
    },

    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const initialMessage = useWatch({
    control,
    name: 'initialMessage',
  });

  const submitTicket = useCallback(
    async (data: CreateTicketFormValues): Promise<CreateTicketResult> => {
      const uploadedFiles = await Promise.all(
        files.map((file) => clientFileServices.uploadFile(file)),
      );

      const payload: CreateTicketRequest = {
        title: data.title,
        departmentId: Number(data.departmentId),
        initialMessage: data.initialMessage,
        fileIds: uploadedFiles.map((file) => file.id),
      };

      return clientTicketServices.createTicket(payload);
    },
    [files],
  );

  const { mutateAsync: createTicket, isPending } = usePostRequest<
    CreateTicketFormValues,
    CreateTicketResult
  >({
    requestFn: submitTicket,

    getSuccessDescription: (data) =>
      t('toast.success', {
        number: data.ticketNumber,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tickets.lists,
      });
      router.push(ROUTES.tickets);
    },
  });

  const onSubmit = async (data: CreateTicketFormValues) => {
    if (!isOnline) {
      return;
    }

    await createTicket(data);
  };

  const descriptionLength = initialMessage.length;
  const hasDepartments = departments.length > 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label={t('ariaLabel')}
      className="border-border bg-surface me-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-xl border shadow-sm"
      noValidate
    >
      <div className="w-full flex-1 space-y-4 overflow-y-auto p-4 lg:space-y-6 lg:p-6">
        <h2 className="text-h3 text-foreground">{t('title')}</h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextField fullWidth isInvalid={Boolean(errors.title)}>
            <Label>{t('fields.title.label')}</Label>

            <Input
              {...register('title')}
              autoComplete="off"
              placeholder={t('fields.title.placeholder')}
            />

            <FieldError>{errors.title?.message}</FieldError>
          </TextField>

          <Controller
            control={control}
            name="departmentId"
            render={({ field, fieldState }) => (
              <Select
                fullWidth
                isInvalid={Boolean(fieldState.error)}
                isDisabled={isPending || !hasDepartments}
                value={field.value || null}
                onChange={(nextValue) => {
                  field.onChange(getSelectValue(nextValue));
                }}
                onBlur={field.onBlur}
                variant="secondary"
                placeholder={t('fields.department.placeholder')}
                className="select"
              >
                <Label className="label">{t('fields.department.label')}</Label>

                <Select.Trigger className="select__trigger">
                  <Select.Value className="select__value" />
                  <Select.Indicator className="select__indicator" />
                </Select.Trigger>

                <Select.Popover className="select__popover">
                  <ListBox aria-label={t('fields.department.label')}>
                    {departments.map((department) => (
                      <ListBox.Item
                        key={department.id}
                        id={department.id}
                        textValue={department.name}
                      >
                        {department.name}

                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>

                <FieldError>{fieldState.error?.message}</FieldError>
              </Select>
            )}
          />
        </div>

        {!hasDepartments ? (
          <p role="alert" className="text-caption text-danger-600">
            {t('fields.department.empty')}
          </p>
        ) : null}

        {!isOnline ? (
          <OnlineOnlyNotice>{tPwa('createTicket')}</OnlineOnlyNotice>
        ) : null}

        <TextField fullWidth isInvalid={Boolean(errors.initialMessage)}>
          <Label>{t('fields.initialMessage.label')}</Label>

          <TextArea
            {...register('initialMessage')}
            fullWidth
            variant="secondary"
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder={t('fields.initialMessage.placeholder')}
            className="text-body-sm border-border bg-surface text-foreground min-h-[120px] resize-none rounded-md border p-3 shadow-none placeholder:text-neutral-400 lg:min-h-[140px] lg:p-4"
          />

          <div className="flex items-start justify-between gap-4">
            <FieldError>{errors.initialMessage?.message}</FieldError>

            <span
              dir="ltr"
              className="text-caption text-muted ms-auto shrink-0"
            >
              {descriptionLength} / {DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </TextField>

        <AttachmentField
          files={files}
          isDisabled={isPending || !isOnline}
          onFilesChange={setFiles}
        />
      </div>

      <div className="border-separator flex w-full shrink-0 flex-col gap-3 border-t p-4 lg:flex-row lg:justify-end lg:p-6">
        <Button
          type="button"
          variant="outline"
          isDisabled={isPending}
          onPress={() => router.push(cancelHref)}
          className="h-11 w-full rounded-md lg:w-auto lg:min-w-24"
        >
          {t('actions.cancel')}
        </Button>
        <Button
          type="submit"
          isPending={isPending}
          isDisabled={!hasDepartments || !isOnline}
          className="h-11 w-full rounded-md lg:w-auto lg:min-w-36"
        >
          <Send aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('actions.submit')}
        </Button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
