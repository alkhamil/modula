import api from '../../../shared/lib/api';
import type {
  Order,
  OrderMutationResult,
  CreateOrderPayload,
  GetOrdersParams,
  OrderListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getOrders(params?: GetOrdersParams): Promise<ApiList<OrderListItem>> {
  const res = await api.get<ApiResponse<ApiList<OrderListItem>>>('/api/v1/orders', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await api.get<ApiResponse<ApiDetail<Order>>>(`/api/v1/orders/${id}`);
  return res.data.response_output!.detail;
}

export async function createOrder(data: CreateOrderPayload): Promise<OrderMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<Order>>>('/api/v1/orders', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateOrder(id: string, data: CreateOrderPayload): Promise<OrderMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<Order>>>(`/api/v1/orders/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/orders/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreOrder(id: string): Promise<OrderMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<Order>>>(`/api/v1/orders/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}
