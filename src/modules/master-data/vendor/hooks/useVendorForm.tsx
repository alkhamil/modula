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
import type { Vendor } from '../types';
import { useVendorDetailQuery, useUpsertVendor, loadRegionOptions } from '../api';

export interface FormValues {
  region: string;
  name: string;
}

function buildDefaultValues(item?: Vendor): FormValues {
  return item
    ? {
        region: item.region,
        name: item.name,
      }
    : {
        region: '',
        name: '',
      };
}

export function useVendorForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useVendorDetailQuery(id);

  const upsertMutation = useUpsertVendor();

  const vendor = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          region: data.region,
          name: data.name,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/master-data/vendors'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('vendor.label') })
        : t('runtime.saveFailedCreate', { singular: t('vendor.label') });
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
    if (!vendor) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('vendor.fields.region.label'), value: '' },
        { label: t('vendor.fields.name.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={vendor.status === 'active' ? 'success' : 'secondary'}>
            {vendor.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('vendor.fields.region.label'), value: <RelationLabel loader={loadRegionOptions} value={vendor.region} /> },
      { label: t('vendor.fields.name.label'), value: vendor.name },
      { label: t('table.createdBy'), value: vendor.createdBy },
      { label: t('table.createdDate'), value: vendor.createdDate },
    ];
  }, [vendor]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(vendor), [vendor]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    vendor,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
