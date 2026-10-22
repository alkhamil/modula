import { useEffect, useState, type ComponentProps } from 'react';
import { DatePicker, Select } from '../../../../shared/components/ui';

export const DEMO_OPTIONS = [
  { label: 'Indonesia', value: 'id' },
  { label: 'Malaysia', value: 'my' },
  { label: 'Singapore', value: 'sg' },
  { label: 'Thailand', value: 'th' },
  { label: 'Vietnam', value: 'vn' },
];

type SelectProps = Omit<ComponentProps<typeof Select>, 'value' | 'onChange' | 'options'>;

/** Demo interaktif Select: `multiple` memilih mode multiple; `value` hanya nilai awal. */
export function SelectDemo({ value = '', multiple = false, ...rest }: { value?: string; multiple?: boolean } & SelectProps) {
  const [single, setSingle] = useState(value);
  const [many, setMany] = useState<string[]>(value ? value.split(',') : []);
  useEffect(() => {
    setSingle(value);
    setMany(value ? value.split(',') : []);
  }, [value]);
  if (multiple) {
    return <Select {...rest} multiple options={DEMO_OPTIONS} value={many} onChange={setMany} />;
  }
  return <Select {...rest} options={DEMO_OPTIONS} value={single} onChange={setSingle} />;
}

type DateProps = Omit<ComponentProps<typeof DatePicker>, 'value' | 'onChange'>;

/** Demo interaktif Date Picker: `range` memilih mode rentang tanggal; `value` hanya nilai awal. */
export function DatePickerDemo({ value = '', range = false, ...rest }: { value?: string; range?: boolean } & DateProps) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  if (range) {
    return <DatePicker {...(rest as ComponentProps<typeof DatePicker>)} range value={text} onChange={setText} />;
  }
  return <DatePicker {...rest} value={text} onChange={setText} />;
}
