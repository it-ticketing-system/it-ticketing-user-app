import { Card } from '@heroui/react';
import { useTranslations } from 'next-intl';
import MessageComposer from './message-composer';
import TicketMessage from './ticket-message';
import type { TicketMessage as TicketMessageData } from './types';
import type { TicketStatus } from '@/models';

interface TicketConversationProps {
  ticketId: string;
  messages: TicketMessageData[];
  status: TicketStatus;
}

const TicketConversation = ({
  ticketId,
  messages,
  status,
}: TicketConversationProps) => {
  const t = useTranslations('ticketDetails.conversation');

  const isClosed = status === 'closed';

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center gap-3 lg:hidden">
        <div className="bg-separator h-px flex-1" />

        <h2 className="text-title text-foreground shrink-0">{t('title')}</h2>

        <div className="bg-separator h-px flex-1" />
      </div>

      <Card
        variant="transparent"
        className="lg:border-border lg:bg-surface flex min-h-0 flex-1 flex-col border-0 bg-transparent px-0 shadow-none lg:rounded-xl lg:border lg:shadow-sm"
      >
        <Card.Content className="min-h-0 flex-1 space-y-3 overflow-y-auto p-0 lg:p-6">
          {messages.length ? (
            messages.map((message) => (
              <TicketMessage key={message.id} message={message} />
            ))
          ) : (
            <div className="flex min-h-40 items-center justify-center text-center">
              <p className="text-body-sm text-muted">{t('empty')}</p>
            </div>
          )}
        </Card.Content>

        <Card.Footer className="border-separator bg-surface mt-4 block shrink-0 border-t px-0 pt-4 lg:mt-0 lg:p-4">
          <MessageComposer ticketId={ticketId} isClosed={isClosed} />
        </Card.Footer>
      </Card>
    </section>
  );
};

export default TicketConversation;
