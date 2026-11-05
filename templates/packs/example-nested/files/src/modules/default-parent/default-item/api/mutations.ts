import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDefaultItem, restoreDefaultItem, createDefaultItem, updateDefaultItem, bulkUploadDefaultItems } from './resolver';
import type { CreateDefaultItemPayload } from '../types';

export function useDeleteDefaultItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDefaultItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-items'] }),
  });
}

export function useRestoreDefaultItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreDefaultItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-items'] }),
  });
}

export function useUpsertDefaultItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateDefaultItemPayload }) =>
      id ? updateDefaultItem(id, data) : createDefaultItem(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['default-items'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['default-item', variables.id] });
      }
    },
  });
}

export function useBulkUploadDefaultItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadDefaultItems(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['default-items'] }),
  });
}
