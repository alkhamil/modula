import type {
  User,
  UserMutationResult,
  BulkRowError,
  BulkUploadResult,
  UserListItem,
  RoleOption,
  GetUsersParams,
  CreateUserPayload,
} from '../types';
import type { ApiList } from '../../../shared/types';
import { XLSX_MIME, buildWorkbook, readWorkbookRows } from '../../../shared/utils';
import {
  BULK_USER_EXAMPLE,
  BULK_USER_HEADERS,
  validateBulkUserRow,
} from '../validation/userBulkValidation';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  roleOptions: true,
  export: true,
  bulkUpload: true,
  bulkTemplate: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockRoleOptions: RoleOption[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

interface MockUserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockUserRecords: MockUserRecord[] = [
  { id: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@example.com', role: 'admin', status: 'active', created_by: 'System', created_date: '2024-01-10 09:00' },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti.nurhaliza@example.com', role: 'editor', status: 'active', created_by: 'System', created_date: '2024-01-12 10:30' },
  { id: 3, name: 'Budi Santoso', email: 'budi.santoso@example.com', role: 'viewer', status: 'active', created_by: 'System', created_date: '2024-02-01 11:15' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@example.com', role: 'editor', status: 'inactive', created_by: 'System', created_date: '2024-02-05 08:45' },
  { id: 5, name: 'Rizky Pratama', email: 'rizky.pratama@example.com', role: 'viewer', status: 'active', created_by: 'System', created_date: '2024-02-20 14:00' },
  { id: 6, name: 'Putri Ayu', email: 'putri.ayu@example.com', role: 'admin', status: 'active', created_by: 'System', created_date: '2024-03-02 09:20' },
  { id: 7, name: 'Agus Wijaya', email: 'agus.wijaya@example.com', role: 'viewer', status: 'active', created_by: 'System', created_date: '2024-03-15 13:10' },
  { id: 8, name: 'Rina Marlina', email: 'rina.marlina@example.com', role: 'editor', status: 'active', created_by: 'System', created_date: '2024-04-01 10:05' },
  { id: 9, name: 'Dedi Kurniawan', email: 'dedi.kurniawan@example.com', role: 'viewer', status: 'inactive', created_by: 'System', created_date: '2024-04-10 15:40' },
  { id: 10, name: 'Fitri Handayani', email: 'fitri.handayani@example.com', role: 'editor', status: 'active', created_by: 'System', created_date: '2024-05-03 09:55' },
  { id: 11, name: 'Hendra Gunawan', email: 'hendra.gunawan@example.com', role: 'viewer', status: 'active', created_by: 'System', created_date: '2024-05-20 11:25' },
  { id: 12, name: 'Nina Kurnia', email: 'nina.kurnia@example.com', role: 'admin', status: 'active', created_by: 'System', created_date: '2024-06-07 08:30' },
  { id: 13, name: 'Tono Prasetyo', email: 'tono.prasetyo@example.com', role: 'viewer', status: 'active', created_by: 'System', created_date: '2024-06-18 16:00' },
  { id: 14, name: 'Wulan Sari', email: 'wulan.sari@example.com', role: 'editor', status: 'active', created_by: 'System', created_date: '2024-07-01 09:10' },
];

function toListItem(record: MockUserRecord): UserListItem {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockUserRecord): User {
  return {
    id: String(record.id),
    name: record.name,
    email: record.email,
    role: record.role,
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

function sortUsers(items: UserListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'name';
  const direction = dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (av == null || bv == null) return 0;
    return String(av).localeCompare(String(bv)) * direction;
  });
}

/** Filter + sortir tanpa pagination — dipakai list dan export. */
function filterUserRecords(params?: GetUsersParams): UserListItem[] {
  let items = mockUserRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.name) {
    const q = params.name.toLowerCase();
    items = items.filter((r) => r.name.toLowerCase().includes(q));
  }
  if (params?.email) {
    const q = params.email.toLowerCase();
    items = items.filter((r) => r.email.toLowerCase().includes(q));
  }
  if (params?.role) items = items.filter((r) => r.role === params.role);
  return sortUsers(items, params?.order, params?.sort);
}

export async function mockGetUsers(params?: GetUsersParams): Promise<ApiList<UserListItem>> {
  await delay(300);
  const items = filterUserRecords(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockExportUsers(params?: GetUsersParams): Promise<Blob> {
  await delay(300);
  const items = filterUserRecords({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ['Name', 'Email', 'Role', 'Status', 'Created Date'],
    items.map((r) => [r.name, r.email, r.role, r.status, r.created_date]),
  );
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockDownloadUserTemplate(): Promise<Blob> {
  const data = await buildWorkbook(BULK_USER_HEADERS, [BULK_USER_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUploadUsers(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const missing = BULK_USER_HEADERS.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
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
  const seen = new Set(mockUserRecords.map((r) => r.email.toLowerCase()));
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of BULK_USER_HEADERS) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulkUserRow(
      mapped,
      (field, value) => field === 'email' && seen.has(value.toLowerCase()),
    );
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
    seen.add(payload.email.toLowerCase());
    mockUserRecords.push({
      id: Math.max(...mockUserRecords.map((r) => r.id)) + 1,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}

export async function mockGetUserById(id: string): Promise<User> {
  await delay(300);
  const record = mockUserRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('User not found');
  return toDetail(record);
}

function mockEmailError() {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'SAL-USER-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field: 'email', message: 'Email already exists, please use another' }],
        },
      },
    },
  };
}

export async function mockCreateUser(data: CreateUserPayload): Promise<UserMutationResult> {
  await delay(300);
  if (mockUserRecords.some((r) => r.email.toLowerCase() === data.email.toLowerCase())) {
    throw mockEmailError();
  }
  const record: MockUserRecord = {
    id: Math.max(...mockUserRecords.map((r) => r.id)) + 1,
    name: data.name,
    email: data.email,
    role: data.role,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockUserRecords.push(record);
  return { message: 'User created successfully.', data: toDetail(record) };
}

export async function mockUpdateUser(id: string, data: CreateUserPayload): Promise<UserMutationResult> {
  await delay(300);
  const record = mockUserRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('User not found');
  if (
    mockUserRecords.some(
      (r) => String(r.id) !== id && r.email.toLowerCase() === data.email.toLowerCase(),
    )
  ) {
    throw mockEmailError();
  }
  record.name = data.name;
  record.email = data.email;
  record.role = data.role;
  return { message: 'User updated successfully.', data: toDetail(record) };
}

export async function mockDeleteUser(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockUserRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('User not found');
  record.status = 'inactive';
  return { message: 'User deleted successfully' };
}

export async function mockRestoreUser(id: string): Promise<UserMutationResult> {
  await delay(300);
  const record = mockUserRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('User not found');
  record.status = 'active';
  return { message: 'User restored successfully', data: toDetail(record) };
}

export async function mockGetRoleOptions(): Promise<RoleOption[]> {
  await delay(200);
  return mockRoleOptions;
}
