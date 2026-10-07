import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, restoreProduct, createProduct, updateProduct, bulkUploadProducts } from './resolver';
import type { CreateProductPayload } from '../types';

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpsertProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateProductPayload }) =>
      id ? updateProduct(id, data) : createProduct(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      }
    },
  });
}

export function useBulkUploadProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadProducts(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
