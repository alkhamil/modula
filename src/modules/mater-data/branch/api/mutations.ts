import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBranch, restoreBranch, createBranch, updateBranch } from './resolver';
import type { CreateBranchPayload } from '../types';

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useRestoreBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreBranch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useUpsertBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateBranchPayload }) =>
      id ? updateBranch(id, data) : createBranch(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['branch', variables.id] });
      }
    },
  });
}
