import { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  FormDefaultValuesWatcher,
  SelectField,
  TextField,
  NavigationGuard,
} from '../../../../shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../../shared/types';
import { type UseFormReturn } from 'react-hook-form';
import { loadProductOptions } from '../api';
import { getProductRules, getPriceRules } from '../validation/priceValidation';

interface PriceFormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;

}

function PriceForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,

}: PriceFormProps) {
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
    <Card testId="price-form-card" title={isEdit ? t('runtime.editTitle', { singular: t('price.label') }) : t('runtime.createTitle', { singular: t('price.label') })}>
      <FormGroup<FormValues>
        testId="price-form"
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
              <div className="col-span-12">
                <FormItem
                  label={t('price.fields.product.label')}
                  testId="price-product"
                  name="product"
                  rules={getProductRules(t)}
                  layout="horizontal"
                  component={SelectField}
                  placeholder={t('price.fields.product.placeholder')}
                  searchable
                  paginateOnScroll
                  loadOptions={loadProductOptions}
                />
              </div>

              <div className="col-span-12">
                <FormItem
                  label={t('price.fields.price.label')}
                  testId="price-price"
                  name="price"
                  rules={getPriceRules(t)}
                  layout="horizontal"
                  component={TextField}
                  currency
                  prepend="Rp"
                  placeholder={t('price.fields.price.placeholder')}
                />
              </div>
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                <Button
                  data-testid="price-back-button"
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={onCancel}
                >
                  {t('common.back')}
                </Button>
                <Button
                  data-testid="price-submit-button"
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

export default PriceForm;
