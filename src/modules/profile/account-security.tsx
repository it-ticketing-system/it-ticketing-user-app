import { Button, Card } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  clientAuthServices,
  type ChangePasswordRequest,
  type ChangePasswordResult,
} from '@/apis/services/auth/client';
import { OnlineOnlyNotice, PasswordField } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import { useAuth, usePostRequest, usePwa } from '@/hooks';
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
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
    onSuccess: async () => {
      reset();
      setIsOpen(false);
      await logout();
    },
  });

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

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

      <Card.Content className="space-y-5">
        {isOpen ? (
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

            <div className="border-separator flex items-center justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                size="md"
                isDisabled={isPending}
                onPress={handleCancel}
              >
                <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
                {t('actions.cancel')}
              </Button>

              <Button
                type="submit"
                size="md"
                variant="primary"
                isDisabled={!isOnline}
                isPending={isPending}
              >
                {t('actions.submit')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3 text-start lg:flex-row lg:items-center lg:justify-between">
            <p className="text-body-sm text-muted">{t('description')}</p>

            <Button
              type="button"
              variant="outline"
              size="md"
              isDisabled={!isOnline}
              className="ms-auto"
              onPress={() => setIsOpen(true)}
            >
              <KeyRound aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
              {t('actions.toggle')}
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AccountSecurity;
