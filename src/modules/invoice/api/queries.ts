import { useQuery } from '@tanstack/react-query';
import { getInvoices, getInvoiceById } from './resolver';
import type { GetInvoicesParams, InvoiceListItem, Invoice } from '../types';
import type { ApiList } from '../../../shared/types';

export function useInvoiceListQuery(params: GetInvoicesParams) {
  return useQuery<ApiList<InvoiceListItem>>({
    queryKey: ['invoices', params],
    queryFn: () => getInvoices({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}

export function useInvoiceDetailQuery(id?: string) {
  return useQuery<Invoice>({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id!),
    enabled: !!id,
  });
}
