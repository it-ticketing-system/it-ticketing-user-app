import { Avatar } from '@heroui/react';
import { Bell, Info, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FileAttachmentLink } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';
import type { TicketMessage } from './types';
import type { TicketSystemMessageTone } from '@/models';

interface TicketMessageProps {
  message: TicketMessage;
}

const SYSTEM_STYLES: Record<TicketSystemMessageTone, string> = {
  info: 'border-info-200 bg-info-soft text-info-soft-foreground',
  warning: 'border-warning-200 bg-warning-soft text-warning-soft-foreground',
  neutral: 'border-border bg-surface-secondary text-foreground',
};

const SystemIcon = ({ tone }: { tone: TicketSystemMessageTone }) => {
  switch (tone) {
    case 'warning':
      return (
        <Bell
          aria-hidden="true"
          className={`mt-0.5 ${ICON_SIZE_CLASS.sm} shrink-0`}
        />
      );

    case 'neutral':
      return (
        <Settings
          aria-hidden="true"
          className={`mt-0.5 ${ICON_SIZE_CLASS.sm} shrink-0`}
        />
      );

    default:
      return (
        <Info
          aria-hidden="true"
          className={`mt-0.5 ${ICON_SIZE_CLASS.sm} shrink-0`}
        />
      );
  }
};

const SenderAvatar = ({ src, name }: { src?: string; name: string }) => {
  return (
    <Avatar size="md">
      {src ? <Avatar.Image src={src} alt={name} /> : null}

      <Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback>
    </Avatar>
  );
};

const SystemMessage = ({ message }: TicketMessageProps) => {
  const tone = message.systemTone ?? 'neutral';

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-2xl items-start gap-3 rounded-lg border p-3',
        SYSTEM_STYLES[tone],
      )}
    >
      <SystemIcon tone={tone} />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="text-caption font-semibold">
            {message.senderName}
          </span>

          <time dir="ltr" className="text-caption opacity-70">
            {message.createdAtLabel}
          </time>
        </div>

        <p className="text-body-sm whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {message.body}
        </p>
      </div>
    </div>
  );
};

const TicketMessage = ({ message }: TicketMessageProps) => {
  const t = useTranslations('ticketDetails');

  if (message.type === 'system') {
    return <SystemMessage message={message} />;
  }

  const isUser = message.type === 'user';

  const senderName =
    message.senderName ??
    (isUser ? t('conversation.you') : t('conversation.support'));

  const bubbleClassName = isUser
    ? 'border-primary-100 bg-accent-soft'
    : 'border-border bg-surface-secondary';

  return (
    <article
      className={cn(
        'flex w-full items-start gap-3',
        isUser ? 'justify-start' : 'justify-end',
      )}
    >
      {isUser ? (
        <SenderAvatar src={message.senderAvatarUrl} name={senderName} />
      ) : null}

      <div
        className={cn(
          'w-[calc(100%-44px)] min-w-0 rounded-xl border p-4 lg:w-auto lg:max-w-[75%] lg:px-5',
          bubbleClassName,
        )}
      >
        <header className="mb-2 flex items-center justify-between gap-4">
          <span
            className={cn(
              'text-caption font-semibold',
              isUser ? 'text-accent' : 'text-foreground',
            )}
          >
            {senderName}
          </span>

          <time dir="ltr" className="text-caption text-muted shrink-0">
            {message.createdAtLabel}
          </time>
        </header>

        <p className="text-body-sm text-foreground whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {message.body}
        </p>

        {message.attachments?.length ? (
          <div className="mt-4 space-y-2">
            <p className="text-caption text-muted">
              {t('conversation.attachments')}
            </p>

            <div className="grid min-w-0 gap-2 lg:grid-cols-2">
              {message.attachments.map((attachment) => (
                <FileAttachmentLink
                  key={attachment.id}
                  attachment={attachment}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {!isUser ? (
        <SenderAvatar src={message.senderAvatarUrl} name={senderName} />
      ) : null}
    </article>
  );
};

export default TicketMessage;
