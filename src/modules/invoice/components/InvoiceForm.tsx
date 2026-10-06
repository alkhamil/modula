import { t } from 'i18next';
import '../../../shared/i18n';
import { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  FormDefaultValuesWatcher,
  TextField,
  DatePickerField,
  SelectField,
  FormArrayField,
  NavigationGuard,
} from '../../../shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../shared/types';
import { type UseFormReturn } from 'react-hook-form';
import type { DetailProductRow, DetailProductRowForm } from '../types';
import type { Column } from '../../../shared/components/ui/Table';
import { loadSellerOptions, loadBuyerOptions, loadDetailProductProductOptions, getDetailProductProductOptionLabel } from '../api';
import { capitalize, formatNumber, parseCurrency } from '../../../shared/utils';
import { hasEmoticon } from '../../../shared/utils';
import { getInvoiceNumberRules, getDateOfIssueRules, getDueDateRules, getSellerRules, getBuyerRules, getDetailProductRules } from '../validation/invoiceValidation';
function toDetailProductRowForm(row?: DetailProductRow | null): DetailProductRowForm {
  return {
    product: (row?.product ?? ''),
    quantity: String(row?.quantity ?? ''),
  };
}

function toDetailProductRow(form: DetailProductRowForm): DetailProductRow {
  return {
    product: form.product,
    quantity: parseCurrency(form.quantity),
  };
}

const DetailProductArrayColumns: Column<DetailProductRow>[] = [
  { key: 'product', header: t('invoice.fields.detailProduct.sub.product.label'), render: (row: DetailProductRow) => getDetailProductProductOptionLabel(row.product) },
  { key: 'quantity', header: t('invoice.fields.detailProduct.sub.quantity.label'), render: (row: DetailProductRow) => formatNumber(row.quantity) },
];

function DetailProductRowEditor({
  initial,
  onSave,
  formId,
}: {
  initial: DetailProductRow | null;
  onSave: (row: DetailProductRow) => void;
  onCancel: () => void;
  formId: string;
}) {
  return (
    <FormGroup<DetailProductRowForm>
      testId="invoice-detailProduct-row-form"
      id={formId}
      defaultValues={toDetailProductRowForm(initial)}
      onSubmit={(form) => onSave(toDetailProductRow(form))}
    >
      <div className="flex flex-col section-gap">
          <FormItem
            label={t('invoice.fields.detailProduct.sub.product.label')}
            testId="invoice-detailProduct-product"
            name="product"
            rules={{
  required: t('validation.required', { label: t('invoice.fields.detailProduct.sub.product.label') }),
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
}}
            layout="vertical"
            component={SelectField}
            placeholder={t('invoice.fields.detailProduct.sub.product.placeholder')}
            searchable
            paginateOnScroll
            loadOptions={loadDetailProductProductOptions}
                />

          <FormItem
            label={t('invoice.fields.detailProduct.sub.quantity.label')}
            testId="invoice-detailProduct-quantity"
            name="quantity"
            rules={{
  required: t('validation.required', { label: t('invoice.fields.detailProduct.sub.quantity.label') }),
  min: { value: 1, message: t('validation.minValue', { label: t('invoice.fields.detailProduct.sub.quantity.label'), count: 1 }) },
  max: { value: 100, message: t('validation.maxValue', { label: t('invoice.fields.detailProduct.sub.quantity.label'), count: 100 }) },
  validate: (value: string) => !hasEmoticon(value || '') || t('validation.noEmoticon'),
}}
            layout="vertical"
            component={TextField}
            currency
            placeholder={t('invoice.fields.detailProduct.sub.quantity.placeholder')}
                />
      </div>
    </FormGroup>
  );
}

function DetailProductArrayInput({
  value,
  onChange,
  size,
  addLabel,
  editorTitle,
  emptyTitle,
  emptyDescription,
  maxRows,
  lockFirstRow,
  disabled,
  error,
  'data-testid': testId,
}: {
  value?: DetailProductRow[] | null;
  onChange: (rows: DetailProductRow[]) => void;
  size?: 'sm' | 'md' | 'lg';
  addLabel?: string;
  editorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  maxRows?: number;
  lockFirstRow?: boolean;
  disabled?: boolean;
  error?: string;
  'data-testid'?: string;
}) {
  return (
    <FormArrayField
      value={value ?? []}
      onChange={onChange}
      columns={DetailProductArrayColumns}
      renderEditor={({ initial, onSave, onCancel, formId }) => (
        <DetailProductRowEditor initial={initial} onSave={onSave} onCancel={onCancel} formId={formId} />
      )}
      size={size}
      addLabel={addLabel}
      editorTitle={editorTitle}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      maxRows={maxRows}
      lockFirstRow={lockFirstRow}
      disabled={disabled}
      error={error}
      data-testid={testId}
    />
  );
}


