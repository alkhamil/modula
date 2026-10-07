import { t } from 'i18next';
import '../../../shared/i18n';
import type {
  MasterDivisi,
  MasterDivisiMutationResult,
  BulkRowError,
  BulkUploadResult,
  MasterDivisiListItem,
  CreateMasterDivisiPayload,
  GetMasterDivisisParams,
} from '../types';
import type { ApiList } from '../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../shared/utils';
import {
  BULK_MASTERDIVISI_EXAMPLE,
  BULK_MASTERDIVISI_HEADERS,
  validateBulkMasterDivisiRow,
} from '../validation/masterDivisiBulkValidation';

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


interface MockMasterDivisiRecord {
  id: number;
  divisionName: string;
  idAjalah: number;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockMasterDivisiRecords: MockMasterDivisiRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  divisionName: `DivisionName ${i + 1}`,
  idAjalah: 100000 * (i + 1),
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockMasterDivisiRecord): MasterDivisiListItem {
  return {
    id: record.id,
    divisionName: record.divisionName,
    idAjalah: record.idAjalah,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockMasterDivisiRecord): MasterDivisi {
  return {
    id: String(record.id),
    divisionName: record.divisionName,
    idAjalah: record.idAjalah,
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

function sortMasterDivisis(items: MasterDivisiListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'divisionName';
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
function filterMasterDivisisRecords(params?: GetMasterDivisisParams): MasterDivisiListItem[] {
  let items = mockMasterDivisiRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.divisionName.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.divisionName) {
    const qDivisionName = params.divisionName.toLowerCase();
    items = items.filter((r) => String(r.divisionName ?? '').toLowerCase().includes(qDivisionName));
  }
  if (params?.idAjalah !== undefined && params.idAjalah !== '') items = items.filter((r) => Number(r.idAjalah) === Number(params.idAjalah));
  return sortMasterDivisis(items, params?.order, params?.sort);
}

export async function mockGetMasterDivisis(params?: GetMasterDivisisParams): Promise<ApiList<MasterDivisiListItem>> {
  await delay(300);
  const items = filterMasterDivisisRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportMasterDivisis(params?: GetMasterDivisisParams): Promise<Blob> {
  await delay(300);
  const items = filterMasterDivisisRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ["DivisionName","ID Ajalah","Status","Created Date"],
    items.map((r) => [r.divisionName, r.idAjalah, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadMasterDivisiTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_MASTERDIVISI_HEADERS, [BULK_MASTERDIVISI_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadMasterDivisis(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_MASTERDIVISI_HEADERS;
  const missing = expected.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      successCount: 0,
      failedCount: rows.length,
      errors: missing.map((field) => ({
        row: 1,
        field,
        message: t('bulk.missingColumn', { field }),
      })),
    };
  }
  if (rows.length === 0) {
    return {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [{ row: 1, message: t('bulk.emptyFile') }],
    };
  }

  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkMasterDivisiRow(mapped, () => {

      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }

    mockMasterDivisiRecords.push({
      id: Math.max(...mockMasterDivisiRecords.map((r) => r.id)) + 1,
      divisionName: payload.divisionName,
      idAjalah: payload.idAjalah,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}


export async function mockGetMasterDivisiById(id: string): Promise<MasterDivisi> {
  await delay(300);
  const record = mockMasterDivisiRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('master_division.toast.notFound'));
  return toDetail(record);
}

export async function mockCreateMasterDivisi(data: CreateMasterDivisiPayload): Promise<MasterDivisiMutationResult> {
  await delay(300);
  const record: MockMasterDivisiRecord = {
    id: Math.max(...mockMasterDivisiRecords.map((r) => r.id)) + 1,
    divisionName: data.divisionName,
    idAjalah: data.idAjalah,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockMasterDivisiRecords.push(record);
  return { message: t('master_division.toast.created'), data: toDetail(record) };
}

export async function mockUpdateMasterDivisi(
  id: string,
  data: CreateMasterDivisiPayload,
): Promise<MasterDivisiMutationResult> {
  await delay(300);
  const record = mockMasterDivisiRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('master_division.toast.notFound'));
  record.divisionName = data.divisionName;
  record.idAjalah = data.idAjalah;
  return { message: t('master_division.toast.updated'), data: toDetail(record) };
}

export async function mockDeleteMasterDivisi(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockMasterDivisiRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('master_division.toast.notFound'));
  record.status = 'inactive';
  return { message: t('master_division.toast.deleted') };
}

export async function mockRestoreMasterDivisi(id: string): Promise<MasterDivisiMutationResult> {
  await delay(300);
  const record = mockMasterDivisiRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error(t('master_division.toast.notFound'));
  record.status = 'active';
  return { message: t('master_division.toast.restored'), data: toDetail(record) };
}
