import { useCallback, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  Card,
  Button,
  FormGroup,
  FormItem,
  SelectField,
  SwitchField,
  TextField,
  PasswordField,
  NavigationGuard,
} from '../../../../shared/components/ui';
import { getRoleOptions } from '../api';
import {
  emailRules,
  nameRules,
  passwordRules,
  roleIdRules,
  usernameRules,
} from '../validation/userValidation';
import type { FormValues } from '../hooks';
import type { SubmitResult } from '../../../../shared/types';
import type { User } from '../types';

interface UserFormProps {
  defaultValues: FormValues;
  /**
   * User yang sedang di-edit (undefined saat mode create). Dipakai untuk
   * men-seed label field Role supaya langsung tampil benar walau opsinya
   * belum ke-fetch lewat loadOptions.
   */
  user?: User;
  onSubmit: (data: FormValues) => Promise<SubmitResult>;
  onCancel: () => void;
  isEdit?: boolean;
}

function UserForm({ defaultValues, user, onSubmit, onCancel, isEdit = false }: UserFormProps) {
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
          const isSubmitting = methods.formState.isSubmitting;
          return (
            <>
              <div className="space-y-8">
                <FormItem
                  testId="user-name"
                  label="Name"
                  name="name"
                  component={TextField}
                  rules={nameRules}
                  layout="horizontal"
                  placeholder="Enter name"
                  maxLength={100}
                />

                <FormItem
                  testId="user-role"
                  label="Role"
                  name="role_id"
                  component={SelectField}
                  rules={roleIdRules}
                  layout="horizontal"
                  placeholder="Select role"
                  clearable={false}
                  loadOptions={getRoleOptions}
                  searchable
                  defaultOption={
                    user ? { value: user.role_id, label: user.role_name } : undefined
                  }
                />

                <FormItem
                  testId="user-username"
                  label="Username"
                  name="username"
                  component={TextField}
                  rules={usernameRules}
                  layout="horizontal"
                  placeholder="Enter username"
                  maxLength={50}
                />

                <FormItem
                  testId="user-email"
                  label="Email"
                  name="email"
                  component={TextField}
                  rules={emailRules}
                  layout="horizontal"
                  placeholder="Enter email"
                />

                {!isEdit && (
                  <FormItem
                    testId="user-password"
                    label="Password"
                    name="password"
                    component={PasswordField}
                    rules={passwordRules}
                    layout="horizontal"
                    placeholder="Enter password"
                  />
                )}

                <FormItem
                  testId="user-status"
                  label="Status"
                  name="status"
                  component={SwitchField}
                  layout="horizontal"
                  showCheckedLabels={false}
                  switchLabel="Active"
                />
              </div>

              <div className="-mx-5 mt-6 flex items-center justify-end gap-3 border-t border-gray-100 px-5 pt-4">
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
                  {isEdit ? 'Save' : 'Create'}
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
