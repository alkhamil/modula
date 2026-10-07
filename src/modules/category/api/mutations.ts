import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory, restoreCategory, createCategory, updateCategory, bulkUploadCategories } from './resolver';
import type { CreateCategoryPayload } from '../types';

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpsertCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateCategoryPayload }) =>
      id ? updateCategory(id, data) : createCategory(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
      }
    },
  });
}

export function useBulkUploadCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadCategories(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}
