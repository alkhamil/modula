import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const categoryNameRules: RegisterOptions<FormValues, 'categoryName'> = {
  required: 'Category Name is required.',
  minLength: { value: 3, message: 'Category Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Category Name cannot be greater than 100 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const descriptionRules: RegisterOptions<FormValues, 'description'> = {
  minLength: { value: 10, message: 'Description must be at least 10 characters.' },
  maxLength: { value: 500, message: 'Description cannot be greater than 500 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const sourceRules: RegisterOptions<FormValues, 'source'> = {
  validate: (value: string[]) => (value && value.length > 0) || 'Source is required.',
};
