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
  required: { label: 'Required', needsArg: false, description: 'Required field.' },
  min: {
    label: 'Min',
    needsArg: true,
    description: 'Minimum value (number) / minimum length (string).',
    placeholder: 'min:3',
  },
  max: {
    label: 'Max',
    needsArg: true,
    description: 'Maximum value (number) / maximum length (string).',
    placeholder: 'max:100',
  },
  minLength: {
    label: 'Min Length',
    needsArg: true,
    description: 'Minimum string length.',
    placeholder: 'minLength:3',
  },
  maxLength: {
    label: 'Max Length',
    needsArg: true,
    description: 'Maximum string length.',
    placeholder: 'maxLength:100',
  },
  withoutemoticon: {
    label: 'Without Emoticon',
    needsArg: false,
    description: 'Must not contain emoticons/emoji.',
  },
  email: { label: 'Email', needsArg: false, description: 'Valid email format.' },
  regex: {
    label: 'Regex',
    needsArg: true,
    description: 'Custom pattern, e.g. regex:^\\d+$',
    placeholder: 'regex:^\\d+$',
  },
  unique: {
    label: 'Unique',
    needsArg: false,
    description: 'Checked server-side on submit (no client validation).',
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
