import { z } from 'zod';

interface ProfileInformationSchemaMessages {
  nameRequired: string;
  nameMinLength: string;
  usernameRequired: string;
  usernameMinLength: string;
}

interface ProfilePasswordSchemaMessages {
  currentPasswordRequired: string;
  newPasswordRequired: string;
  newPasswordMinLength: string;
  newPasswordLowercase: string;
  newPasswordUppercase: string;
  newPasswordNumber: string;
  newPasswordSpecialCharacter: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
}

export const createProfileInformationSchema = (
  messages: ProfileInformationSchemaMessages,
) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameMinLength),

    username: z
      .string()
      .trim()
      .min(1, messages.usernameRequired)
      .min(3, messages.usernameMinLength),
  });

export const createProfilePasswordSchema = (
  messages: ProfilePasswordSchemaMessages,
) =>
  z
    .object({
      currentPassword: z.string().min(1, messages.currentPasswordRequired),

      newPassword: z
        .string()
        .min(1, messages.newPasswordRequired)
        .min(8, messages.newPasswordMinLength)
        .regex(/[a-z]/, messages.newPasswordLowercase)
        .regex(/[A-Z]/, messages.newPasswordUppercase)
        .regex(/[0-9]/, messages.newPasswordNumber)
        .regex(/[^A-Za-z0-9]/, messages.newPasswordSpecialCharacter),

      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ['confirmPassword'],
    });

export type ProfileInformationFormValues = z.infer<
  ReturnType<typeof createProfileInformationSchema>
>;

export type ProfilePasswordFormValues = z.infer<
  ReturnType<typeof createProfilePasswordSchema>
>;
