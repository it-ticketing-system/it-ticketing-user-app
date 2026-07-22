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
import {
  createRegisterSchema,
  type RegisterFormValues,
} from './register.schema';
import type { RegisterRequestDto } from '@/apis/services/auth/_dto';
import type { AuthUserModel } from '@/models/auth';

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
    RegisterRequestDto,
    AuthUserModel
  >({
    requestFn: authServices.register,

    getSuccessDescription: (data) =>
      t('toast.success', {
        name: data.name,
      }),

    onSuccess: () => {
      router.replace(ROUTES.login);
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const payload: RegisterRequestDto = {
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
        <TextField
          isInvalid={Boolean(errors.name)}
          className="flex w-full flex-col gap-2"
        >
          <Label className="text-body-sm text-foreground font-medium">
            {t('fields.name.label')}
          </Label>

          <Input
            {...registerField('name')}
            fullWidth
            autoComplete="name"
            placeholder={t('fields.name.placeholder')}
            className="border-border bg-surface text-foreground h-11 w-full rounded-md border px-3 placeholder:text-neutral-400"
          />

          <FieldError>{errors.name?.message}</FieldError>
        </TextField>

        <TextField
          isInvalid={Boolean(errors.username)}
          className="flex w-full flex-col gap-2"
        >
          <Label className="text-body-sm text-foreground font-medium">
            {t('fields.username.label')}
          </Label>

          <Input
            {...registerField('username')}
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
            {...registerField('password')}
            fullWidth
            type="password"
            autoComplete="new-password"
            placeholder={t('fields.password.placeholder')}
            className="border-border bg-surface text-foreground h-11 w-full rounded-md border px-3 placeholder:text-neutral-400"
          />

          <FieldError>{errors.password?.message}</FieldError>
        </TextField>

        <TextField
          isInvalid={Boolean(errors.confirmPassword)}
          className="flex w-full flex-col gap-2"
        >
          <Label className="text-body-sm text-foreground font-medium">
            {t('fields.confirmPassword.label')}
          </Label>

          <Input
            {...registerField('confirmPassword')}
            fullWidth
            type="password"
            autoComplete="new-password"
            placeholder={t('fields.confirmPassword.placeholder')}
            className="border-border bg-surface text-foreground h-11 w-full rounded-md border px-3 placeholder:text-neutral-400"
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
