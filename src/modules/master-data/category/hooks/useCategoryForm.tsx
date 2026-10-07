import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast, Badge, RelationLabel } from '../../../../shared/components/ui';
import type { DetailRow } from '../../../../shared/components/ui';
import type { SubmitResult } from '../../../../shared/types';
import {
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
} from '../../../../shared/utils';
import type { Category } from '../types';
import { useCategoryDetailQuery, useUpsertCategory, loadRegionOptions } from '../api';

export interface FormValues {
  name: string;
  region: string;
}

function buildDefaultValues(item?: Category): FormValues {
  return item
    ? {
        name: item.name,
        region: item.region,
      }
    : {
        name: '',
        region: '',
      };
}

export function useCategoryForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useCategoryDetailQuery(id);

  const upsertMutation = useUpsertCategory();

  const category = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          name: data.name,
          region: data.region,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/master-data/categories'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('category.label') })
        : t('runtime.saveFailedCreate', { singular: t('category.label') });
      const result = mapSubmitError(err, fallback);
      if (result.fieldErrors) {
        const { fieldErrors, unknownMessage } = splitFieldErrors(
          result.fieldErrors,
          (field) => field,
        );
        if (unknownMessage) showToast({ message: unknownMessage, variant: 'error' });
        return Object.keys(fieldErrors).length > 0
          ? { success: false, fieldErrors }
          : { success: false };
      }
      if (result.toastMessage) {
        showToast({ message: result.toastMessage, variant: 'error' });
      }
      return result;
    }
  }

  function onCancel() {
    navigate(-1);
  }

  const detailRows = useMemo<DetailRow[]>(() => {
    if (!category) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('category.fields.name.label'), value: '' },
        { label: t('category.fields.region.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={category.status === 'active' ? 'success' : 'secondary'}>
            {category.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('category.fields.name.label'), value: category.name },
      { label: t('category.fields.region.label'), value: <RelationLabel loader={loadRegionOptions} value={category.region} /> },
      { label: t('table.createdBy'), value: category.createdBy },
      { label: t('table.createdDate'), value: category.createdDate },
    ];
  }, [category]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(category), [category]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    category,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
