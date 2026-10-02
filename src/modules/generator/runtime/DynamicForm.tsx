/** Form generik — field + validasi + grid layout dari definisi modul. */
import { useCallback, useRef, useState } from 'react';
import {
  Button,
  Card,
  FormDefaultValuesWatcher,
  FormGroup,
  FormItem,
  NavigationGuard,
} from '../../../shared/components/ui';
import {
  CheckboxField,
  CheckboxGroupField,
  DatePickerField,
  DateRangeField,
  FileUploadField,
  PasswordField,
  RadioGroupField,
  SelectField,
  SelectMultipleField,
  SwitchField,
  TextAreaField,
  TextField,
} from '../../../shared/components/ui/fields';
import type { SubmitResult } from '../../../shared/types';
import type { UseFormReturn } from 'react-hook-form';
import type { GeneratorFieldConfig } from '../types';
import type { ModuleDefinition } from '../definitions';
import { definitionTestId, type DynamicOption } from './types';
import {
  fieldRulesToRHF,
  maxLengthOf,
  type DynamicFormValues,
} from './validation';
import type { LoadOptionsFn } from '../../../shared/components/ui/fields/SelectField';
import { colSpanClass } from './grid';

interface DynamicFormProps {
  def: ModuleDefinition;
  defaultValues: DynamicFormValues;
  onSubmit: (data: DynamicFormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
  optionsOf: (field: GeneratorFieldConfig) => DynamicOption[];
  loaderOf: (field: GeneratorFieldConfig) => LoadOptionsFn | undefined;
}

function DynamicForm({
  def,
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
  optionsOf,
  loaderOf,
}: DynamicFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const setErrorRef = useRef<
    ((name: string, error: { message: string }) => void) | null
  >(null);
  const methodsRef = useRef<UseFormReturn<DynamicFormValues> | null>(null);
  const testPrefix = definitionTestId(def.key);

  const handleFormSubmit = useCallback(
    async (data: DynamicFormValues) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      setSubmitted(false);
      let success = false;
      try {
        const result = await onSubmit(data);
        if (result.fieldErrors && setErrorRef.current) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setErrorRef.current(field, { message });
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

  const byName = new Map(def.fields.map((field) => [field.name, field]));
  const layout = [...def.layout.form]
    .sort((a, b) => a.order - b.order)
    .filter((item) => (item.kind ?? 'field') !== 'field' || byName.has(item.field));

  function renderField(field: GeneratorFieldConfig): React.ReactNode {
    const testId = `${testPrefix}-${field.name}`;
    const common = {
      testId,
      name: field.name,
      rules: fieldRulesToRHF(field),
      layout: 'horizontal' as const,
    };
    const lower = field.label.toLowerCase();
    switch (field.type) {
      case 'numberField':
        return (
          <FormItem
            label={field.label}
            {...common}
            component={TextField}
            currency
            placeholder={`Enter ${lower}`}
          />
        );
      case 'textareaField':
        return (
          <FormItem
            label={field.label}
            {...common}
            component={TextAreaField}
            placeholder={`Enter ${lower}`}
          />
        );
      case 'passwordField': {
        const maxLength = maxLengthOf(field);
        return (
          <FormItem
            label={field.label}
            {...common}
            component={PasswordField}
            {...(maxLength !== null ? { maxLength } : {})}
            placeholder={`Enter ${lower}`}
          />
        );
      }
      case 'dateField':
        return (
          <FormItem
            label={field.label}
            {...common}
            component={DatePickerField}
            placeholder={`Select ${lower}`}
          />
        );
      case 'dateRangeField':
        return (
          <FormItem
            label={field.label}
            {...common}
            component={DateRangeField}
            placeholder={`Select ${lower}`}
          />
        );
      case 'selectField': {
        const loader = loaderOf(field);
        if (loader) {
          return (
            <FormItem
              label={field.label}
              {...common}
              component={SelectField}
              placeholder={`Select ${lower}`}
              searchable
              paginateOnScroll
              loadOptions={loader}
            />
          );
        }
        return (
          <FormItem
            label={field.label}
            {...common}
            component={SelectField}
            placeholder={`Select ${lower}`}
            options={optionsOf(field)}
            clearable={false}
            searchable
          />
        );
      }
      case 'selectMultipleField': {
        const loader = loaderOf(field);
        if (loader) {
          return (
            <FormItem
              label={field.label}
              {...common}
              component={SelectMultipleField}
              placeholder={`Select ${lower}`}
              searchable
              paginateOnScroll
              loadOptions={loader}
            />
          );
        }
        return (
          <FormItem
            label={field.label}
            {...common}
            component={SelectMultipleField}
            placeholder={`Select ${lower}`}
            options={optionsOf(field)}
            searchable
          />
        );
      }
      case 'radioGroupField':
        return (
          <FormItem
            label={field.label}
            {...common}
            component={RadioGroupField}
            options={optionsOf(field)}
          />
        );
      case 'checkboxField':
        return <FormItem {...common} component={CheckboxField} checkboxLabel={field.label} />;
      case 'checkboxGroupField':
        return (
          <FormItem
            label={field.label}
            {...common}
            component={CheckboxGroupField}
            options={optionsOf(field)}
          />
        );
      case 'switchField':
        return (
          <FormItem
            {...common}
            component={SwitchField}
            switchLabel={field.label}
            showCheckedLabels={false}
          />
        );
      case 'fileUploadField':
        return <FormItem label={field.label} {...common} component={FileUploadField} />;
      case 'textField':
      default: {
        const maxLength = maxLengthOf(field);
        return (
          <FormItem
            label={field.label}
            {...common}
            component={TextField}
            {...(maxLength !== null ? { maxLength } : {})}
            placeholder={`Enter ${lower}`}
          />
        );
      }
    }
  }

  return (
    <Card testId={`${testPrefix}-form-card`} title={isEdit ? `Edit ${def.singularLabel}` : `Create ${def.singularLabel}`}>
      <FormGroup<DynamicFormValues>
        testId={`${testPrefix}-form`}
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
                {layout.map((item) => {
                  const kind = item.kind ?? 'field';
                  if (kind === 'section') {
                    return (
                      <div key={item.field} className={colSpanClass(item.colSpan)}>
                        <p className="border-b border-border pb-1 text-sm font-semibold text-foreground">
                          {item.label ?? 'Section'}
                        </p>
                      </div>
                    );
                  }
                  if (kind === 'divider') {
                    return (
                      <div key={item.field} className={colSpanClass(item.colSpan)}>
                        <hr className="border-border" />
                      </div>
                    );
                  }
                  const field = byName.get(item.field);
                  if (!field) return null;
                  return (
                    <div key={field.name} className={colSpanClass(item.colSpan)}>
                      {renderField(field)}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  data-testid={`${testPrefix}-cancel-button`}
                  className="w-30"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isSubmitting || submitting}
                >
                  Cancel
                </Button>
                <Button
                  data-testid={`${testPrefix}-submit-button`}
                  className="w-30"
                  variant="primary"
                  onClick={methods.handleSubmit(handleFormSubmit)}
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

export default DynamicForm;
