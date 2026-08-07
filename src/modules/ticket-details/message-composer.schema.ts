import { z } from 'zod';

interface MessageComposerSchemaMessages {
  bodyRequired: string;
  bodyMaxLength: string;
}

export const createMessageComposerSchema = (
  messages: MessageComposerSchemaMessages,
) =>
  z.object({
    body: z
      .string()
      .trim()
      .min(1, messages.bodyRequired)
      .max(4000, messages.bodyMaxLength),
  });

export type MessageComposerFormValues = z.infer<
  ReturnType<typeof createMessageComposerSchema>
>;
