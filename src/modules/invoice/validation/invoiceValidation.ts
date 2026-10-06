import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';
import { hasEmoticon } from '../../../shared/utils';

export function getInvoiceNumberRules(t: TFunction): RegisterOptions<FormValues, 'invoiceNumber'> {
  return {
  required: t('validation.required', { label: t('invoice.fields.invoiceNumber.label') }),
  minLength: { value: 6, message: t('validation.minLength', { label: t('invoice.fields.invoiceNumber.label'), count: 6 }) },
  maxLength: { value: 6, message: t('validation.maxLength', { label: t('invoice.fields.invoiceNumber.label'), count: 6 }) },
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}

export function getDateOfIssueRules(t: TFunction): RegisterOptions<FormValues, 'dateOfIssue'> {
  return {
  required: t('validation.required', { label: t('invoice.fields.dateOfIssue.label') }),
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}

export function getDueDateRules(t: TFunction): RegisterOptions<FormValues, 'dueDate'> {
  return {
  required: t('validation.required', { label: t('invoice.fields.dueDate.label') }),
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}

export function getSellerRules(t: TFunction): RegisterOptions<FormValues, 'seller'> {
  return {
  required: t('validation.required', { label: t('invoice.fields.seller.label') }),
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}

export function getBuyerRules(t: TFunction): RegisterOptions<FormValues, 'buyer'> {
  return {
  required: t('validation.required', { label: t('invoice.fields.buyer.label') }),
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
};
}

export function getDetailProductRules(t: TFunction): RegisterOptions<FormValues, 'detailProduct'> {
  return {
  validate: (value: unknown[]) => (value && value.length > 0) || t('validation.required', { label: t('invoice.fields.detailProduct.label') }),
};
}
