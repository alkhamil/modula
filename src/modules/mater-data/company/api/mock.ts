import type {
  Company,
  CompanyMutationResult,
  CompanyListItem,
  CreateCompanyPayload,
  GetCompaniesParams,
  CompanyGroupOption,
} from '../types';
import type { ApiList } from '../../../../shared/types';

export const USE_MOCK = {
  list: true,
  detail: true,
  create: true,
  update: true,
  delete: true,
  restore: true,
  companyGroupLoadOptions: true,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockCompanyGroupOptionsBase: CompanyGroupOption[] = [
  { label: 'Company Group 1', value: 'COMPANYGROUP_1' },
  { label: 'Company Group 2', value: 'COMPANYGROUP_2' },
  { label: 'Company Group 3', value: 'COMPANYGROUP_3' },
  { label: 'Company Group 4', value: 'COMPANYGROUP_4' },
  { label: 'Company Group 5', value: 'COMPANYGROUP_5' },
  { label: 'Company Group 6', value: 'COMPANYGROUP_6' },
  { label: 'Company Group 7', value: 'COMPANYGROUP_7' },
  { label: 'Company Group 8', value: 'COMPANYGROUP_8' },
  { label: 'Company Group 9', value: 'COMPANYGROUP_9' },
  { label: 'Company Group 10', value: 'COMPANYGROUP_10' },
  { label: 'Company Group 11', value: 'COMPANYGROUP_11' },
  { label: 'Company Group 12', value: 'COMPANYGROUP_12' },
  { label: 'Company Group 13', value: 'COMPANYGROUP_13' },
  { label: 'Company Group 14', value: 'COMPANYGROUP_14' },
  { label: 'Company Group 15', value: 'COMPANYGROUP_15' },
  { label: 'Company Group 16', value: 'COMPANYGROUP_16' },
  { label: 'Company Group 17', value: 'COMPANYGROUP_17' },
  { label: 'Company Group 18', value: 'COMPANYGROUP_18' },
  { label: 'Company Group 19', value: 'COMPANYGROUP_19' },
  { label: 'Company Group 20', value: 'COMPANYGROUP_20' },
  { label: 'Company Group 21', value: 'COMPANYGROUP_21' },
  { label: 'Company Group 22', value: 'COMPANYGROUP_22' },
  { label: 'Company Group 23', value: 'COMPANYGROUP_23' },
  { label: 'Company Group 24', value: 'COMPANYGROUP_24' },
  { label: 'Company Group 25', value: 'COMPANYGROUP_25' },
  { label: 'Company Group 26', value: 'COMPANYGROUP_26' },
  { label: 'Company Group 27', value: 'COMPANYGROUP_27' },
  { label: 'Company Group 28', value: 'COMPANYGROUP_28' },
  { label: 'Company Group 29', value: 'COMPANYGROUP_29' },
  { label: 'Company Group 30', value: 'COMPANYGROUP_30' },
  { label: 'Company Group 31', value: 'COMPANYGROUP_31' },
  { label: 'Company Group 32', value: 'COMPANYGROUP_32' },
  { label: 'Company Group 33', value: 'COMPANYGROUP_33' },
  { label: 'Company Group 34', value: 'COMPANYGROUP_34' },
  { label: 'Company Group 35', value: 'COMPANYGROUP_35' },
  { label: 'Company Group 36', value: 'COMPANYGROUP_36' },
  { label: 'Company Group 37', value: 'COMPANYGROUP_37' },
  { label: 'Company Group 38', value: 'COMPANYGROUP_38' },
  { label: 'Company Group 39', value: 'COMPANYGROUP_39' },
  { label: 'Company Group 40', value: 'COMPANYGROUP_40' },
  { label: 'Company Group 41', value: 'COMPANYGROUP_41' },
  { label: 'Company Group 42', value: 'COMPANYGROUP_42' },
  { label: 'Company Group 43', value: 'COMPANYGROUP_43' },
  { label: 'Company Group 44', value: 'COMPANYGROUP_44' },
  { label: 'Company Group 45', value: 'COMPANYGROUP_45' },
  { label: 'Company Group 46', value: 'COMPANYGROUP_46' },
  { label: 'Company Group 47', value: 'COMPANYGROUP_47' },
  { label: 'Company Group 48', value: 'COMPANYGROUP_48' },
  { label: 'Company Group 49', value: 'COMPANYGROUP_49' },
  { label: 'Company Group 50', value: 'COMPANYGROUP_50' },
  { label: 'Company Group 51', value: 'COMPANYGROUP_51' },
  { label: 'Company Group 52', value: 'COMPANYGROUP_52' },
  { label: 'Company Group 53', value: 'COMPANYGROUP_53' },
  { label: 'Company Group 54', value: 'COMPANYGROUP_54' },
  { label: 'Company Group 55', value: 'COMPANYGROUP_55' },
  { label: 'Company Group 56', value: 'COMPANYGROUP_56' },
  { label: 'Company Group 57', value: 'COMPANYGROUP_57' },
  { label: 'Company Group 58', value: 'COMPANYGROUP_58' },
  { label: 'Company Group 59', value: 'COMPANYGROUP_59' },
  { label: 'Company Group 60', value: 'COMPANYGROUP_60' },
];

export async function loadCompanyGroupOptions(
  search = '',
  page = 1,
  size = 20,
): Promise<CompanyGroupOption[]> {
  await delay(300);
  const q = search.toLowerCase();
  const filtered = q
    ? mockCompanyGroupOptionsBase.filter((o) => o.label.toLowerCase().includes(q))
    : mockCompanyGroupOptionsBase;
  return filtered.slice((page - 1) * size, page * size);
}

interface MockCompanyRecord {
  id: number;
  companyName: string;
  companyGroup: string;
  companyAddress: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mockCompanyRecords: MockCompanyRecord[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  companyName: `Company Name ${i + 1}`,
  companyGroup: `COMPANYGROUP_${i + 1}`,
  companyAddress: `Company Address ${i + 1} text`,
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: `2024-0${(i % 9) + 1}-${10 + (i % 9)} 09:00`,
}));

