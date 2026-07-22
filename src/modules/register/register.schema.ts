import { z } from 'zod';

interface RegisterSchemaMessages {
  nameRequired: string;
  nameMinLength: string;

  usernameRequired: string;
  usernameMinLength: string;

  passwordRequired: string;
  passwordMinLength: string;
  passwordLowercase: string;
  passwordUppercase: string;
  passwordNumber: string;
  passwordSpecialCharacter: string;

  confirmPasswordRequired: string;
  passwordMismatch: string;
}

export const createRegisterSchema = (messages: RegisterSchemaMessages) =>
  z
    .object({
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

      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMinLength)
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
