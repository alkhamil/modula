import { useEffect, useState, type ComponentProps } from 'react';
import { InputField, Textarea } from '../../../../shared/components/ui';

type InputProps = Omit<ComponentProps<typeof InputField>, 'value' | 'onChange'>;
type TextareaProps = Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange'>;

/** Demo interaktif InputField: `value` hanya nilai awal; mengetik mengubah state lokal. */
export function InputFieldDemo({ value = '', ...rest }: { value?: string } & InputProps) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  // Playground bisa mengisi `prepend` dan `prependGroup` sekaligus; abaikan batasan union tipe.
  const props = rest as ComponentProps<typeof InputField>;
  return <InputField {...props} value={text} onChange={(e) => setText(e.target.value)} />;
}

/** Demo interaktif Textarea. */
export function TextareaDemo({ value = '', ...rest }: { value?: string } & TextareaProps) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return <Textarea value={text} onChange={(e) => setText(e.target.value)} {...rest} />;
}
