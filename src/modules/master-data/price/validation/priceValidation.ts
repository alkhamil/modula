import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';

export function getProductRules(t: TFunction): RegisterOptions<FormValues, 'product'> {
  return {
  required: t('validation.required', { label: t('price.fields.product.label') }),
};
}

export function getPriceRules(t: TFunction): RegisterOptions<FormValues, 'price'> {
  return {
  required: t('validation.required', { label: t('price.fields.price.label') }),
  min: { value: 0, message: t('validation.minValue', { label: t('price.fields.price.label'), count: 0 }) },
  max: { value: 1000, message: t('validation.maxValue', { label: t('price.fields.price.label'), count: 1000 }) },
};
}
