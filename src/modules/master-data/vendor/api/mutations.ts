import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVendor, restoreVendor, createVendor, updateVendor, bulkUploadVendors } from './resolver';
import type { CreateVendorPayload } from '../types';

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVendor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}

export function useRestoreVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreVendor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}

export function useUpsertVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateVendorPayload }) =>
      id ? updateVendor(id, data) : createVendor(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['vendor', variables.id] });
      }
    },
  });
}

export function useBulkUploadVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadVendors(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}
