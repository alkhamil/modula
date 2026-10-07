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
import type { MasterDivisi } from '../types';
import { useMasterDivisiDetailQuery, useUpsertMasterDivisi } from '../api';

export interface FormValues {
  divisionName: string;
  idAjalah: string;
}

function buildDefaultValues(item?: MasterDivisi): FormValues {
  return item
    ? {
        divisionName: item.divisionName,
        idAjalah: String(item.idAjalah ?? ''),
      }
    : {
        divisionName: '',
        idAjalah: '',
      };
}

export function useMasterDivisiForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useMasterDivisiDetailQuery(id);

  const upsertMutation = useUpsertMasterDivisi();

  const masterDivisi = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          divisionName: data.divisionName,
          idAjalah: parseCurrency(data.idAjalah),
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/master-divisis'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('master_division.label') })
        : t('runtime.saveFailedCreate', { singular: t('master_division.label') });
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
    if (!masterDivisi) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('master_division.fields.divisionName.label'), value: '' },
        { label: t('master_division.fields.idAjalah.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={masterDivisi.status === 'active' ? 'success' : 'secondary'}>
            {masterDivisi.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('master_division.fields.divisionName.label'), value: masterDivisi.divisionName },
      { label: t('master_division.fields.idAjalah.label'), value: formatNumber(masterDivisi.idAjalah) },
      { label: t('table.createdBy'), value: masterDivisi.createdBy },
      { label: t('table.createdDate'), value: masterDivisi.createdDate },
    ];
  }, [masterDivisi]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(masterDivisi), [masterDivisi]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    masterDivisi,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
