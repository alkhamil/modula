import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const branchNameRules: RegisterOptions<FormValues, 'branchName'> = {
  required: 'Branch Name is required.',
  minLength: { value: 3, message: 'Branch Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Branch Name cannot be greater than 100 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const branchCodeRules: RegisterOptions<FormValues, 'branchCode'> = {
  required: 'Branch Code is required.',
  minLength: { value: 5, message: 'Branch Code must be at least 5 characters.' },
  maxLength: { value: 5, message: 'Branch Code cannot be greater than 5 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};
