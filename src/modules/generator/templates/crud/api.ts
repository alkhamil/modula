import type { TemplateContext } from '../../engine/context';
import { arraySubLoadModels, rowTypeName, tsDataType } from '../../engine/fieldGenerator';
import {
  mockFilterLine,
  mockLoadOptionsFn,
  mockOptionsConst,
  mockRecordValue,
  optionMapping,
  optionsEndpoint,
} from '../../engine/sourceGenerator';

function optionsSelects(ctx: TemplateContext) {
  return ctx.fields.filter((f) => f.isOptionsQuery);
}

function loadSelects(ctx: TemplateContext) {
  return ctx.fields.filter((f) => f.isLoadOptions);
}

/** Ekspresi nilai sel export per field (mirror tampilan tabel). */
function exportCellValue(field: { name: string; valueType: string }, rowVar: string): string {
  switch (field.valueType) {
    case 'boolean':
      return `(${rowVar}.${field.name} ? 'Yes' : 'No')`;
    case 'stringArray':
      return `(${rowVar}.${field.name} ?? []).join(', ')`;
    case 'rowArray':
      return `(((${rowVar}.${field.name} ?? []).length > 0 ? (${rowVar}.${field.name} ?? []).length + ' baris' : ''))`;
    default:
      return `${rowVar}.${field.name}`;
  }
}

export function serviceTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const base = `/api/v1/${names.pluralKebab}`;
  const typeImports = [
    names.entity,
    names.mutationResult,
    ...(features.bulkUpload ? ['BulkUploadResult'] : []),
    names.payload,
    names.params,
    names.listItem,
    ...optionsSelects(ctx).map((f) => f.optionType),
    ...loadSelects(ctx).map((f) => f.optionType),
  ];

  const optionsFns = optionsSelects(ctx)
    .map((f) => {
      const mapping = optionMapping(f);
      const shape = mapping ? 'Record<string, unknown>' : f.optionType;
      const body = mapping
        ? `const content = res.data.response_output?.list.content ?? [];\n  return content.map(${mapping});`
        : `return res.data.response_output?.list.content ?? [];`;
      return `export async function get${f.pascal}Options(): Promise<${f.optionType}[]> {
  const res = await api.get<ApiResponse<ApiList<${shape}>>>('${optionsEndpoint(ctx, f)}');
  ${body}
}`;
    })
    .join('\n\n');

  const loadFns = loadSelects(ctx)
    .map((f) => {
      const mapping = optionMapping(f);
      const shape = mapping ? 'Record<string, unknown>' : f.optionType;
      const body = mapping
        ? `const content = res.data.response_output?.list.content ?? [];\n  return content.map(${mapping});`
        : `return res.data.response_output?.list.content ?? [];`;
      return `export async function ${f.loadOptionsFn}(
  search = '',
  page = 1,
  size = 20,
): Promise<${f.optionType}[]> {
  const res = await api.get<ApiResponse<ApiList<${shape}>>>('${optionsEndpoint(ctx, f)}', {
    params: { search, page, size },
  });
  ${body}
}`;
    })
    .join('\n\n');

  return `import api from '${names.sharedPrefix}shared/lib/api';
import type {
  ${typeImports.join(',\n  ')},
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '${names.sharedPrefix}shared/types';

export async function get${names.entityPlural}(params?: ${names.params}): Promise<ApiList<${names.listItem}>> {
  const res = await api.get<ApiResponse<ApiList<${names.listItem}>>>('${base}', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function get${names.entity}ById(id: string): Promise<${names.entity}> {
  const res = await api.get<ApiResponse<ApiDetail<${names.entity}>>>(\`${base}/\${id}\`);
  return res.data.response_output!.detail;
}

export async function create${names.entity}(data: ${names.payload}): Promise<${names.mutationResult}> {
  const res = await api.post<ApiResponse<ApiDetail<${names.entity}>>>('${base}', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function update${names.entity}(id: string, data: ${names.payload}): Promise<${names.mutationResult}> {
  const res = await api.put<ApiResponse<ApiDetail<${names.entity}>>>(\`${base}/\${id}\`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function delete${names.entity}(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(\`${base}/\${id}\`);
  return { message: res.data.response_schema.response_message };
}

export async function restore${names.entity}(id: string): Promise<${names.mutationResult}> {
  const res = await api.patch<ApiResponse<ApiDetail<${names.entity}>>>(\`${base}/\${id}/restore\`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}
${optionsFns ? `\n${optionsFns}\n` : ''}${loadFns ? `\n${loadFns}\n` : ''}${
  features.export
    ? `
