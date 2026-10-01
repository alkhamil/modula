import type {
  Inventory,
  InventoryMutationResult,
  BulkRowError,
  BulkUploadResult,
  InventoryListItem,
  CreateInventoryPayload,
  GetInventoriesParams,
} from '../types';
import type { ApiList } from '../../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../../shared/utils';
import {
  BULK_INVENTORY_EXAMPLE,
  BULK_INVENTORY_HEADERS,
  validateBulkInventoryRow,
} from '../validation/inventoryBulkValidation';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


interface MockInventoryRecord {
  id: number;
  inventoryName: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockInventoryRecords: MockInventoryRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  inventoryName: `Inventory Name ${i + 1}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockInventoryRecord): InventoryListItem {
  return {
    id: record.id,
    inventoryName: record.inventoryName,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockInventoryRecord): Inventory {
  return {
    id: String(record.id),
    inventoryName: record.inventoryName,
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

function sortInventories(items: InventoryListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'inventoryName';
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
function filterInventoriesRecords(params?: GetInventoriesParams): InventoryListItem[] {
  let items = mockInventoryRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.inventoryName.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);

  return sortInventories(items, params?.order, params?.sort);
}

export async function mockGetInventories(params?: GetInventoriesParams): Promise<ApiList<InventoryListItem>> {
  await delay(300);
  const items = filterInventoriesRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportInventories(params?: GetInventoriesParams): Promise<Blob> {
  await delay(300);
  const items = filterInventoriesRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["Inventory Name","Status","Created Date"],
    items.map((r) => [r.inventoryName, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadInventoryTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_INVENTORY_HEADERS, [BULK_INVENTORY_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadInventories(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_INVENTORY_HEADERS;
  const missing = expected.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      successCount: 0,
      failedCount: rows.length,
      errors: missing.map((field) => ({
        row: 1,
        field,
        message: `Kolom "${field}" tidak ditemukan di file.`,
      })),
    };
  }
  if (rows.length === 0) {
    return {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [{ row: 1, message: 'File tidak berisi data.' }],
    };
  }
  const seenInventoryName = new Set(mockInventoryRecords.map((r) => String(r.inventoryName).toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkInventoryRow(mapped, (field, value) => {
      if (field === 'inventoryName') return seenInventoryName.has(value.toLowerCase());
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seenInventoryName.add(String(payload.inventoryName).toLowerCase());
    mockInventoryRecords.push({
      id: Math.max(...mockInventoryRecords.map((r) => r.id)) + 1,
      inventoryName: payload.inventoryName,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetInventoryById(id: string): Promise<Inventory> {
  await delay(300);
  const record = mockInventoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Inventory not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-INVENTORY-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateInventory(data: CreateInventoryPayload): Promise<InventoryMutationResult> {
  await delay(300);
  if (mockInventoryRecords.some((r) => r.inventoryName === data.inventoryName)) {
    throw mockConflictError('inventoryName', 'Inventory Name already exists, please use another');
  }
  const record: MockInventoryRecord = {
    id: Math.max(...mockInventoryRecords.map((r) => r.id)) + 1,
    inventoryName: data.inventoryName,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockInventoryRecords.push(record);
  return { message: 'Inventory created successfully.', data: toDetail(record) };
}

export async function mockUpdateInventory(
  id: string,
  data: CreateInventoryPayload,
): Promise<InventoryMutationResult> {
  await delay(300);
  const record = mockInventoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Inventory not found');
  if (mockInventoryRecords.some((r) => String(r.id) !== id && r.inventoryName === data.inventoryName)) {
    throw mockConflictError('inventoryName', 'Inventory Name already exists, please use another');
  }
  record.inventoryName = data.inventoryName;
  return { message: 'Inventory updated successfully.', data: toDetail(record) };
}

export async function mockDeleteInventory(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockInventoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Inventory not found');
  record.status = 'inactive';
  return { message: 'Inventory deleted successfully' };
}

export async function mockRestoreInventory(id: string): Promise<InventoryMutationResult> {
  await delay(300);
  const record = mockInventoryRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Inventory not found');
  record.status = 'active';
  return { message: 'Inventory restored successfully', data: toDetail(record) };
}
