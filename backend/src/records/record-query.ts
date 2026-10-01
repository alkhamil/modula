/**
 * Penerjemah murni query list FE → fragmen SQL atas kolom JSON `data`.
 * Meniru semantik filter mock FE (`mockFilterLine` + `filter<EntityPlural>Records`).
 * Alias tabel: `record`. Semua nilai via named params (anti-injeksi).
 */

export interface QueryFieldMeta {
  name: string;
  /** FieldType FE (textField, numberField, ...). */
  type: string;
  filterable: boolean;
  filterCriteria: string | null;
  rules: string[];
}

export interface BuiltRecordQuery {
  /** Fragmen AND (tanpa kata WHERE). */
  where: string[];
  params: Record<string, unknown>;
  orderExpr: string;
  orderDir: 'ASC' | 'DESC';
  page: number;
  size: number;
}

export type FieldValueType = 'string' | 'number' | 'boolean' | 'stringArray' | 'file';

/** Cermin `fieldTypeRegistry[].valueType` di FE. */
export function valueTypeOf(fieldType: string): FieldValueType {
  switch (fieldType) {
    case 'numberField':
      return 'number';
    case 'checkboxField':
    case 'switchField':
      return 'boolean';
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return 'stringArray';
    case 'fileUploadField':
      return 'file';
    default:
      return 'string';
  }
}

/** Nama field ber-rule `unique` (dicek saat create/update/bulk). */
export function uniqueFieldNames(fields: QueryFieldMeta[]): string[] {
  return fields.filter((field) => field.rules.includes('unique')).map((field) => field.name);
}

function jsonText(name: string): string {
  return `record.data->>'$."${name}"'`;
}

function jsonNumber(name: string): string {
  return `CAST(record.data->>'$."${name}"' AS DECIMAL(30, 6))`;
}

/** Daftar field meta minimal dari `fields` definisi (JSON longgar). */
export function toQueryMeta(fields: Record<string, unknown>[]): QueryFieldMeta[] {
  return fields.map((field) => ({
    name: String(field.name ?? ''),
    type: String(field.type ?? 'textField'),
    filterable: (field.filterable as boolean | undefined) ?? true,
    filterCriteria: (field.filterCriteria as string | null | undefined) ?? null,
    rules: Array.isArray(field.rules) ? field.rules.map(String) : [],
  }));
}

export function buildRecordQuery(
  fields: QueryFieldMeta[],
  query: Record<string, string | undefined>,
  maxSize = 100,
): BuiltRecordQuery {
  const where: string[] = [];
  const params: Record<string, unknown> = {};
  let counter = 0;
  const param = (value: unknown): string => {
    const key = `p${counter}`;
    counter += 1;
    params[key] = value;
    return `:${key}`;
  };
  const byName = new Map(fields.map((field) => [field.name, field]));

  const search = query.search?.trim();
  if (search) {
    const like = param(`%${search.toLowerCase()}%`);
    const parts: string[] = [];
    for (const field of fields) {
      const valueType = valueTypeOf(field.type);
      if (valueType === 'string') {
        parts.push(`LOWER(${jsonText(field.name)}) LIKE ${like}`);
      } else if (valueType === 'stringArray') {
        parts.push(`LOWER(COALESCE(CAST(record.data->'$."${field.name}"' AS CHAR), '')) LIKE ${like}`);
      }
    }
    parts.push(`CAST(record.id AS CHAR) LIKE ${like}`);
    where.push(`(${parts.join(' OR ')})`);
  }

  if (query.status) {
    where.push(`record.status = ${param(query.status)}`);
  }

  for (const field of fields) {
    if (!field.filterable) continue;
    const criteria = field.filterCriteria;
    if (!criteria) continue;
    const raw = query[field.name];
    const present = (value: string | undefined): value is string =>
      value !== undefined && value !== '';
    switch (criteria) {
      case 'contains':
        if (present(raw)) {
          where.push(`LOWER(${jsonText(field.name)}) LIKE ${param(`%${raw.toLowerCase()}%`)}`);
        }
        break;
      case 'exact':
      case 'optionExact':
        if (present(raw)) where.push(`${jsonText(field.name)} = ${param(raw)}`);
        break;
      case 'booleanExact':
        if (present(raw)) where.push(`${jsonText(field.name)} = ${param(raw)}`);
        break;
      case 'numberExact':
      case 'numberMin':
      case 'numberMax': {
        if (!present(raw) || Number.isNaN(Number(raw))) break;
        const op = criteria === 'numberExact' ? '=' : criteria === 'numberMin' ? '>=' : '<=';
        where.push(`${jsonNumber(field.name)} ${op} ${param(Number(raw))}`);
        break;
      }
      case 'numberRange': {
        const min = query[`${field.name}Min`];
        const max = query[`${field.name}Max`];
        if (present(min) && !Number.isNaN(Number(min))) {
          where.push(`${jsonNumber(field.name)} >= ${param(Number(min))}`);
        }
        if (present(max) && !Number.isNaN(Number(max))) {
          where.push(`${jsonNumber(field.name)} <= ${param(Number(max))}`);
        }
        break;
      }
      case 'dateExact':
        if (present(raw)) where.push(`${jsonText(field.name)} = ${param(raw)}`);
        break;
      case 'dateRange': {
        if (!present(raw)) break;
        const [start, end] = raw.split(',');
        if (start && end) {
          where.push(`${jsonText(field.name)} BETWEEN ${param(start)} AND ${param(end)}`);
        }
        break;
      }
      case 'dateOverlap': {
        if (!present(raw)) break;
        const [from, to] = raw.split(',');
        if (from && to) {
          where.push(
            `SUBSTRING_INDEX(${jsonText(field.name)}, ',', 1) <= ${param(to)} AND ` +
              `SUBSTRING_INDEX(${jsonText(field.name)}, ',', -1) >= ${param(from)}`,
          );
        }
        break;
      }
      case 'optionAny': {
        if (!present(raw)) break;
        const selected = raw
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        if (selected.length > 0) {
          where.push(
            `JSON_OVERLAPS(record.data->'$."${field.name}"', CAST(${param(JSON.stringify(selected))} AS JSON))`,
          );
        }
        break;
      }
      default:
        break;
    }
  }

  const orderKey = query.order;
  const orderField = orderKey ? byName.get(orderKey) : undefined;
  let orderExpr: string;
  if (orderKey === 'id') orderExpr = 'record.id';
  else if (orderKey === 'status') orderExpr = 'record.status';
  else if (orderKey === 'created_date') orderExpr = 'record.createdAt';
  else if (orderField && valueTypeOf(orderField.type) === 'number') {
    orderExpr = jsonNumber(orderField.name);
  } else if (orderField) {
    orderExpr = jsonText(orderField.name);
  } else if (!orderKey && fields.length > 0) {
    // Tanpa `order`: default field pertama (meniru mock FE).
    orderExpr = jsonText(fields[0]?.name ?? 'id');
  } else {
    // Key tak dikenal: mock FE me-return 0 (urutan insersi) → id ASC.
    orderExpr = 'record.id';
  }
  const orderDir = query.sort === 'desc' ? 'DESC' : 'ASC';
  const page = Math.max(Math.floor(Number(query.page)) || 1, 1);
  const size = Math.min(Math.max(Math.floor(Number(query.size)) || 10, 1), maxSize);

  return { where, params, orderExpr, orderDir, page, size };
}
