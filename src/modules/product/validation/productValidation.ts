import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';

export function getCategoryRules(_t: TFunction): RegisterOptions<FormValues, 'category'> {
  return {};
}
