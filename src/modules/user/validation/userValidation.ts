import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';

export const userNameRules: RegisterOptions<FormValues, 'name'> = {
  required: 'Name is required.',
  minLength: {
    value: 3,
    message: 'Name must be at least 3 characters.',
  },
  maxLength: {
    value: 100,
    message: 'Name cannot be greater than 100 characters.',
  },
};

export const userEmailRules: RegisterOptions<FormValues, 'email'> = {
  required: 'Email is required.',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email format is invalid.',
  },
};

export const userRoleRules: RegisterOptions<FormValues, 'role'> = {
  required: 'Role is required.',
};
