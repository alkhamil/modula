import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast, Badge } from '../../../shared/components/ui';
import type { DetailRow } from '../../../shared/components/ui';
import type { SubmitResult } from '../../../shared/types';
import {
  isConnectionError,
  mapSubmitError,
  splitFieldErrors,
  getErrorStateType,
  formatDate,
} from '../../../shared/utils';
import type { Invoice, DetailProductRow } from '../types';
import { useInvoiceDetailQuery, useUpsertInvoice, getSellerOptionLabel, getBuyerOptionLabel } from '../api';

export interface FormValues {
  invoiceNumber: string;
  dateOfIssue: string;
  dueDate: string;
  seller: string;
  buyer: string;
  detailProduct: DetailProductRow[];
}

function buildDefaultValues(item?: Invoice): FormValues {
  return item
    ? {
        invoiceNumber: item.invoiceNumber,
        dateOfIssue: item.dateOfIssue,
        dueDate: item.dueDate,
        seller: item.seller,
        buyer: item.buyer,
        detailProduct: item.detailProduct,
      }
    : {
        invoiceNumber: '',
        dateOfIssue: '',
        dueDate: '',
        seller: '',
        buyer: '',
        detailProduct: [],
      };
}

export function useInvoiceForm(id?: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = !!id;

  const query = useInvoiceDetailQuery(id);

  const upsertMutation = useUpsertInvoice();

  const invoice = query.data;

  async function onSubmit(data: FormValues): Promise<SubmitResult> {
    try {
      const res = await upsertMutation.mutateAsync({
        id: isEdit ? id : undefined,
        data: {
          invoiceNumber: data.invoiceNumber,
          dateOfIssue: data.dateOfIssue,
          dueDate: data.dueDate,
          seller: data.seller,
          buyer: data.buyer,
          detailProduct: data.detailProduct,
        },
      });

      showToast({ message: res.message, variant: 'success' });
      setTimeout(() => navigate('/invoices'), 500);
      return { success: true };
    } catch (err: unknown) {
      const fallback = isEdit
        ? t('runtime.saveFailedUpdate', { singular: t('invoice.label') })
        : t('runtime.saveFailedCreate', { singular: t('invoice.label') });
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
    if (!invoice) {
      return [
        { label: t('table.status'), value: '' },
        { label: t('invoice.fields.invoiceNumber.label'), value: '' },
        { label: t('invoice.fields.dateOfIssue.label'), value: '' },
        { label: t('invoice.fields.dueDate.label'), value: '' },
        { label: t('invoice.fields.seller.label'), value: '' },
        { label: t('invoice.fields.buyer.label'), value: '' },
        { label: t('invoice.fields.detailProduct.label'), value: '' },
      ];
    }
    return [
      {
        label: t('table.status'),
        value: (
          <Badge variant={invoice.status === 'active' ? 'success' : 'secondary'}>
            {invoice.status === 'active' ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      { label: t('invoice.fields.invoiceNumber.label'), value: invoice.invoiceNumber },
      { label: t('invoice.fields.dateOfIssue.label'), value: formatDate(invoice.dateOfIssue) },
      { label: t('invoice.fields.dueDate.label'), value: formatDate(invoice.dueDate) },
      { label: t('invoice.fields.seller.label'), value: getSellerOptionLabel(invoice.seller) },
      { label: t('invoice.fields.buyer.label'), value: getBuyerOptionLabel(invoice.buyer) },
      { label: t('invoice.fields.detailProduct.label'), value: (() => { const count = (invoice.detailProduct ?? []).length; return count > 0 ? t('system.rowCount', { count }) : '-'; })() },
      { label: t('table.createdBy'), value: invoice.createdBy },
      { label: t('table.createdDate'), value: invoice.createdDate },
    ];
  }, [invoice]);

  const queryStatus: 'loading' | 'error' | 'success' = query.isLoading
    ? 'loading'
    : query.error
      ? 'error'
      : 'success';

  const defaultValues = useMemo(() => buildDefaultValues(invoice), [invoice]);

  return {
    queryStatus,
    queryMessage: query.error?.message ?? undefined,
    errorType: query.error ? getErrorStateType(query.error) : undefined,
    isNetworkError: query.error ? isConnectionError(query.error) : false,
    invoice,
    refresh: () => query.refetch(),
    detailRows,
    defaultValues,
    isSubmitting: upsertMutation.isPending,
    isEdit,
    onSubmit,
    onCancel,

  };
}
