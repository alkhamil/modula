import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../shared/utils';

export const policyNumberRules: RegisterOptions<FormValues, 'policyNumber'> = {
  required: 'Policy Number is required.',
};

export const policyDateRules: RegisterOptions<FormValues, 'policyDate'> = {
  required: 'Policy Date is required.',
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};
