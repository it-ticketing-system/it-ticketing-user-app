import { z } from 'zod';

interface LoginSchemaMessages {
  usernameRequired: string;
  passwordRequired: string;
}

export const createLoginSchema = (messages: LoginSchemaMessages) =>
  z.object({
    username: z.string().trim().min(1, messages.usernameRequired),
    password: z.string().min(1, messages.passwordRequired),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
