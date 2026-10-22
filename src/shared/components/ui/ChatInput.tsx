import { type FormEvent } from 'react';
import { Paperclip, SendSquare, SmileCircle } from '../icons';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  /** Ukuran WDS (token Size): xs | sm | md | lg | xl. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  testId?: string;
}

/** Chat Input WDS: field pesan dengan lampiran dan tombol kirim. */
function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message',
  size = 'md',
  disabled = false,
  className = '',
  testId,
}: ChatInputProps) {
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim()) onSend();
  }
  return (
    <form data-testid={testId} data-wds-size={size} onSubmit={submit} className={`wds-chat-input ${className}`}>
      <button type="button" aria-label="Emoji" disabled={disabled} className="wds-chat-input__btn">
        <SmileCircle />
      </button>
      <button type="button" aria-label="Attach" disabled={disabled} className="wds-chat-input__btn">
        <Paperclip />
      </button>
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="wds-chat-input__field"
      />
      <button type="submit" aria-label="Send" disabled={disabled || !value.trim()} className="wds-chat-input__btn" data-send>
        <SendSquare />
      </button>
    </form>
  );
}

export default ChatInput;
