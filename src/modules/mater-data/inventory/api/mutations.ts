import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInventory, restoreInventory, createInventory, updateInventory, bulkUploadInventories } from './resolver';
import type { CreateInventoryPayload } from '../types';

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInventory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventories'] }),
  });
}

export function useRestoreInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreInventory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventories'] }),
  });
}

export function useUpsertInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateInventoryPayload }) =>
      id ? updateInventory(id, data) : createInventory(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['inventory', variables.id] });
      }
    },
  });
}

export function useBulkUploadInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadInventories(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventories'] }),
  });
}
