import { z } from 'zod';

interface RegisterSchemaMessages {
  nameRequired: string;
  nameMinLength: string;
  nameMaxLength: string;

  usernameRequired: string;
  usernameMinLength: string;
  usernameMaxLength: string;
  usernameInvalid: string;

  passwordRequired: string;
  passwordMinLength: string;
  passwordMaxLength: string;
  passwordLowercase: string;
  passwordUppercase: string;
  passwordNumber: string;
  passwordSpecialCharacter: string;

  confirmPasswordRequired: string;
  passwordMismatch: string;
}

export const REGISTER_NAME_MIN_LENGTH = 2;
export const REGISTER_NAME_MAX_LENGTH = 50;
export const REGISTER_USERNAME_MIN_LENGTH = 3;
export const REGISTER_USERNAME_MAX_LENGTH = 30;
export const REGISTER_PASSWORD_MIN_LENGTH = 8;
export const REGISTER_PASSWORD_MAX_LENGTH = 64;

export const createRegisterSchema = (messages: RegisterSchemaMessages) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, messages.nameRequired)
        .min(REGISTER_NAME_MIN_LENGTH, messages.nameMinLength)
        .max(REGISTER_NAME_MAX_LENGTH, messages.nameMaxLength),

      username: z
        .string()
        .trim()
        .min(1, messages.usernameRequired)
        .min(REGISTER_USERNAME_MIN_LENGTH, messages.usernameMinLength)
        .max(REGISTER_USERNAME_MAX_LENGTH, messages.usernameMaxLength)
        .regex(/^[A-Za-z][A-Za-z0-9_]*$/, messages.usernameInvalid),

      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(REGISTER_PASSWORD_MIN_LENGTH, messages.passwordMinLength)
        .max(REGISTER_PASSWORD_MAX_LENGTH, messages.passwordMaxLength)
        .regex(/[a-z]/, messages.passwordLowercase)
        .regex(/[A-Z]/, messages.passwordUppercase)
        .regex(/[0-9]/, messages.passwordNumber)
        .regex(/[^A-Za-z0-9]/, messages.passwordSpecialCharacter),

      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
