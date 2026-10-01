import type { TemplateContext } from '../../engine/context';
import { filterParamKeys, tsDataType } from '../../engine/fieldGenerator';

export function typesTemplate(ctx: TemplateContext): string {
  const { names, fields, features } = ctx;
  const fieldLines = (indent: string): string =>
    fields.map((f) => `${indent}${f.name}: ${tsDataType(f)};`).join('\n');
  const filterParamLines = fields
    .filter((f) => f.filterable && f.filterCriteria)
    .flatMap((f) => filterParamKeys(f))
    .map((key) => `  ${key}?: string;`)
    .join('\n');
  const optionTypes = fields
    .filter((f) => f.isOptionsQuery || f.isLoadOptions)
    .map(
      (f) =>
        `export interface ${f.optionType} {\n  label: string;\n  value: string;\n}`,
    )
    .join('\n\n');

  return `export interface ${names.entity} {
  id: string;
${fieldLines('  ')}
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface ${names.listItem} {
  id: number;
${fieldLines('  ')}
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface ${names.payload} {
${fieldLines('  ')}
}

export interface ${names.params} {
  search?: string;
  status?: string;
${filterParamLines ? `${filterParamLines}\n` : ''}  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
${optionTypes ? `\n${optionTypes}\n` : ''}
export interface ${names.mutationResult}<T = ${names.entity}> {
  message: string;
  data: T;
}
${
  features.bulkUpload
    ? `
export interface BulkRowError {
  /** Nomor baris Excel 1-based (termasuk header). */
  row: number;
  /** Label kolom (header); kosong bila error sebaris file. */
  field?: string;
  message: string;
}

export interface BulkUploadResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: BulkRowError[];
}
`
    : ''
}`;
}
