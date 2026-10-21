import { useEffect, useState } from 'react';
import { Checkbox, RadioButton, Toggle } from '../../../../shared/components/ui';

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
