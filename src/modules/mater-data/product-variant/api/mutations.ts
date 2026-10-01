import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProductVariant, restoreProductVariant, createProductVariant, updateProductVariant, bulkUploadProductVariants } from './resolver';
import type { CreateProductVariantPayload } from '../types';

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductVariant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-variants'] }),
  });
}

export function useRestoreProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreProductVariant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-variants'] }),
  });
}

export function useUpsertProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateProductVariantPayload }) =>
      id ? updateProductVariant(id, data) : createProductVariant(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['product-variant', variables.id] });
      }
    },
  });
}

export function useBulkUploadProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadProductVariants(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-variants'] }),
  });
}
