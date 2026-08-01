import { z } from 'zod';

interface CreateTicketSchemaMessages {
  titleRequired: string;
  titleMinLength: string;
  titleMaxLength: string;
  departmentRequired: string;
  initialMessageRequired: string;
  initialMessageMinLength: string;
  initialMessageMaxLength: string;
}

export const createTicketSchema = (messages: CreateTicketSchemaMessages) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, messages.titleRequired)
      .min(3, messages.titleMinLength)
      .max(120, messages.titleMaxLength),

    departmentId: z.string().trim().min(1, messages.departmentRequired),

    initialMessage: z
      .string()
      .trim()
      .min(1, messages.initialMessageRequired)
      .min(10, messages.initialMessageMinLength)
      .max(2000, messages.initialMessageMaxLength),
  });

export type CreateTicketFormValues = z.infer<
  ReturnType<typeof createTicketSchema>
>;
