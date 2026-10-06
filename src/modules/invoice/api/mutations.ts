import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInvoice, restoreInvoice, createInvoice, updateInvoice, bulkUploadInvoices } from './resolver';
import type { CreateInvoicePayload } from '../types';

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useRestoreInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreInvoice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpsertInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateInvoicePayload }) =>
      id ? updateInvoice(id, data) : createInvoice(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      }
    },
  });
}

export function useBulkUploadInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadInvoices(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });
}
