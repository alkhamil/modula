import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';
import { hasEmoticon } from '../../../../shared/utils';

export function getRegionRules(t: TFunction): RegisterOptions<FormValues, 'region'> {
  return {
  required: t('validation.required', { label: t('vendor.fields.region.label') }),
};
}

export function getNameRules(t: TFunction): RegisterOptions<FormValues, 'name'> {
  return {
  required: t('validation.required', { label: t('vendor.fields.name.label') }),
  minLength: { value: 3, message: t('validation.minLength', { label: t('vendor.fields.name.label'), count: 3 }) },
  maxLength: { value: 100, message: t('validation.maxLength', { label: t('vendor.fields.name.label'), count: 100 }) },
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}
