import { useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup, RadioButton, RadioButtonGroup, Toggle } from '../../../../shared/components/ui';

type Rest<T> = Omit<T, 'value' | 'onChange' | 'checked'>;

/** Demo interaktif Checkbox: `checked` hanya nilai awal; klik mengubah state lokal. */
export function CheckboxDemo({ checked = false, ...rest }: { checked?: boolean } & Rest<React.ComponentProps<typeof Checkbox>>) {
  const [value, setValue] = useState(checked);
  useEffect(() => setValue(checked), [checked]);
  return <Checkbox value={value} onChange={setValue} {...rest} />;
}

/** Demo interaktif RadioButton (satu opsi; klik memilihnya). */
export function RadioDemo({ checked = false, ...rest }: { checked?: boolean } & Rest<React.ComponentProps<typeof RadioButton>>) {
  const [value, setValue] = useState(checked);
  useEffect(() => setValue(checked), [checked]);
  return <RadioButton value="option" checked={value} onChange={() => setValue(true)} {...rest} />;
}

/** Demo interaktif Toggle. */
export function ToggleDemo({ checked = false, ...rest }: { checked?: boolean } & Rest<React.ComponentProps<typeof Toggle>>) {
  const [value, setValue] = useState(checked);
  useEffect(() => setValue(checked), [checked]);
  return <Toggle value={value} onChange={setValue} {...rest} />;
}

export const GROUP_OPTIONS = [
  { label: 'Admin', value: 'admin', hint: 'Full access' },
  { label: 'Editor', value: 'editor', hint: 'Can edit content' },
  { label: 'Viewer', value: 'viewer', hint: 'Read only' },
];

type GroupRest<T> = Omit<T, 'value' | 'onChange' | 'options'>;

/** Demo interaktif CheckboxGroup: `value` hanya nilai awal (array). */
export function CheckboxGroupDemo({ value = [], ...rest }: { value?: string[] } & GroupRest<React.ComponentProps<typeof CheckboxGroup>>) {
  const [selected, setSelected] = useState<string[]>(value);
  useEffect(() => setSelected(value), [value]);
  return <CheckboxGroup options={GROUP_OPTIONS} value={selected} onChange={setSelected} {...rest} />;
}

/** Demo interaktif RadioButtonGroup: `value` hanya nilai awal. */
export function RadioGroupDemo({ value = '', ...rest }: { value?: string } & GroupRest<React.ComponentProps<typeof RadioButtonGroup>>) {
  const [selected, setSelected] = useState(value);
  useEffect(() => setSelected(value), [value]);
  return <RadioButtonGroup options={GROUP_OPTIONS} value={selected} onChange={setSelected} {...rest} />;
}
