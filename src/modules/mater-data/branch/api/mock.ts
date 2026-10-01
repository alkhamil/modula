import type {
  Branch,
  BranchMutationResult,
  BranchListItem,
  CreateBranchPayload,
  GetBranchesParams,
} from '../types';
import type { ApiList } from '../../../../shared/types';

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


interface MockBranchRecord {
  id: number;
  branchName: string;
  branchCode: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockBranchRecords: MockBranchRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  branchName: `Branch Name ${i + 1}`,
  branchCode: `Branch Code ${i + 1}`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockBranchRecord): BranchListItem {
  return {
    id: record.id,
    branchName: record.branchName,
    branchCode: record.branchCode,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockBranchRecord): Branch {
  return {
    id: String(record.id),
    branchName: record.branchName,
    branchCode: record.branchCode,
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

function sortBranches(items: BranchListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'branchName';
  const direction = dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (av == null || bv == null) return 0;
    return String(av).localeCompare(String(bv)) * direction;
  });
}

export async function mockGetBranches(params?: GetBranchesParams): Promise<ApiList<BranchListItem>> {
  await delay(300);
  let items = mockBranchRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.branchName.toLowerCase().includes(q) ||
        r.branchCode.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);

  items = sortBranches(items, params?.order, params?.sort);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockGetBranchById(id: string): Promise<Branch> {
  await delay(300);
  const record = mockBranchRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Branch not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-BRANCH-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateBranch(data: CreateBranchPayload): Promise<BranchMutationResult> {
  await delay(300);
  if (mockBranchRecords.some((r) => r.branchName === data.branchName)) {
    throw mockConflictError('branchName', 'Branch Name already exists, please use another');
  }
  const record: MockBranchRecord = {
    id: Math.max(...mockBranchRecords.map((r) => r.id)) + 1,
    branchName: data.branchName,
    branchCode: data.branchCode,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockBranchRecords.push(record);
  return { message: 'Branch created successfully.', data: toDetail(record) };
}

export async function mockUpdateBranch(
  id: string,
  data: CreateBranchPayload,
): Promise<BranchMutationResult> {
  await delay(300);
  const record = mockBranchRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Branch not found');
  if (mockBranchRecords.some((r) => String(r.id) !== id && r.branchName === data.branchName)) {
    throw mockConflictError('branchName', 'Branch Name already exists, please use another');
  }
  record.branchName = data.branchName;
  record.branchCode = data.branchCode;
  return { message: 'Branch updated successfully.', data: toDetail(record) };
}

export async function mockDeleteBranch(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockBranchRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Branch not found');
  record.status = 'inactive';
  return { message: 'Branch deleted successfully' };
}

export async function mockRestoreBranch(id: string): Promise<BranchMutationResult> {
  await delay(300);
  const record = mockBranchRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Branch not found');
  record.status = 'active';
  return { message: 'Branch restored successfully', data: toDetail(record) };
}