function toListItem(record: MockCompanyRecord): CompanyListItem {
  return {
    id: record.id,
    companyName: record.companyName,
    companyGroup: record.companyGroup,
    companyAddress: record.companyAddress,
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: MockCompanyRecord): Company {
  return {
    id: String(record.id),
    companyName: record.companyName,
    companyGroup: record.companyGroup,
    companyAddress: record.companyAddress,
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

function sortCompanies(items: CompanyListItem[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || 'companyName';
  const direction = dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (av == null || bv == null) return 0;
    return String(av).localeCompare(String(bv)) * direction;
  });
}

export async function mockGetCompanies(params?: GetCompaniesParams): Promise<ApiList<CompanyListItem>> {
  await delay(300);
  let items = mockCompanyRecords.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.companyName.toLowerCase().includes(q) ||
        r.companyGroup.toLowerCase().includes(q) ||
        r.companyAddress.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
  if (params?.companyGroup) items = items.filter((r) => r.companyGroup === params.companyGroup);
  items = sortCompanies(items, params?.order, params?.sort);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}

export async function mockGetCompanyById(id: string): Promise<Company> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  return toDetail(record);
}

function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-COMPANY-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}

export async function mockCreateCompany(data: CreateCompanyPayload): Promise<CompanyMutationResult> {
  await delay(300);
  if (mockCompanyRecords.some((r) => r.companyName === data.companyName)) {
    throw mockConflictError('companyName', 'Company Name already exists, please use another');
  }
  const record: MockCompanyRecord = {
    id: Math.max(...mockCompanyRecords.map((r) => r.id)) + 1,
    companyName: data.companyName,
    companyGroup: data.companyGroup,
    companyAddress: data.companyAddress,
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mockCompanyRecords.push(record);
  return { message: 'Company created successfully.', data: toDetail(record) };
}

export async function mockUpdateCompany(
  id: string,
  data: CreateCompanyPayload,
): Promise<CompanyMutationResult> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  if (mockCompanyRecords.some((r) => String(r.id) !== id && r.companyName === data.companyName)) {
    throw mockConflictError('companyName', 'Company Name already exists, please use another');
  }
  record.companyName = data.companyName;
  record.companyGroup = data.companyGroup;
  record.companyAddress = data.companyAddress;
  return { message: 'Company updated successfully.', data: toDetail(record) };
}

export async function mockDeleteCompany(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  record.status = 'inactive';
  return { message: 'Company deleted successfully' };
}

export async function mockRestoreCompany(id: string): Promise<CompanyMutationResult> {
  await delay(300);
  const record = mockCompanyRecords.find((r) => String(r.id) === id);
  if (!record) throw new Error('Company not found');
  record.status = 'active';
  return { message: 'Company restored successfully', data: toDetail(record) };
}
