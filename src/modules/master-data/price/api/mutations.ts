import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePrice, restorePrice, createPrice, updatePrice, bulkUploadPrices } from './resolver';
import type { CreatePricePayload } from '../types';

export function useDeletePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prices'] }),
  });
}

export function useRestorePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restorePrice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prices'] }),
  });
}

export function useUpsertPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreatePricePayload }) =>
      id ? updatePrice(id, data) : createPrice(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['price', variables.id] });
      }
    },
  });
}

export function useBulkUploadPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadPrices(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prices'] }),
  });
}
