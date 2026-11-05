import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast, Badge } from '../../../shared/components/ui';
import type { DetailRow } from '../../../shared/components/ui';
import type { SubmitResult } from '../../../shared/types';
import {
  isConnectionError,
  mapSubmitError,
  parseCurrency,
  splitFieldErrors,
  getErrorStateType,
  formatNumber,
} from '../../../shared/utils';
import type { DefaultModule } from '../types';
import { useDefaultModuleDetailQuery, useUpsertDefaultModule } from '../api';

export interface FormValues {
  name: string;
  code: string;
  sortOrder: string;
  description: string;
}

function buildDefaultValues(item?: DefaultModule): FormValues {
  return item
    ? {
        name: item.name,
        code: item.code,
        sortOrder: String(item.sortOrder ?? ''),
        description: item.description,
      }
    : {
        name: '',
        code: '',
        sortOrder: '',
        description: '',
      };
}

export function useDefaultModuleForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useDefaultModuleDetailQuery(id);

  const upsertMutation = useUpsertDefaultModule();

  const defaultModule = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          name: data.name,
          code: data.code,
          sortOrder: parseCurrency(data.sortOrder),
          description: data.description,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/default-modules'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('default_module.label') })
        : t('runtime.saveFailedCreate', { singular: t('default_module.label') });
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
    if (!defaultModule) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('default_module.fields.name.label'), value: '' },
        { label: t('default_module.fields.code.label'), value: '' },
        { label: t('default_module.fields.sortOrder.label'), value: '' },
        { label: t('default_module.fields.description.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={defaultModule.status === 'active' ? 'success' : 'secondary'}>
            {defaultModule.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('default_module.fields.name.label'), value: defaultModule.name },
      { label: t('default_module.fields.code.label'), value: defaultModule.code },
      { label: t('default_module.fields.sortOrder.label'), value: formatNumber(defaultModule.sortOrder) },
      { label: t('default_module.fields.description.label'), value: defaultModule.description },
      { label: t('table.createdBy'), value: defaultModule.createdBy },
      { label: t('table.createdDate'), value: defaultModule.createdDate },
    ];
  }, [defaultModule]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(defaultModule), [defaultModule]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    defaultModule,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
