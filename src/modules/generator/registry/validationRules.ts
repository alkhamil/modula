export type ValidationRuleName =
  | 'required'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'withoutemoticon'
  | 'email'
  | 'regex'
  | 'unique';

export interface ValidationRuleDef {
  label: string;
  /** Apakah rule butuh argumen (`min:3`). */
  needsArg: boolean;
  description: string;
  placeholder?: string;
}

export const validationRegistry: Record<ValidationRuleName, ValidationRuleDef> = {
  required: { label: 'Required', needsArg: false, description: 'Wajib diisi.' },
  min: {
    label: 'Min',
    needsArg: true,
    description: 'Nilai minimum (number) / panjang minimum (string).',
    placeholder: 'min:3',
  },
  max: {
    label: 'Max',
    needsArg: true,
    description: 'Nilai maksimum (number) / panjang maksimum (string).',
    placeholder: 'max:100',
  },
  minLength: {
    label: 'Min Length',
    needsArg: true,
    description: 'Panjang string minimum.',
    placeholder: 'minLength:3',
  },
  maxLength: {
    label: 'Max Length',
    needsArg: true,
    description: 'Panjang string maksimum.',
    placeholder: 'maxLength:100',
  },
  withoutemoticon: {
    label: 'Without Emoticon',
    needsArg: false,
    description: 'Tidak boleh mengandung emoticon/emoji.',
  },
  email: { label: 'Email', needsArg: false, description: 'Format email valid.' },
  regex: {
    label: 'Regex',
    needsArg: true,
    description: 'Pattern custom, mis. regex:^\\d+$',
    placeholder: 'regex:^\\d+$',
  },
  unique: {
    label: 'Unique',
    needsArg: false,
    description: 'Dicek ke server saat submit (tidak ada validasi client).',
  },
};

export const validationRuleNames = Object.keys(validationRegistry) as ValidationRuleName[];

/** Argumen bawaan saat rule berargumen dicentang (diambil dari placeholder registry). */
export function defaultRuleArg(name: ValidationRuleName): string {
  const placeholder = validationRegistry[name].placeholder ?? '';
  const sep = placeholder.indexOf(':');
  const arg = sep === -1 ? placeholder : placeholder.slice(sep + 1);
  return arg.trim() || '1';
}
