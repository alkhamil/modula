import { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AltArrowLeft } from '../../../../shared/components/icons';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  FormDefaultValuesWatcher,
  InputField,
  Textarea,
  NavigationGuard,
} from '../../../../shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../../shared/types';
import { type UseFormReturn } from 'react-hook-form';
import { getNameRules, getCodeRules, getSortOrderRules, getDescriptionRules } from '../validation/defaultRecordValidation';
interface DefaultRecordFormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;

}

function DefaultRecordForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,

}: DefaultRecordFormProps) {
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
    <div className="flex min-h-full flex-col stack-gap">
      <div>
        <Button
          data-testid="default-record-back-button"
          type="button"
          variant="secondary"
          icon={<AltArrowLeft className="h-4 w-4" />}
          onClick={onCancel}
        >
          {t('common.back')}
        </Button>
      </div>
      <Card testId="default-record-form-card" title={isEdit ? t('runtime.editTitle', { singular: t('default_record.label') }) : t('runtime.createTitle', { singular: t('default_record.label') })}>
        <FormGroup<FormValues>
          testId="default-record-form"
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
                  label={t('default_record.fields.name.label')}
                  testId="default-record-name"
                  name="name"
                  rules={getNameRules(t)}
                  layout="horizontal"
                  component={InputField}
                  maxLength={100}
                  placeholder={t('default_record.fields.name.placeholder')}
                />
              </div>

              <div className="col-span-12">
                <FormItem
                  label={t('default_record.fields.code.label')}
                  testId="default-record-code"
                  name="code"
                  rules={getCodeRules(t)}
                  layout="horizontal"
                  component={InputField}
                  maxLength={30}
                  placeholder={t('default_record.fields.code.placeholder')}
                />
              </div>

              <div className="col-span-12">
                <FormItem
                  label={t('default_record.fields.sortOrder.label')}
                  testId="default-record-sortOrder"
                  name="sortOrder"
                  rules={getSortOrderRules(t)}
                  layout="horizontal"
                  component={InputField}
                  currency
                  placeholder={t('default_record.fields.sortOrder.placeholder')}
                />
              </div>

              <div className="col-span-12">
                <FormItem
                  label={t('default_record.fields.description.label')}
                  testId="default-record-description"
                  name="description"
                  rules={getDescriptionRules(t)}
                  layout="horizontal"
                  component={Textarea}
                  maxLength={500}
                  placeholder={t('default_record.fields.description.placeholder')}
                />
              </div>
                </div>

                <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                  <Button
                    data-testid="default-record-cancel-button"
                    type="button"
                    variant="secondary"
                    className="w-30"
                    onClick={onCancel}
                  >
                    {t('common.cancel')}
                  </Button>
                <Button
                  data-testid="default-record-submit-button"
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
    </div>
  );
}

export default DefaultRecordForm;
