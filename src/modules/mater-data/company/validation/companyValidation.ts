import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const companyNameRules: RegisterOptions<FormValues, 'companyName'> = {
  required: 'Company Name is required.',
  minLength: { value: 3, message: 'Company Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Company Name cannot be greater than 100 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const companyGroupRules: RegisterOptions<FormValues, 'companyGroup'> = {
  required: 'Company Group is required.',
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};

export const companyAddressRules: RegisterOptions<FormValues, 'companyAddress'> = {};
