import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const colorNameRules: RegisterOptions<FormValues, 'colorName'> = {
  required: 'colorName is required.',
  maxLength: { value: 10, message: 'colorName cannot be greater than 10 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const hexCodeRules: RegisterOptions<FormValues, 'hexCode'> = {
  required: 'hexCode is required.',
  minLength: { value: 6, message: 'hexCode must be at least 6 characters.' },
  maxLength: { value: 6, message: 'hexCode cannot be greater than 6 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};
