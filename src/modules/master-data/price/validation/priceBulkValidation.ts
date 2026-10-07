import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreatePricePayload } from '../types';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreatePricePayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_PRICE_HEADERS = ["Product","Price"];

/** Example row in the bulk upload template. */
export const BULK_PRICE_EXAMPLE = ["PRODUCT_1",100];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkPriceRow(
  row: Record<string, unknown>,
  _isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const productValue = String(row["Product"] ?? '').trim();
  if (!productValue) errors.push({ field: "Product", message: t('validation.required', { label: t('price.fields.product.label') }) });
  const priceRaw = String(row["Price"] ?? '').trim();
  const priceValue = priceRaw === '' ? NaN : Number(priceRaw);
  if (priceRaw === '') errors.push({ field: "Price", message: t('validation.required', { label: t('price.fields.price.label') }) });
  else if (Number.isNaN(priceValue)) errors.push({ field: "Price", message: t('validation.number', { label: t('price.fields.price.label') }) });
  if (!Number.isNaN(priceValue) && priceValue < 0) errors.push({ field: "Price", message: t('validation.minValue', { label: t('price.fields.price.label'), count: 0 }) });
  if (!Number.isNaN(priceValue) && priceValue > 1000) errors.push({ field: "Price", message: t('validation.maxValue', { label: t('price.fields.price.label'), count: 1000 }) });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    product: productValue,
    price: priceValue,
    },
    errors,
  };
}
