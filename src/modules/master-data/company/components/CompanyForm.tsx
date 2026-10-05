import { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  FormDefaultValuesWatcher,
  TextField,
  TextAreaField,
  NavigationGuard,
} from '../../../../shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../../shared/types';
import { type UseFormReturn } from 'react-hook-form';
import { nameRules, descriptionRules } from '../validation/companyValidation';

interface CompanyFormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;

}

function CompanyForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,

}: CompanyFormProps) {
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
    <Card testId="company-form-card" title={isEdit ? t('runtime.editTitle', { singular: 'Company' }) : t('runtime.createTitle', { singular: 'Company' })}>
      <FormGroup<FormValues>
        testId="company-form"
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
                  label="Name"
                  testId="company-name"
                  name="name"
                  rules={nameRules}
                  layout="horizontal"
                  component={TextField}
                  maxLength={100}
                  placeholder="Enter name"
                />

                <FormItem
                  label="Description"
                  testId="company-description"
                  name="description"
                  rules={descriptionRules}
                  layout="horizontal"
                  component={TextAreaField}
                  maxLength={500}
                  placeholder="Enter description"
                />
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                <Button
                  data-testid="company-back-button"
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={onCancel}
                >
                  {t('common.back')}
                </Button>
                <Button
                  data-testid="company-submit-button"
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

export default CompanyForm;
