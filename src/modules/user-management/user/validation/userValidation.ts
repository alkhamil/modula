import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const nameRules: RegisterOptions<FormValues, 'name'> = {
  required: 'Name is required.',
  minLength: { value: 3, message: 'Name must be at least 3 characters.' },
  maxLength: { value: 100, message: 'Name cannot be greater than 100 characters.' },
};

export const roleIdRules: RegisterOptions<FormValues, 'role_id'> = {
  required: 'Role is required.',
};

export const usernameRules: RegisterOptions<FormValues, 'username'> = {
  required: 'Username is required.',
  minLength: { value: 3, message: 'Username must be at least 3 characters.' },
  maxLength: { value: 50, message: 'Username must be at most 50 characters.' },
};

export const emailRules: RegisterOptions<FormValues, 'email'> = {
  required: 'Email is required.',
  maxLength: { value: 100, message: 'Email must be at most 100 characters.' },
  pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
};

export const passwordRules: RegisterOptions<FormValues, 'password'> = {
  required: 'Password is required.',
  minLength: { value: 6, message: 'Password must be at least 6 characters.' },
};
