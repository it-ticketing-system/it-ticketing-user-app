import { Button, Card } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  clientAuthServices,
  type ChangePasswordRequest,
  type ChangePasswordResult,
} from '@/apis/services/auth/client';
import { OnlineOnlyNotice, PasswordField } from '@/components/shared';
import { usePostRequest, usePwa } from '@/hooks';
import {
  createProfilePasswordSchema,
  type ProfilePasswordFormValues,
} from './profile.schema';
import SectionHeader from './section-header';

const AccountSecurity = () => {
  const t = useTranslations('profile.security');
  const tValidation = useTranslations('profile.validation');
  const tPwa = useTranslations('pwa.onlineOnly');
  const { isOnline } = usePwa();

  const schema = createProfilePasswordSchema({
    currentPasswordRequired: tValidation('currentPassword.required'),
    newPasswordRequired: tValidation('newPassword.required'),
    newPasswordMinLength: tValidation('newPassword.minLength'),
    newPasswordLowercase: tValidation('newPassword.lowercase'),
    newPasswordUppercase: tValidation('newPassword.uppercase'),
    newPasswordNumber: tValidation('newPassword.number'),
    newPasswordSpecialCharacter: tValidation('newPassword.specialCharacter'),
    confirmPasswordRequired: tValidation('confirmPassword.required'),
    passwordMismatch: tValidation('confirmPassword.mismatch'),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProfilePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const { mutateAsync: changePassword, isPending } = usePostRequest<
    ChangePasswordRequest,
    ChangePasswordResult
  >({
    requestFn: clientAuthServices.changePassword,
    getSuccessDescription: () => t('toast.success'),
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = async (data: ProfilePasswordFormValues) => {
    if (!isOnline) {
      return;
    }

    await changePassword(data);
  };

  return (
    <Card className="border-border bg-surface rounded-xl border shadow-sm">
      <SectionHeader
        icon={ShieldCheck}
        title={t('title')}
        description={t('description')}
      />

      <Card.Content className="p-4 pt-5 lg:p-6 lg:pt-5">
        <form
          aria-label={t('ariaLabel')}
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <PasswordField
                label={t('fields.currentPassword.label')}
                placeholder={t('fields.currentPassword.placeholder')}
                registration={register('currentPassword')}
                error={errors.currentPassword?.message}
                autoComplete="current-password"
                showPasswordLabel={t('fields.currentPassword.show')}
                hidePasswordLabel={t('fields.currentPassword.hide')}
                isDisabled={!isOnline || isPending}
              />
            </div>

            <PasswordField
              label={t('fields.newPassword.label')}
              placeholder={t('fields.newPassword.placeholder')}
              registration={register('newPassword')}
              error={errors.newPassword?.message}
              autoComplete="new-password"
              showPasswordLabel={t('fields.newPassword.show')}
              hidePasswordLabel={t('fields.newPassword.hide')}
              isDisabled={!isOnline || isPending}
            />

            <PasswordField
              label={t('fields.confirmPassword.label')}
              placeholder={t('fields.confirmPassword.placeholder')}
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              showPasswordLabel={t('fields.confirmPassword.show')}
              hidePasswordLabel={t('fields.confirmPassword.hide')}
              isDisabled={!isOnline || isPending}
            />
          </div>

          {!isOnline ? (
            <OnlineOnlyNotice>{tPwa('password')}</OnlineOnlyNotice>
          ) : null}

          <div className="border-separator flex border-t pt-4">
            <Button
              fullWidth
              type="submit"
              size="md"
              variant="primary"
              className="lg:ms-auto lg:w-auto"
              isDisabled={!isOnline}
              isPending={isPending}
            >
              {t('actions.submit')}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default AccountSecurity;
