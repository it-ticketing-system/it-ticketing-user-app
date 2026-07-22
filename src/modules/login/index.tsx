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
import { authServices } from '@/apis/services/auth/client';
import { ROUTES } from '@/constants';
import { usePostRequest } from '@/hooks';
import { createLoginSchema, type LoginFormValues } from './login.schema';
import type { AuthUserModel } from '@/models/auth';

const LoginModule = () => {
  const t = useTranslations('auth.login');
  const tV = useTranslations('auth.validation');

  const router = useRouter();

  const schema = useMemo(
    () =>
      createLoginSchema({
        usernameRequired: tV('username.required'),
        passwordRequired: tV('password.required'),
      }),
    [tV],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      username: '',
      password: '',
    },

    mode: 'onSubmit',
  });

  const { mutateAsync: login, isPending } = usePostRequest<
    LoginFormValues,
    AuthUserModel
  >({
    requestFn: authServices.login,

    getSuccessDescription: (data) =>
      t('toast.success', {
        name: data.name,
      }),

    onSuccess: () => {
      router.push('/pwa');
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-105 flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 text-foreground">{t('title')}</h1>

        <p className="text-body-sm text-muted">{t('description')}</p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <TextField
          isInvalid={Boolean(errors.username)}
          className="flex w-full flex-col gap-2"
        >
          <Label className="text-body-sm text-foreground font-medium">
            {t('fields.username.label')}
          </Label>

          <Input
            {...register('username')}
            fullWidth
            autoComplete="username"
            placeholder={t('fields.username.placeholder')}
            className="border-border bg-surface text-foreground h-11 w-full rounded-md border px-3 placeholder:text-neutral-400"
          />

          <FieldError>{errors.username?.message}</FieldError>
        </TextField>

        <TextField
          isInvalid={Boolean(errors.password)}
          className="flex w-full flex-col gap-2"
        >
          <Label className="text-body-sm text-foreground font-medium">
            {t('fields.password.label')}
          </Label>

          <Input
            {...register('password')}
            fullWidth
            type="password"
            autoComplete="current-password"
            placeholder={t('fields.password.placeholder')}
            className="border-border bg-surface text-foreground h-11 w-full rounded-md border px-3 placeholder:text-neutral-400"
          />

          <FieldError>{errors.password?.message}</FieldError>
        </TextField>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button fullWidth size="md" type="submit" isPending={isPending}>
          {t('actions.submit')}
        </Button>

        <p className="text-body-sm text-muted text-center">
          {t('actions.noAccount')}{' '}
          <Link href={ROUTES.register}>{t('actions.register')}</Link>
        </p>
      </div>
    </form>
  );
};

export default LoginModule;
