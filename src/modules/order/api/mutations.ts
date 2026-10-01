import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, updateOrder } from './resolver';
import type { CreateOrderPayload } from '../types';

export function useUpsertOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CreateOrderPayload }) =>
      id ? updateOrder(id, data) : createOrder(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      }
    },
  });
}