export async function export${names.entityPlural}(params?: ${names.params}): Promise<Blob> {
  const res = await api.get('${base}/export', { params, responseType: 'blob' });
  return res.data as Blob;
}
`
    : ''
}${
  features.bulkUpload
    ? `
export async function bulkUpload${names.entityPlural}(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('${base}/bulk-upload', form);
  return res.data.response_output!;
}

export async function download${names.entity}Template(): Promise<Blob> {
  const res = await api.get('${base}/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}
`
    : ''
}`;
}

export function mockTemplate(ctx: TemplateContext): string {
  const { names, fields, features, uniqueField } = ctx;
  const entityLower = names.entity.toLowerCase();

  const typeImports = [
    names.entity,
    names.mutationResult,
    ...(features.bulkUpload ? ['BulkRowError', 'BulkUploadResult'] : []),
    names.listItem,
    names.payload,
    names.params,
    ...optionsSelects(ctx).map((f) => f.optionType),
    ...loadSelects(ctx).map((f) => f.optionType),
    ...arraySubLoadModels(fields).map((m) => m.optionType),
    ...fields.filter((f) => f.config.type === 'formArrayField').map((f) => rowTypeName(f)),
  ];

  const mockFlags = [
    '  list: true,',
    '  detail: true,',
    '  create: true,',
    '  update: true,',
    '  delete: true,',
    '  restore: true,',
    ...optionsSelects(ctx).map((f) => `  ${f.name}Options: true,`),
    ...loadSelects(ctx).map((f) => `  ${f.name}LoadOptions: true,`),
    ...(features.export ? ['  export: true,'] : []),
    ...(features.bulkUpload ? ['  bulkUpload: true,', '  bulkTemplate: true,'] : []),
  ].join('\n');

  const optionsConsts = optionsSelects(ctx).map(mockOptionsConst).join('\n\n');
  const loadFns = [...loadSelects(ctx), ...arraySubLoadModels(fields)]
    .map(mockLoadOptionsFn)
    .join('\n\n');

  const recordFields = fields.map((f) => `  ${f.name}: ${mockRecordValue(f)},`).join('\n');

  const stringFields = fields.filter((f) => f.valueType === 'string');
  const arrayFields = fields.filter((f) => f.valueType === 'stringArray');
  const searchConditions = [
    ...stringFields.map((f) => `r.${f.name}.toLowerCase().includes(q)`),
    ...arrayFields.map((f) => `(r.${f.name} ?? []).join(' ').toLowerCase().includes(q)`),
    'String(r.id).includes(q)',
  ].join(' ||\n        ');

  const filterLines = fields
    .filter((f) => f.filterable && f.filterCriteria)
    .map((f) =>
      mockFilterLine(f)
        .split('\n')
        .map((line, i) => (i === 0 ? `  ${line}` : line))
        .join('\n'),
    )
    .join('\n');

  const exportHeaders = [
    ...fields.map((f) => f.label),
    'Status',
    'Created Date',
  ];
  const exportCells = (rowVar: string): string =>
    [
      ...fields.map((f) => exportCellValue(f, rowVar)),
      `${rowVar}.status`,
      `${rowVar}.created_date`,
    ].join(', ');
  const uniqueFields = fields.filter(
    (f) => f.config.rules.includes('unique') && f.valueType !== 'stringArray',
  );

  const conflictCheck = (exclude: string): string =>
    uniqueField
      ? `
  if (mock${names.entity}Records.some((r) => ${exclude}r.${uniqueField.name} === data.${uniqueField.name})) {
    throw mockConflictError('${uniqueField.name}', '${uniqueField.label} already exists, please use another');
  }`
      : '';

  const validationImport = features.bulkUpload
    ? `import {\n  BULK_${names.entity.toUpperCase()}_EXAMPLE,\n  BULK_${names.entity.toUpperCase()}_HEADERS,\n  validateBulk${names.entity}Row,\n} from '../validation/${names.camel}BulkValidation';\n`
    : '';
  const excelImport =
    features.export || features.bulkUpload
      ? `import { XLSX_MIME, buildWorkbook${features.bulkUpload ? ', readWorkbookRows' : ''} } from '${names.sharedPrefix}shared/utils';\n`
      : '';

  return `import type {
  ${typeImports.join(',\n  ')},
} from '../types';
import type { ApiList } from '${names.sharedPrefix}shared/types';
${excelImport}${validationImport}
export const USE_MOCK = {
${mockFlags}
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
${optionsConsts ? `\n${optionsConsts}\n` : ''}
${loadFns ? `${loadFns}\n` : ''}
interface Mock${names.entity}Record {
  id: number;
${fields.map((f) => `  ${f.name}: ${tsDataType(f)};`).join('\n')}
  status: 'active' | 'inactive';
  created_by: string | null;
  created_date: string;
}

const mock${names.entity}Records: Mock${names.entity}Record[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
${recordFields}
  status: i % 4 === 3 ? 'inactive' : 'active',
  created_by: 'System',
  created_date: \`2024-0\${(i % 9) + 1}-\${10 + (i % 9)} 09:00\`,
}));

function toListItem(record: Mock${names.entity}Record): ${names.listItem} {
  return {
    id: record.id,
${fields.map((f) => `    ${f.name}: record.${f.name},`).join('\n')}
    created_date: record.created_date,
    created_by: record.created_by,
    status: record.status,
  };
}

function toDetail(record: Mock${names.entity}Record): ${names.entity} {
  return {
    id: String(record.id),
${fields.map((f) => `    ${f.name}: record.${f.name},`).join('\n')}
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

function sort${names.entityPlural}(items: ${names.listItem}[], key: string | undefined, dir: string | undefined) {
  const sortKey = key || '${fields[0]?.name ?? 'id'}';
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
function filter${names.entityPlural}Records(params?: ${names.params}): ${names.listItem}[] {
  let items = mock${names.entity}Records.map(toListItem);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (r) =>
        ${searchConditions},
    );
  }
  if (params?.status) items = items.filter((r) => r.status === params.status);
${filterLines}
  return sort${names.entityPlural}(items, params?.order, params?.sort);
}

export async function mockGet${names.entityPlural}(params?: ${names.params}): Promise<ApiList<${names.listItem}>> {
  await delay(300);
  const items = filter${names.entityPlural}Records(params);
  const result = paginate(items, (params?.page ?? 0) + 1, params?.size ?? 10);
  return { list: result };
}
${
  features.export
    ? `
export async function mockExport${names.entityPlural}(params?: ${names.params}): Promise<Blob> {
  await delay(300);
  const items = filter${names.entityPlural}Records({ ...params, page: undefined, size: undefined });
  const data = await buildWorkbook(
    ${JSON.stringify(exportHeaders)},
    items.map((r) => [${exportCells('r')}]),
  );
  return new Blob([data], { type: XLSX_MIME });
}
`
    : ''
}${
  features.bulkUpload
    ? `
export async function mockDownload${names.entity}Template(): Promise<Blob> {
  const data = await buildWorkbook(BULK_${names.entity.toUpperCase()}_HEADERS, [BULK_${names.entity.toUpperCase()}_EXAMPLE]);
  return new Blob([data], { type: XLSX_MIME });
}

export async function mockBulkUpload${names.entityPlural}(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  await delay(500);
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const { headers, rows } = await readWorkbookRows(buffer);
  const headerIndex = new Map(headers.map((h, i) => [h.trim().toLowerCase(), i]));
  const expected = BULK_${names.entity.toUpperCase()}_HEADERS;
  const missing = expected.filter((h) => !headerIndex.has(h.trim().toLowerCase()));
  if (missing.length > 0) {
    return {
      totalRows: rows.length,
      successCount: 0,
      failedCount: rows.length,
      errors: missing.map((field) => ({
        row: 1,
        field,
        message: \`Kolom "\${field}" tidak ditemukan di file.\`,
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
${uniqueFields
  .map(
    (f) =>
      `  const seen${f.pascal} = new Set(mock${names.entity}Records.map((r) => String(r.${f.name}).toLowerCase()));`,
  )
  .join('\n')}
  const errors: BulkRowError[] = [];
  let successCount = 0;
  rows.forEach((row, index) => {
    const mapped: Record<string, unknown> = {};
    for (const header of expected) {
      const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
      mapped[header] = row[source] ?? '';
    }
    const { payload, errors: rowErrors } = validateBulk${names.entity}Row(mapped, ${uniqueFields.length > 0 ? '(field, value)' : '()'} => {
${uniqueFields.map((f) => `      if (field === '${f.name}') return seen${f.pascal}.has(value.toLowerCase());`).join('\n')}
      return false;
    });
    if (!payload) {
      for (const rowError of rowErrors) {
        errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
      }
      return;
    }
${uniqueFields
  .map(
    (f) =>
      `    seen${f.pascal}.add(String(payload.${f.name}).toLowerCase());`,
  )
  .join('\n')}
    mock${names.entity}Records.push({
      id: Math.max(...mock${names.entity}Records.map((r) => r.id)) + 1,
${fields.map((f) => `      ${f.name}: payload.${f.name},`).join('\n')}
      status: 'active',
      created_by: 'Bulk Upload',
      created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    successCount += 1;
  });
  return { totalRows: rows.length, successCount, failedCount: rows.length - successCount, errors };
}
`
    : ''
}

export async function mockGet${names.entity}ById(id: string): Promise<${names.entity}> {
  await delay(300);
  const record = mock${names.entity}Records.find((r) => String(r.id) === id);
  if (!record) throw new Error('${names.entity} not found');
  return toDetail(record);
}
${uniqueField ? `
function mockConflictError(field: string, message: string) {
  return {
    response: {
      data: {
        response_schema: {
          response_code: 'MOCK-${entityLower.toUpperCase()}-400',
          response_message: 'Parameter tidak valid',
        },
        response_output: {
          errors: [{ field, message }],
        },
      },
    },
  };
}
` : ''}
export async function mockCreate${names.entity}(data: ${names.payload}): Promise<${names.mutationResult}> {
  await delay(300);${conflictCheck('')}
  const record: Mock${names.entity}Record = {
    id: Math.max(...mock${names.entity}Records.map((r) => r.id)) + 1,
${fields.map((f) => `    ${f.name}: data.${f.name},`).join('\n')}
    status: 'active',
    created_by: 'System',
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  mock${names.entity}Records.push(record);
  return { message: '${names.entity} created successfully.', data: toDetail(record) };
}

export async function mockUpdate${names.entity}(
  id: string,
  data: ${names.payload},
): Promise<${names.mutationResult}> {
  await delay(300);
  const record = mock${names.entity}Records.find((r) => String(r.id) === id);
  if (!record) throw new Error('${names.entity} not found');${conflictCheck('String(r.id) !== id && ')}
${fields.map((f) => `  record.${f.name} = data.${f.name};`).join('\n')}
  return { message: '${names.entity} updated successfully.', data: toDetail(record) };
}

export async function mockDelete${names.entity}(id: string): Promise<{ message: string }> {
  await delay(300);
  const record = mock${names.entity}Records.find((r) => String(r.id) === id);
  if (!record) throw new Error('${names.entity} not found');
  record.status = 'inactive';
  return { message: '${names.entity} deleted successfully' };
}

export async function mockRestore${names.entity}(id: string): Promise<${names.mutationResult}> {
  await delay(300);
  const record = mock${names.entity}Records.find((r) => String(r.id) === id);
  if (!record) throw new Error('${names.entity} not found');
  record.status = 'active';
  return { message: '${names.entity} restored successfully', data: toDetail(record) };
}
${optionsSelects(ctx)
  .map(
    (f) => `
export async function mockGet${f.pascal}Options(): Promise<${f.optionType}[]> {
  await delay(200);
  return ${f.mockOptionsVar};
}
`,
  )
  .join('')}`;
}

/** Mock-only: resolver re-export fungsi mock langsung (tanpa service axios). Nama export sama seperti versi switch. */
export function resolverTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const lines = [
    `export { mockGet${names.entityPlural} as get${names.entityPlural} } from './mock';`,
    `export { mockGet${names.entity}ById as get${names.entity}ById } from './mock';`,
    `export { mockCreate${names.entity} as create${names.entity} } from './mock';`,
    `export { mockUpdate${names.entity} as update${names.entity} } from './mock';`,
    `export { mockDelete${names.entity} as delete${names.entity} } from './mock';`,
    `export { mockRestore${names.entity} as restore${names.entity} } from './mock';`,
  ];
  if (features.export) {
    lines.push(`export { mockExport${names.entityPlural} as export${names.entityPlural} } from './mock';`);
  }
  if (features.bulkUpload) {
    lines.push(
      `export { mockBulkUpload${names.entityPlural} as bulkUpload${names.entityPlural} } from './mock';`,
    );
    lines.push(
      `export { mockDownload${names.entity}Template as download${names.entity}Template } from './mock';`,
    );
  }
  for (const f of optionsSelects(ctx)) {
    lines.push(`export { mockGet${f.pascal}Options as get${f.pascal}Options } from './mock';`);
  }
  for (const f of loadSelects(ctx)) {
    lines.push(`export { ${f.loadOptionsFn} } from './mock';`);
  }
  for (const f of arraySubLoadModels(ctx.fields)) {
    lines.push(`export { ${f.loadOptionsFn} } from './mock';`);
  }
  return `${lines.join('\n')}\n`;
}

export function queriesTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const needList = features.list;
  const needDetail = features.detail || features.create || features.edit;
  const needForm = features.create || features.edit || features.detail;
  const optionQueries = needForm ? optionsSelects(ctx) : [];

  const typeImports = [
    ...(needList ? [names.params, names.listItem] : []),
    ...(needDetail ? [names.entity] : []),
    ...optionQueries.map((f) => f.optionType),
  ];
  const apiListImport = needList
    ? `import type { ApiList } from '${names.sharedPrefix}shared/types';\n`
    : '';
  const resolverImports = [
    ...(needList ? [`get${names.entityPlural}`] : []),
    ...(needDetail ? [`get${names.entity}ById`] : []),
    ...optionQueries.map((f) => `get${f.pascal}Options`),
  ];

  return `import { useQuery } from '@tanstack/react-query';
import { ${resolverImports.join(', ')} } from './resolver';
import type { ${typeImports.join(', ')} } from '../types';
${apiListImport}${needList ? `
export function use${names.entity}ListQuery(params: ${names.params}) {
  return useQuery<ApiList<${names.listItem}>>({
    queryKey: ['${names.pluralKebab}', params],
    queryFn: () => get${names.entityPlural}({ ...params, page: (params.page ?? 1) - 1 }),
    placeholderData: (prev) => prev,
  });
}
` : ''}${needDetail ? `
export function use${names.entity}DetailQuery(id?: string) {
  return useQuery<${names.entity}>({
    queryKey: ['${names.kebab}', id],
    queryFn: () => get${names.entity}ById(id!),
    enabled: !!id,
  });
}
` : ''}${optionQueries
    .map(
      (f) => `
export function ${f.optionsQueryHook}() {
  return useQuery<${f.optionType}[]>({
    queryKey: ['${names.kebab}-${f.name}-options'],
    queryFn: get${f.pascal}Options,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
`,
    )
    .join('')}`;
}

export function mutationsTemplate(ctx: TemplateContext): string {
  const { names, features } = ctx;
  const needUpsert = features.create || features.edit || features.detail;
  const needDelete = features.delete;
  const needBulk = features.bulkUpload;
  const resolverImports = [
    ...(needDelete ? [`delete${names.entity}`, `restore${names.entity}`] : []),
    ...(needUpsert ? [`create${names.entity}`, `update${names.entity}`] : []),
    ...(needBulk ? [`bulkUpload${names.entityPlural}`] : []),
  ];

  return `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ${resolverImports.join(', ')} } from './resolver';
${needUpsert ? `import type { ${names.payload} } from '../types';\n` : ''}${needDelete ? `
export function useDelete${names.entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => delete${names.entity}(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['${names.pluralKebab}'] }),
  });
}

export function useRestore${names.entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restore${names.entity}(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['${names.pluralKebab}'] }),
  });
}
` : ''}${needUpsert ? `
export function useUpsert${names.entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: ${names.payload} }) =>
      id ? update${names.entity}(id, data) : create${names.entity}(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['${names.pluralKebab}'] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['${names.kebab}', variables.id] });
      }
    },
  });
}
` : ''}${needBulk ? `
export function useBulkUpload${names.entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUpload${names.entityPlural}(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['${names.pluralKebab}'] }),
  });
}
` : ''}`;
}

export function needsQueriesFile(ctx: TemplateContext): boolean {
  const { features } = ctx;
  return (
    features.list ||
    features.detail ||
    features.create ||
    features.edit ||
    ((features.create || features.edit || features.detail) && ctx.hasOptionsSelects)
  );
}

export function apiIndexTemplate(ctx: TemplateContext): string {
  const { features } = ctx;
  const needMutations =
    features.create || features.edit || features.detail || features.delete || features.bulkUpload;
  return `export * from './resolver';
${needsQueriesFile(ctx) ? `export * from './queries';\n` : ''}${needMutations ? `export * from './mutations';\n` : ''}`;
}
