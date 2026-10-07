import type { RegisterOptions } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type { FormValues } from '../hooks';

export function getDivisionNameRules(t: TFunction): RegisterOptions<FormValues, 'divisionName'> {
  return {
  required: t('validation.required', { label: t('master_division.fields.divisionName.label') }),
  minLength: { value: 4, message: t('validation.minLength', { label: t('master_division.fields.divisionName.label'), count: 4 }) },
};
}

export function getIdAjalahRules(_t: TFunction): RegisterOptions<FormValues, 'idAjalah'> {
  return {};
}
