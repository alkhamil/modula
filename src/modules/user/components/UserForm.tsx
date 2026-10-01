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
} from '../../../shared/components/ui';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../shared/types';
import { type UseFormReturn } from 'react-hook-form';
import type { RoleOption } from '../types';
import { userEmailRules, userNameRules, userRoleRules } from '../validation/userValidation';

interface UserFormProps {
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
  roleOptions: RoleOption[];
}

function UserForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
  roleOptions,
}: UserFormProps) {
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
    <Card testId="user-form-card" title={isEdit ? 'Edit User' : 'Create User'}>
      <FormGroup<FormValues>
        testId="user-form"
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
                  testId="user-name"
                  label="Name"
                  name="name"
                  component={TextField}
                  rules={userNameRules}
                  maxLength={100}
                  layout="horizontal"
                  placeholder="Enter name"
                />

                <FormItem
                  testId="user-email"
                  label="Email"
                  name="email"
                  component={TextField}
                  rules={userEmailRules}
                  maxLength={100}
                  layout="horizontal"
                  placeholder="Enter email"
                />

                <FormItem
                  testId="user-role"
                  label="Role"
                  name="role"
                  component={SelectField}
                  rules={userRoleRules}
                  layout="horizontal"
                  placeholder="Select role"
                  options={roleOptions}
                  clearable={false}
                  searchable
                />
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border px-5 pt-4">
                <Button
                  data-testid="user-back-button"
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={onCancel}
                >
                  Back
                </Button>
                <Button
                  data-testid="user-submit-button"
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

export default UserForm;
