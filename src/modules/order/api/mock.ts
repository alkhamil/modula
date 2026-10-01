import type {
  Order,
  OrderMutationResult,
  OrderListItem,
  CreateOrderPayload,
  GetOrdersParams,
} from '../types';
import type { ApiList } from '../../../shared/types';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


interface MockOrderRecord {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockOrderRecords: MockOrderRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  orderNumber: `Order Number ${i + 1}`,
  orderDate: `2024-0${(i % 9) + 1}-${10 + (i % 9)}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockOrderRecord): OrderListItem {
  return {
    id: record.id,
    orderNumber: record.orderNumber,
    orderDate: record.orderDate,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockOrderRecord): Order {
  return {
    id: String(record.id),
    orderNumber: record.orderNumber,
    orderDate: record.orderDate,
    status: record.status,
    createdBy: record.created_by ?? '',
    createdDate: record.created_date,
  };
}

function paginate<T>(items: T[], page: number, size: number) {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    pagination: { page: safePage, size, total_pages: totalPages, total_elements: totalElements },
    content: items.slice((safePage - 1) * size, safePage * size),
  };
}

function sortOrders(items: OrderListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'orderNumber';
  const direction = dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (av == null || bv == null) return 0;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;
    return String(av).localeCompare(String(bv)) * direction;
  });
}

/** Filter + sortir tanpa pagination — dipakai list dan export. */
function filterOrdersRecords(params?: GetOrdersParams): OrderListItem[] {
  let items = mockOrderRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.orderNumber.toLowerCase().includes(q) ||
        r.orderDate.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.orderDate) items = items.filter((r) => r.orderDate === params.orderDate);
  return sortOrders(items, params?.order, params?.sort);
}

export async function mockGetOrders(params?: GetOrdersParams): Promise<ApiList<OrderListItem>> {
  await delay(300);
  const items = filterOrdersRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}


export async function mockGetOrderById(id: string): Promise<Order> {
  await delay(300);
  const record = mockOrderRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Order not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-ORDER-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateOrder(data: CreateOrderPayload): Promise<OrderMutationResult> {
  await delay(300);
  if (mockOrderRecords.some((r) => r.orderNumber === data.orderNumber)) {
    throw mockConflictError('orderNumber', 'Order Number already exists, please use another');
  }
  const record: MockOrderRecord = {
    id: Math.max(...mockOrderRecords.map((r) => r.id)) + 1,
    orderNumber: data.orderNumber,
    orderDate: data.orderDate,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockOrderRecords.push(record);
  return { message: 'Order created successfully.', data: toDetail(record) };
}

export async function mockUpdateOrder(
  id: string,
  data: CreateOrderPayload,
): Promise<OrderMutationResult> {
  await delay(300);
  const record = mockOrderRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Order not found');
  if (mockOrderRecords.some((r) => String(r.id) !== id && r.orderNumber === data.orderNumber)) {
    throw mockConflictError('orderNumber', 'Order Number already exists, please use another');
  }
  record.orderNumber = data.orderNumber;
  record.orderDate = data.orderDate;
  return { message: 'Order updated successfully.', data: toDetail(record) };
}

export async function mockDeleteOrder(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockOrderRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Order not found');
  record.status = 'inactive';
  return { message: 'Order deleted successfully' };
}

export async function mockRestoreOrder(id: string): Promise<OrderMutationResult> {
  await delay(300);
  const record = mockOrderRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Order not found');
  record.status = 'active';
  return { message: 'Order restored successfully', data: toDetail(record) };
}
