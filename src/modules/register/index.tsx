'use client';

import {
  Button,
  FieldError,
  Input,
  Label,
  Link,
  TextField,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useForm } from 'react-hook-form';
import { clientAuthServices } from '@/apis/services/auth/client';
import { OnlineOnlyNotice, PasswordField } from '@/components/shared';
import { ROUTES } from '@/constants';
import { usePostRequest, usePwa } from '@/hooks';
import {
  createRegisterSchema,
  REGISTER_NAME_MAX_LENGTH,
  REGISTER_NAME_MIN_LENGTH,
  REGISTER_PASSWORD_MAX_LENGTH,
  REGISTER_PASSWORD_MIN_LENGTH,
  REGISTER_USERNAME_MAX_LENGTH,
  REGISTER_USERNAME_MIN_LENGTH,
  type RegisterFormValues,
} from './register.schema';
import type {
  RegisterRequest,
  RegisterResult,
} from '@/apis/services/auth/client';

const RegisterModule = () => {
  const t = useTranslations('auth.register');
  const tV = useTranslations('auth.validation');
  const tPwa = useTranslations('pwa.onlineOnly');
  const { isOnline } = usePwa();
  const router = useRouter();
  const [forceMaskedPasswords, setForceMaskedPasswords] = useState(false);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        nameRequired: tV('name.required'),
        nameMinLength: tV('name.minLength', {
          min: REGISTER_NAME_MIN_LENGTH,
        }),
        nameMaxLength: tV('name.maxLength', {
          max: REGISTER_NAME_MAX_LENGTH,
        }),

        usernameRequired: tV('username.required'),
        usernameMinLength: tV('username.minLength', {
          min: REGISTER_USERNAME_MIN_LENGTH,
        }),
        usernameMaxLength: tV('username.maxLength', {
          max: REGISTER_USERNAME_MAX_LENGTH,
        }),
        usernameInvalid: tV('username.invalid'),

        passwordRequired: tV('password.required'),
        passwordMinLength: tV('password.minLength', {
          min: REGISTER_PASSWORD_MIN_LENGTH,
        }),
        passwordMaxLength: tV('password.maxLength', {
          max: REGISTER_PASSWORD_MAX_LENGTH,
        }),
        passwordLowercase: tV('password.lowercase'),
        passwordUppercase: tV('password.uppercase'),
        passwordNumber: tV('password.number'),
        passwordSpecialCharacter: tV('password.specialCharacter'),

        confirmPasswordRequired: tV('confirmPassword.required'),

        passwordMismatch: tV('confirmPassword.mismatch'),
      }),
    [tV],
  );

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
    },

    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const { mutateAsync: registerUser, isPending } = usePostRequest<
    RegisterRequest,
    RegisterResult
  >({
    requestFn: clientAuthServices.register,

    getSuccessDescription: (data) =>
      t('toast.success', {
        name: data.name,
      }),

    onSuccess: () => {
      router.replace(ROUTES.login);
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!isOnline) {
      return;
    }

    const payload: RegisterRequest = {
      name: data.name,
      username: data.username,
      password: data.password,
    };
    await registerUser(payload);
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <form
      onSubmitCapture={() => {
        flushSync(() => {
          setForceMaskedPasswords(true);
        });
      }}
      onSubmit={(event) => {
        const submitResult = handleFormSubmit(event);
        queueMicrotask(() => {
          setForceMaskedPasswords(false);
        });
        return submitResult;
      }}
      className="flex w-full max-w-115 flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 text-foreground">{t('title')}</h1>

        <p className="text-body-sm text-muted">{t('description')}</p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <TextField fullWidth isInvalid={Boolean(errors.name)}>
          <Label>{t('fields.name.label')}</Label>

          <Input
            {...registerField('name')}
            autoComplete="name"
            disabled={!isOnline || isPending}
            placeholder={t('fields.name.placeholder')}
          />

          <FieldError>{errors.name?.message}</FieldError>
        </TextField>

        <TextField fullWidth isInvalid={Boolean(errors.username)}>
          <Label>{t('fields.username.label')}</Label>

          <Input
            {...registerField('username')}
            autoComplete="username"
            disabled={!isOnline || isPending}
            placeholder={t('fields.username.placeholder')}
          />

          <FieldError>{errors.username?.message}</FieldError>
        </TextField>

        <PasswordField
          label={t('fields.password.label')}
          placeholder={t('fields.password.placeholder')}
          registration={registerField('password')}
          error={errors.password?.message}
          autoComplete="new-password"
          showPasswordLabel={t('fields.password.show')}
          hidePasswordLabel={t('fields.password.hide')}
          isDisabled={!isOnline || isPending}
          forceMasked={forceMaskedPasswords}
        />

        <PasswordField
          label={t('fields.confirmPassword.label')}
          placeholder={t('fields.confirmPassword.placeholder')}
          registration={registerField('confirmPassword')}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          showPasswordLabel={t('fields.confirmPassword.show')}
          hidePasswordLabel={t('fields.confirmPassword.hide')}
          isDisabled={!isOnline || isPending}
          forceMasked={forceMaskedPasswords}
        />
      </div>

      {!isOnline ? (
        <OnlineOnlyNotice>{tPwa('register')}</OnlineOnlyNotice>
      ) : null}

      <div className="flex w-full flex-col gap-3">
        <Button
          fullWidth
          size="md"
          type="submit"
          isPending={isPending}
          isDisabled={!isOnline}
        >
          {t('actions.submit')}
        </Button>

        <p className="text-body-sm text-muted text-center">
          {t('actions.hasAccount')}{' '}
          <Link href={ROUTES.login}>{t('actions.login')}</Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterModule;
