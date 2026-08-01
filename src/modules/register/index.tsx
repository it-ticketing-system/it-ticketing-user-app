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
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { clientAuthServices } from '@/apis/services/auth/client';
import { ROUTES } from '@/constants';
import { usePostRequest } from '@/hooks';
import {
  createRegisterSchema,
  type RegisterFormValues,
} from './register.schema';
import type {
  RegisterRequest,
  RegisterResult,
} from '@/apis/services/auth/client';

const RegisterModule = () => {
  const t = useTranslations('auth.register');
  const tV = useTranslations('auth.validation');
  const router = useRouter();

  const schema = useMemo(
    () =>
      createRegisterSchema({
        nameRequired: tV('name.required'),
        nameMinLength: tV('name.minLength'),

        usernameRequired: tV('username.required'),
        usernameMinLength: tV('username.minLength'),

        passwordRequired: tV('password.required'),
        passwordMinLength: tV('password.minLength'),
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

    mode: 'onSubmit',
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
    const payload: RegisterRequest = {
      name: data.name,
      username: data.username,
      password: data.password,
    };
    await registerUser(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
            placeholder={t('fields.name.placeholder')}
          />

          <FieldError>{errors.name?.message}</FieldError>
        </TextField>

        <TextField fullWidth isInvalid={Boolean(errors.username)}>
          <Label>{t('fields.username.label')}</Label>

          <Input
            {...registerField('username')}
            autoComplete="username"
            placeholder={t('fields.username.placeholder')}
          />

          <FieldError>{errors.username?.message}</FieldError>
        </TextField>

        <TextField fullWidth isInvalid={Boolean(errors.password)}>
          <Label>{t('fields.password.label')}</Label>

          <Input
            {...registerField('password')}
            type="password"
            autoComplete="new-password"
            placeholder={t('fields.password.placeholder')}
          />

          <FieldError>{errors.password?.message}</FieldError>
        </TextField>

        <TextField fullWidth isInvalid={Boolean(errors.confirmPassword)}>
          <Label>{t('fields.confirmPassword.label')}</Label>

          <Input
            {...registerField('confirmPassword')}
            type="password"
            autoComplete="new-password"
            placeholder={t('fields.confirmPassword.placeholder')}
          />

          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </TextField>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button fullWidth size="md" type="submit" isPending={isPending}>
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
