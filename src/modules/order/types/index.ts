export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface OrderListItem {
  id: number;
  orderNumber: string;
  orderDate: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateOrderPayload {
  orderNumber: string;
  orderDate: string;
}

export interface GetOrdersParams {
  search?: string;
  status?: string;
  orderDate?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface OrderMutationResult<T = Order> {
  message: string;
  data: T;
}
