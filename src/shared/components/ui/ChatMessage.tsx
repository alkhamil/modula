import type { ReactNode } from 'react';
import Avatar from './Avatar';
import { CheckCircle } from '../icons';

interface ChatMessageProps {
  /** Tipe WDS (Chat message types): received | sent. */
  type?: 'received' | 'sent';
  name?: string;
  avatar?: ReactNode;
  message: ReactNode;
  time?: ReactNode;
  /** Tanda terkirim (hanya `sent`). */
  receipt?: boolean;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  testId?: string;
}

/** Chat Message WDS: gelembung pesan diterima / terkirim. */
function ChatMessage({
  type = 'received',
  name,
  avatar,
  message,
  time,
  receipt = false,
  size = 'md',
  className = '',
  testId,
}: ChatMessageProps) {
  return (
    <div data-testid={testId} data-type={type} data-wds-size={size} className={`wds-chat-message ${className}`}>
      {type === 'received' && (avatar ?? <Avatar name={name ?? '?'} size="sm" />)}
      <div className="wds-chat-message__col">
        {type === 'received' && name && <span className="wds-chat-message__name">{name}</span>}
        <div className="wds-chat-message__bubble">
          <span>{message}</span>
          {(time || (type === 'sent' && receipt)) && (
            <span className="wds-chat-message__meta">
              {time}
              {type === 'sent' && receipt && <CheckCircle />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
