import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';

export const nameRules: RegisterOptions<FormValues, 'name'> = {
  required: 'Role name is required.',
  minLength: {
    value: 3,
    message: 'Role name must be at least 3 characters.',
  },
  maxLength: {
    value: 100,
    message: 'Role name cannot be greater than 100 characters.',
  },
};

export const permissionsRules: RegisterOptions<FormValues, 'permissions'> = {
  required: 'At least one permission is required.',
  validate: (value: string[]) =>
    (value && value.length > 0) || 'At least one permission is required.',
};
