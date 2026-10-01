import { useCallback, useState, useRef } from 'react';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  FormDefaultValuesWatcher,
  TextField,
  SelectField,
  NavigationGuard,
} from '../../../../shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../../shared/types';
import { type UseFormReturn } from 'react-hook-form';
import { loadCategoryOptions } from '../api';
import { productNameRules, productCodeRules, categoryRules } from '../validation/productValidation';

interface ProductFormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;

}

function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,

}: ProductFormProps) {
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
    <Card testId="product-form-card" title={isEdit ? 'Edit Product' : 'Create Product'}>
      <FormGroup<FormValues>
        testId="product-form"
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
      >
        {(methods) => {
          setErrorRef.current = methods.setError;
          methodsRef.current = methods;

          return (
            <>
              <FormDefaultValuesWatcher methods={methods} defaultValues={defaultValues} />

              <div className="flex flex-col section-gap">
                <FormItem
                  label="Product Name"
                  testId="product-productName"
                  name="productName"
                  rules={productNameRules}
                  layout="horizontal"
                  component={TextField}
                  maxLength={100}
                  placeholder="Enter product name"
                />

                <FormItem
                  label="Product Code"
                  testId="product-productCode"
                  name="productCode"
                  rules={productCodeRules}
                  layout="horizontal"
                  component={TextField}
                  maxLength={4}
                  placeholder="Enter product code"
                />

                <FormItem
                  label="Category"
                  testId="product-category"
                  name="category"
                  rules={categoryRules}
                  layout="horizontal"
                  component={SelectField}
                  placeholder="Select category"
                  searchable
                  paginateOnScroll
                  loadOptions={loadCategoryOptions}
                />
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                <Button
                  data-testid="product-back-button"
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={onCancel}
                >
                  Back
                </Button>
                <Button
                  data-testid="product-submit-button"
                  type="submit"
                  className="w-30"
                  disabled={isSubmitting || submitting}
                >
                  {isEdit ? 'Update' : 'Create'}
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

export default ProductForm;
