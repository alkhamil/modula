import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';
import { hasEmoticon } from '../../../shared/utils';

export function getRegionNameRules(t: TFunction): RegisterOptions<FormValues, 'regionName'> {
  return {
  required: t('validation.required', { label: t('region.fields.regionName.label') }),
  minLength: { value: 3, message: t('validation.minLength', { label: t('region.fields.regionName.label'), count: 3 }) },
  maxLength: { value: 100, message: t('validation.maxLength', { label: t('region.fields.regionName.label'), count: 100 }) },
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}

export function getDescriptionRules(t: TFunction): RegisterOptions<FormValues, 'description'> {
  return {
  minLength: { value: 10, message: t('validation.minLength', { label: t('region.fields.description.label'), count: 10 }) },
  maxLength: { value: 100, message: t('validation.maxLength', { label: t('region.fields.description.label'), count: 100 }) },
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}
