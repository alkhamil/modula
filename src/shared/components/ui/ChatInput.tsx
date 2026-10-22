import { type FormEvent } from 'react';
import { Paperclip, SendSquare } from '../icons';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
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
  disabled = false,
  className = '',
  testId,
}: ChatInputProps) {
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim()) onSend();
  }
  return (
    <form data-testid={testId} onSubmit={submit} className={`wds-chat-input ${className}`}>
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
