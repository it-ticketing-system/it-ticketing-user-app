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
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { clientAuthServices } from '@/apis/services/auth/client';
import { PasswordField } from '@/components/shared';
import { QUERY_KEYS, ROUTES } from '@/constants';
import { usePostRequest } from '@/hooks';
import { createLoginSchema, type LoginFormValues } from './login.schema';
import type { LoginResult } from '@/apis/services/auth/client';

const LoginModule = () => {
  const t = useTranslations('auth.login');
  const tV = useTranslations('auth.validation');

  const router = useRouter();
  const queryClient = useQueryClient();

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

    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const { mutateAsync: login, isPending } = usePostRequest<
    LoginFormValues,
    LoginResult
  >({
    requestFn: clientAuthServices.login,

    getSuccessDescription: (data) =>
      t('toast.success', {
        name: data.name,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.auth.me,
      });
      router.push(ROUTES.tickets);
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
        <TextField fullWidth isInvalid={Boolean(errors.username)}>
          <Label>{t('fields.username.label')}</Label>

          <Input
            {...register('username')}
            autoComplete="username"
            placeholder={t('fields.username.placeholder')}
          />

          <FieldError>{errors.username?.message}</FieldError>
        </TextField>

        <PasswordField
          label={t('fields.password.label')}
          placeholder={t('fields.password.placeholder')}
          registration={register('password')}
          error={errors.password?.message}
          autoComplete="current-password"
          showPasswordLabel={t('fields.password.show')}
          hidePasswordLabel={t('fields.password.hide')}
        />
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
