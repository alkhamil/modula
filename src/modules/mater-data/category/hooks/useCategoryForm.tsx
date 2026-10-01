import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToast, Badge } from '../../../../shared/components/ui';
import type { DetailRow } from '../../../../shared/components/ui';
import type { SubmitResult } from '../../../../shared/types';
import {
  capitalize,
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
} from '../../../../shared/utils';
import type { Category } from '../types';
import { useCategoryDetailQuery, useUpsertCategory } from '../api';

export interface FormValues {
  categoryName: string;
  description: string;
  source: string[];
}

function buildDefaultValues(item?: Category): FormValues {
  return item
    ? {
        categoryName: item.categoryName,
        description: item.description,
        source: item.source,
      }
    : {
        categoryName: '',
        description: '',
        source: [],
      };
}

export function useCategoryForm(id?: string) {
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
          categoryName: data.categoryName,
          description: data.description,
          source: data.source,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/mater-data/categories'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = `Failed to ${isEdit ? 'update' : 'create'} category`;
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
        { label: 'Status', value: '' },
        { label: 'Category Name', value: '' },
        { label: 'Description', value: '' },
        { label: 'Source', value: '' },
      ];
    }
    return [
      {
        label: 'Status',
        value: (
          <Badge variant={category.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(category.status)}
          </Badge>
        ),
      },
      { label: 'Category Name', value: category.categoryName },
      { label: 'Description', value: category.description },
      { label: 'Source', value: (category.source ?? []).join(', ') },
      { label: 'Created By', value: category.createdBy },
      { label: 'Created Date', value: category.createdDate },
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
