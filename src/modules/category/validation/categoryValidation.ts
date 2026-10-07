import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';

export function getNameRules(_t: TFunction): RegisterOptions<FormValues, 'name'> {
  return {};
}
