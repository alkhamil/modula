import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const productNameRules: RegisterOptions<FormValues, 'productName'> = {
  required: 'Product Name is required.',
  minLength: { value: 3, message: 'Product Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Product Name cannot be greater than 100 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const productCodeRules: RegisterOptions<FormValues, 'productCode'> = {
  required: 'Product Code is required.',
  minLength: { value: 4, message: 'Product Code must be at least 4 characters.' },
  maxLength: { value: 4, message: 'Product Code cannot be greater than 4 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const categoryRules: RegisterOptions<FormValues, 'category'> = {
  required: 'Category is required.',
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};
