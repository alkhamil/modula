import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const nameRules: RegisterOptions<FormValues, 'name'> = {
  required: 'Name is required.',
  minLength: { value: 3, message: 'Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Name cannot be greater than 100 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const descriptionRules: RegisterOptions<FormValues, 'description'> = {
  required: 'Description is required.',
  minLength: { value: 10, message: 'Description must be at least 10 characters.' },
  maxLength: { value: 500, message: 'Description cannot be greater than 500 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};
