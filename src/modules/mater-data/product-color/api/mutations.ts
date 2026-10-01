import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProductColor, restoreProductColor, createProductColor, updateProductColor, bulkUploadProductColors } from './resolver';
import type { CreateProductColorPayload } from '../types';

export function useDeleteProductColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductColor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-colors'] }),
  });
}

export function useRestoreProductColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreProductColor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-colors'] }),
  });
}

export function useUpsertProductColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateProductColorPayload }) =>
      id ? updateProductColor(id, data) : createProductColor(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-colors'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['product-color', variables.id] });
      }
    },
  });
}

export function useBulkUploadProductColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadProductColors(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-colors'] }),
  });
}
