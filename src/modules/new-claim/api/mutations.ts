import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewClaim, updateNewClaim, bulkUploadNewClaims } from './resolver';
import type { CreateNewClaimPayload } from '../types';

export function useUpsertNewClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateNewClaimPayload }) =>
      id ? updateNewClaim(id, data) : createNewClaim(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['new-claims'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['new-claim', variables.id] });
      }
    },
  });
}

export function useBulkUploadNewClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadNewClaims(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['new-claims'] }),
  });
}