interface InvoiceFormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;

}

function InvoiceForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,

}: InvoiceFormProps) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const setErrorRef = useRef<((name: keyof FormValues, error: { message: string }) => void) | null>(
    null,
  );
  const methodsRef = useRef<UseFormReturn<FormValues> | null>(null);

  const handleFormSubmit = useCallback(
    async (data: FormValues) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      setSubmitted(false);
      let success = false;
      try {
        const result = await onSubmit(data);
        if (result.fieldErrors && setErrorRef.current) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setErrorRef.current(field as keyof FormValues, { message });
          }
        }
        success = result.success;
        if (result.success) {
          methodsRef.current?.reset(data);
          setSubmitted(true);
        }
      } finally {
        if (!success) {
          submittingRef.current = false;
          setSubmitting(false);
        }
      }
    },
    [onSubmit],
  );

  return (
    <Card testId="invoice-form-card" title={isEdit ? t('runtime.editTitle', { singular: t('invoice.label') }) : t('runtime.createTitle', { singular: t('invoice.label') })}>
      <FormGroup<FormValues>
        testId="invoice-form"
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
      >
        {(methods) => {
          setErrorRef.current = methods.setError;
          methodsRef.current = methods;

          return (
            <>
              <FormDefaultValuesWatcher methods={methods} defaultValues={defaultValues} />

              <div className="grid grid-cols-12 field-gap">
              <div className="col-span-6"><p className="border-b border-border pb-1 text-sm font-semibold text-foreground">{"Detail Invoice"}</p></div>

              <div className="col-span-6"><p className="border-b border-border pb-1 text-sm font-semibold text-foreground">{"Identity"}</p></div>

              <div className="col-span-6">
                <FormItem
                  label={t('invoice.fields.invoiceNumber.label')}
                  testId="invoice-invoiceNumber"
                  name="invoiceNumber"
                  rules={getInvoiceNumberRules(t)}
                  layout="vertical"
                  component={TextField}
                  maxLength={6}
                  placeholder={t('invoice.fields.invoiceNumber.placeholder')}
                />
              </div>

              <div className="col-span-6">
                <FormItem
                  label={t('invoice.fields.seller.label')}
                  testId="invoice-seller"
                  name="seller"
                  rules={getSellerRules(t)}
                  layout="vertical"
                  component={SelectField}
                  placeholder={t('invoice.fields.seller.placeholder')}
                  searchable
                  paginateOnScroll
                  loadOptions={loadSellerOptions}
                />
              </div>

              <div className="col-span-6">
                <FormItem
                  label={t('invoice.fields.dueDate.label')}
                  testId="invoice-dueDate"
                  name="dueDate"
                  rules={getDueDateRules(t)}
                  layout="vertical"
                  component={DatePickerField}
                  placeholder={t('invoice.fields.dueDate.placeholder')}
                />
              </div>

              <div className="col-span-6">
                <FormItem
                  label={t('invoice.fields.buyer.label')}
                  testId="invoice-buyer"
                  name="buyer"
                  rules={getBuyerRules(t)}
                  layout="vertical"
                  component={SelectField}
                  placeholder={t('invoice.fields.buyer.placeholder')}
                  searchable
                  paginateOnScroll
                  loadOptions={loadBuyerOptions}
                />
              </div>

              <div className="col-span-12">
                <FormItem
                  label={t('invoice.fields.dateOfIssue.label')}
                  testId="invoice-dateOfIssue"
                  name="dateOfIssue"
                  rules={getDateOfIssueRules(t)}
                  layout="vertical"
                  component={DatePickerField}
                  placeholder={t('invoice.fields.dateOfIssue.placeholder')}
                />
              </div>

              <div className="col-span-12"><p className="border-b border-border pb-1 text-sm font-semibold text-foreground">{"Items"}</p></div>

              <div className="col-span-12">
                <FormItem
                  label={t('invoice.fields.detailProduct.label')}
                  testId="invoice-detailProduct"
                  name="detailProduct"
                  rules={getDetailProductRules(t)}
                  layout="vertical"
                  component={DetailProductArrayInput}
                  addLabel={t('invoice.fields.detailProduct.array.addLabel')}
                  editorTitle={t('invoice.fields.detailProduct.array.editorTitle')}
                />
              </div>
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                <Button
                  data-testid="invoice-back-button"
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={onCancel}
                >
                  {t('common.back')}
                </Button>
                <Button
                  data-testid="invoice-submit-button"
                  type="submit"
                  className="w-30"
                  disabled={isSubmitting || submitting}
                >
                  {isEdit ? t('common.update') : t('common.create')}
                </Button>
              </div>

              <NavigationGuard submitted={submitted} />
            </>
          );
        }}
      </FormGroup>
    </Card>
  );
}

export default InvoiceForm;
