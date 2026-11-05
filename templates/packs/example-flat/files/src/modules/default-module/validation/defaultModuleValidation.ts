import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';

export function getNameRules(t: TFunction): RegisterOptions<FormValues, 'name'> {
  return {
  required: t('validation.required', { label: t('default_module.fields.name.label') }),
  maxLength: { value: 100, message: t('validation.maxLength', { label: t('default_module.fields.name.label'), count: 100 }) },
};
}

export function getCodeRules(t: TFunction): RegisterOptions<FormValues, 'code'> {
  return {
  required: t('validation.required', { label: t('default_module.fields.code.label') }),
  maxLength: { value: 30, message: t('validation.maxLength', { label: t('default_module.fields.code.label'), count: 30 }) },
};
}

export function getSortOrderRules(_t: TFunction): RegisterOptions<FormValues, 'sortOrder'> {
  return {};
}

export function getDescriptionRules(t: TFunction): RegisterOptions<FormValues, 'description'> {
  return {
  maxLength: { value: 500, message: t('validation.maxLength', { label: t('default_module.fields.description.label'), count: 500 }) },
};
}
