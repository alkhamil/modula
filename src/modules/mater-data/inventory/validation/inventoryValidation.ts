import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '../../../../shared/utils';

export const inventoryNameRules: RegisterOptions<FormValues, 'inventoryName'> = {
  required: 'Inventory Name is required.',
  minLength: { value: 3, message: 'Inventory Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Inventory Name cannot be greater than 100 characters.' },
  validate: (value: string) => !hasEmoticon(value || '') || WITHOUT_EMOTICON_MESSAGE,
};
