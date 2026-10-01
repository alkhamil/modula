/**
 * Aturan form runtime — port `buildRulesObject`/`getMaxLength`/
 * `formDefaultValue`/`formEditValue`/`payloadMapping` (pesan + perilaku sama).
 * Murni & Node-safe.
 */
import type { RegisterOptions } from 'react-hook-form';
import { hasEmoticon, parseCurrency } from '../../../shared/utils';
import type { GeneratorFieldConfig } from '../types';
import { fieldTypeRegistry } from '../registry';

export type DynamicFormValues = Record<string, unknown>;

function splitRule(rule: string): { name: string; arg?: string } {
  const index = rule.indexOf(':');
  if (index === -1) return { name: rule };
  return { name: rule.slice(0, index), arg: rule.slice(index + 1) };
}

function isArrayField(field: GeneratorFieldConfig): boolean {
  return fieldTypeRegistry[field.type].formType === 'stringArray';
}

/** RHF RegisterOptions dari rules generator (placeholder `$label` = label tampil). */
export function fieldRulesToRHF(field: GeneratorFieldConfig): RegisterOptions {
  const { label } = field;
  if (field.rules.length === 0) return {};
  const rules: RegisterOptions = {};
  const isArray = isArrayField(field);
  const isNumber = field.type === 'numberField';
  for (const raw of field.rules) {
    const { name, arg } = splitRule(raw);
    switch (name) {
      case 'unique':
        break;
      case 'required':
        if (isArray) {
          rules.validate = {
            ...(typeof rules.validate === 'object' ? rules.validate : {}),
            required: (value: unknown) =>
              (Array.isArray(value) && value.length > 0) || `${label} is required.`,
          };
        } else if (field.type === 'fileUploadField') {
          rules.validate = {
            ...(typeof rules.validate === 'object' ? rules.validate : {}),
            required: (value: unknown) => value instanceof File || `${label} is required.`,
          };
        } else {
          rules.required = `${label} is required.`;
        }
        break;
      case 'min':
      case 'max': {
        const limit = Number(arg);
        if (isArray) {
          const message =
            name === 'min'
              ? `${label} must have at least ${arg} items.`
              : `${label} cannot have more than ${arg} items.`;
          rules.validate = {
            ...(typeof rules.validate === 'object' ? rules.validate : {}),
            [name]: (value: unknown) =>
              !Array.isArray(value) ||
              (name === 'min' ? value.length >= limit : value.length <= limit) ||
              message,
          };
        } else if (isNumber) {
          rules[name] = {
            value: limit,
            message:
              name === 'min' ? `${label} must be at least ${arg}.` : `${label} cannot be greater than ${arg}.`,
          };
        } else {
          const key = name === 'min' ? 'minLength' : 'maxLength';
          rules[key] = {
            value: limit,
            message:
              name === 'min'
                ? `${label} must be at least ${arg} characters.`
                : `${label} cannot be greater than ${arg} characters.`,
          };
        }
        break;
      }
      case 'minLength':
      case 'maxLength':
        if (!isArray) {
          rules[name] = {
            value: Number(arg),
            message:
              name === 'minLength'
                ? `${label} must be at least ${arg} characters.`
                : `${label} cannot be greater than ${arg} characters.`,
          };
        }
        break;
      case 'email':
        rules.pattern = {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Email format is invalid.',
        };
        break;
      case 'regex':
        rules.pattern = {
          value: new RegExp(arg ?? ''),
          message: `${label} format is invalid.`,
        };
        break;
      case 'withoutemoticon':
        if (!isArray) {
          rules.validate = {
            ...(typeof rules.validate === 'object' ? rules.validate : {}),
            withoutemoticon: (value: unknown) =>
              !hasEmoticon(String(value ?? '')) || 'Emoticon is not allowed.',
          };
        }
        break;
      default:
        break;
    }
  }
  return rules;
}

/** Batas maxLength prop TextField (string non-number saja). */
export function maxLengthOf(field: GeneratorFieldConfig): number | null {
  if (fieldTypeRegistry[field.type].formType !== 'string') return null;
  for (const raw of field.rules) {
    const { name, arg } = splitRule(raw);
    if ((name === 'max' || name === 'maxLength') && arg !== undefined) return Number(arg);
  }
  return null;
}

/** Nilai default form per tipe (create). */
export function formDefaultValue(field: GeneratorFieldConfig): unknown {
  const formType = fieldTypeRegistry[field.type].formType;
  if (formType === 'boolean') return false;
  if (formType === 'stringArray') return [];
  if (formType === 'file') return null;
  return '';
}

/** Nilai edit dari record detail. */
export function formEditValue(field: GeneratorFieldConfig, item: Record<string, unknown>): unknown {
  const valueType = fieldTypeRegistry[field.type].valueType;
  if (valueType === 'number') return String(item[field.name] ?? '');
  if (valueType === 'file') return null;
  return item[field.name];
}

/** Mapping nilai form → payload (parseCurrency number, nama file untuk file). */
export function payloadValue(field: GeneratorFieldConfig, value: unknown): unknown {
  const valueType = fieldTypeRegistry[field.type].valueType;
  if (valueType === 'number') return parseCurrency(String(value ?? ''));
  if (valueType === 'file') return value instanceof File ? value.name : '';
  return value;
}

