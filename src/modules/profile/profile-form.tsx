import { Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { Save, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ICON_SIZE_CLASS } from '@/constants';
import type { ProfileInformationFormValues } from './profile.schema';

interface ProfileFormProps {
  control: Control<ProfileInformationFormValues>;
  errors: FieldErrors<ProfileInformationFormValues>;
  isDirty: boolean;
  isPending: boolean;
  isOnline: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProfileForm = ({
  control,
  errors,
  isDirty,
  isPending,
  isOnline,
  onSubmit,
  onCancel,
}: ProfileFormProps) => {
  const t = useTranslations('profile.editor');

  return (
    <form
      aria-label={t('ariaLabel')}
      className="space-y-4"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField fullWidth isInvalid={Boolean(errors.name)}>
              <Label>{t('fields.name.label')}</Label>

              <Input
                ref={field.ref}
                name={field.name}
                value={field.value ?? ''}
                onBlur={field.onBlur}
                onChange={field.onChange}
                autoComplete="name"
                disabled={!isOnline || isPending}
                placeholder={t('fields.name.placeholder')}
              />

              <FieldError>{errors.name?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField fullWidth isInvalid={Boolean(errors.username)}>
              <Label>{t('fields.username.label')}</Label>

              <Input
                ref={field.ref}
                name={field.name}
                value={field.value ?? ''}
                onBlur={field.onBlur}
                onChange={field.onChange}
                autoComplete="username"
                disabled={!isOnline || isPending}
                placeholder={t('fields.username.placeholder')}
              />

              <FieldError>{errors.username?.message}</FieldError>
            </TextField>
          )}
        />
      </div>

      <div className="border-separator flex items-center justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          isDisabled={isPending}
          onPress={onCancel}
        >
          <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('actions.cancel')}
        </Button>

        <Button
          type="submit"
          size="md"
          variant="primary"
          isDisabled={!isDirty || isPending || !isOnline}
          isPending={isPending}
        >
          <Save aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('actions.submit')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
