import { t } from 'i18next';
import '../../../shared/i18n';
import type { CreateInvoicePayload } from '../types';
import { hasEmoticon } from '../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateInvoicePayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_INVOICE_HEADERS = ["Invoice Number","Date Of Issue","Due Date","Seller","Buyer"];

/** Example row in the bulk upload template. */
export const BULK_INVOICE_EXAMPLE = ["Sample Invoice Number","2024-01-15","2024-01-15","SELLER_1","BUYER_1"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkInvoiceRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const invoiceNumberValue = String(row["Invoice Number"] ?? '').trim();
  if (!invoiceNumberValue) errors.push({ field: "Invoice Number", message: t('validation.required', { label: t('invoice.fields.invoiceNumber.label') }) });
  if (invoiceNumberValue !== '' && invoiceNumberValue.length < 6) errors.push({ field: "Invoice Number", message: t('validation.minLength', { label: t('invoice.fields.invoiceNumber.label'), count: 6 }) });
  if (invoiceNumberValue !== '' && invoiceNumberValue.length > 6) errors.push({ field: "Invoice Number", message: t('validation.maxLength', { label: t('invoice.fields.invoiceNumber.label'), count: 6 }) });
  if (invoiceNumberValue !== '' && hasEmoticon(invoiceNumberValue)) errors.push({ field: "Invoice Number", message: t('validation.noEmoticon') });
  if (invoiceNumberValue !== '' && isTaken('invoiceNumber', invoiceNumberValue)) errors.push({ field: "Invoice Number", message: t('validation.unique', { label: t('invoice.fields.invoiceNumber.label') }) });
  const dateOfIssueValue = String(row["Date Of Issue"] ?? '').trim();
  if (dateOfIssueValue !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfIssueValue)) errors.push({ field: "Date Of Issue", message: t('validation.dateFormat', { label: t('invoice.fields.dateOfIssue.label') }) });
  if (!dateOfIssueValue) errors.push({ field: "Date Of Issue", message: t('validation.required', { label: t('invoice.fields.dateOfIssue.label') }) });
  const dueDateValue = String(row["Due Date"] ?? '').trim();
  if (dueDateValue !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(dueDateValue)) errors.push({ field: "Due Date", message: t('validation.dateFormat', { label: t('invoice.fields.dueDate.label') }) });
  if (!dueDateValue) errors.push({ field: "Due Date", message: t('validation.required', { label: t('invoice.fields.dueDate.label') }) });
  const sellerValue = String(row["Seller"] ?? '').trim();
  if (!sellerValue) errors.push({ field: "Seller", message: t('validation.required', { label: t('invoice.fields.seller.label') }) });
  if (sellerValue !== '' && hasEmoticon(sellerValue)) errors.push({ field: "Seller", message: t('validation.noEmoticon') });
  const buyerValue = String(row["Buyer"] ?? '').trim();
  if (!buyerValue) errors.push({ field: "Buyer", message: t('validation.required', { label: t('invoice.fields.buyer.label') }) });
  if (buyerValue !== '' && hasEmoticon(buyerValue)) errors.push({ field: "Buyer", message: t('validation.noEmoticon') });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    invoiceNumber: invoiceNumberValue,
    dateOfIssue: dateOfIssueValue,
    dueDate: dueDateValue,
    seller: sellerValue,
    buyer: buyerValue,
    detailProduct: [],
    },
    errors,
  };
}
