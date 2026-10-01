/**
 * Engine bulk upload generik — cermin `bulkValidationTemplate` FE.
 * Murni (tanpa I/O) kecuali callback `isTaken` untuk cek unique.
 */

export interface BulkFieldMeta {
  name: string;
  label: string;
  type: string;
  rules: string[];
  /** Values opsi static (source mockStatic) atau null. */
  staticValues: string[] | null;
}

export interface BulkFieldError {
  /** Label kolom; kosong bila error sebaris file. */
  field?: string;
  message: string;
}

export interface BulkRowValidation {
  payload: Record<string, unknown> | null;
  errors: BulkFieldError[];
}

export interface BulkUploadResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: (BulkFieldError & { row: number })[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMOTICON_RE = /\p{Extended_Pictographic}/u;

type BulkKind = 'string' | 'number' | 'date' | 'dateRange' | 'multi' | 'bool';

function bulkKind(type: string): BulkKind {
  switch (type) {
    case 'numberField':
      return 'number';
    case 'dateField':
      return 'date';
    case 'dateRangeField':
      return 'dateRange';
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return 'multi';
    case 'checkboxField':
    case 'switchField':
      return 'bool';
    default:
      return 'string';
  }
}

function splitRule(rule: string): { name: string; arg?: string } {
  const index = rule.indexOf(':');
  if (index === -1) return { name: rule };
  return { name: rule.slice(0, index), arg: rule.slice(index + 1) };
}

/** Field non-file saja yang masuk template bulk (meniru generator FE). */
export function bulkableFields<T extends { type: string }>(fields: T[]): T[] {
  return fields.filter((field) => field.type !== 'fileUploadField');
}

/** Header template: label per field; dateRange → `<label> Start|End`. */
export function bulkHeaders(fields: Record<string, unknown>[]): string[] {
  const headers: string[] = [];
  for (const field of bulkableFields(toBulkFields(fields))) {
    if (field.type === 'dateRangeField') {
      headers.push(`${field.label} Start`, `${field.label} End`);
    } else {
      headers.push(field.label);
    }
  }
  return headers;
}

/** Contoh nilai per field untuk baris contoh template (meniru generator FE). */
export function bulkExampleValue(field: BulkFieldMeta): string | number {
  switch (field.type) {
    case 'numberField':
      return 100;
    case 'dateField':
      return '2024-01-15';
    case 'checkboxField':
    case 'switchField':
      return 'Ya';
    case 'passwordField':
      return 'secret123';
    case 'selectField':
    case 'radioGroupField':
      return field.staticValues?.[0] ?? `${field.name.toUpperCase()}_1`;
    case 'selectMultipleField':
    case 'checkboxGroupField': {
      const values = field.staticValues ?? [];
      return values.length >= 2
        ? `${values[0]},${values[1]}`
        : (values[0] ?? `${field.name.toUpperCase()}_1,${field.name.toUpperCase()}_2`);
    }
    default:
      return `Contoh ${field.label}`;
  }
}

export function bulkExampleRow(fields: Record<string, unknown>[]): (string | number)[] {
  const row: (string | number)[] = [];
  for (const field of bulkableFields(toBulkFields(fields))) {
    if (field.type === 'dateRangeField') {
      row.push('2024-01-01', '2024-01-31');
    } else {
      row.push(bulkExampleValue(field));
    }
  }
  return row;
}

/** Header kolom export: label semua field + Status + Created Date. */
export function exportHeaders(fields: { label: string }[]): string[] {
  return [...fields.map((field) => field.label), 'Status', 'Created Date'];
}

/** Nilai sel export satu field (boolean → Ya/Tidak? FE: Yes/No; array → join). */
export function exportCellValue(
  type: string,
  value: unknown,
): string | number | boolean | null {
  const kind = bulkKind(type);
  if (kind === 'bool') return value ? 'Yes' : 'No';
  if (kind === 'multi') return Array.isArray(value) ? value.join(', ') : '';
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
}

/** Konversi `fields` definisi (JSON) → meta bulk (export untuk service/seed). */
export function toBulkFields(fields: Record<string, unknown>[]): BulkFieldMeta[] {
  return fields.map((field) => {
    const options = field.options;
    const staticValues =
      field.source === 'mockStatic' && Array.isArray(options)
        ? (options as { value?: unknown }[])
            .map((opt) => opt.value)
            .filter((value): value is string => typeof value === 'string')
        : null;
    return {
      name: String(field.name ?? ''),
      label: String(field.label ?? ''),
      type: String(field.type ?? 'textField'),
      rules: Array.isArray(field.rules) ? field.rules.map(String) : [],
      staticValues: staticValues && staticValues.length > 0 ? staticValues : null,
    };
  });
}

/**
 * Validasi satu baris bulk (key = header label).
 * Pesan + perilaku meniru 1:1 validator bulk hasil generate FE.
 */
export function validateBulkRow(
  fields: Record<string, unknown>[],
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const payload: Record<string, unknown> = {};
  const fail = (field: string, message: string): void => {
    errors.push({ field, message });
  };

  for (const field of toBulkFields(fields)) {
    if (field.type === 'fileUploadField') {
      payload[field.name] = '';
      continue;
    }
    const { label } = field;
    const kind = bulkKind(field.type);
    const rules = field.rules.map(splitRule);
    const has = (name: string): boolean => rules.some((rule) => rule.name === name);
    const argOf = (name: string): string | undefined =>
      rules.find((rule) => rule.name === name)?.arg;

    if (kind === 'number') {
      const raw = String(row[label] ?? '').trim();
      const value = raw === '' ? NaN : Number(raw);
      if (has('required')) {
        if (raw === '') fail(label, `${label} wajib diisi.`);
        else if (Number.isNaN(value)) fail(label, `${label} harus angka.`);
      } else if (raw === '' || Number.isNaN(value)) {
        fail(label, `${label} harus angka.`);
      }
      const min = argOf('min');
      const max = argOf('max');
      if (min !== undefined && !Number.isNaN(value) && value < Number(min)) {
        fail(label, `${label} minimal ${min}.`);
      }
      if (max !== undefined && !Number.isNaN(value) && value > Number(max)) {
        fail(label, `${label} maksimal ${max}.`);
      }
      const minLength = argOf('minLength');
      const maxLength = argOf('maxLength');
      if (minLength !== undefined && raw !== '' && raw.length < Number(minLength)) {
        fail(label, `${label} minimal ${minLength} karakter.`);
      }
      if (maxLength !== undefined && raw !== '' && raw.length > Number(maxLength)) {
        fail(label, `${label} maksimal ${maxLength} karakter.`);
      }
      if (has('email') && raw !== '' && !EMAIL_RE.test(raw)) {
        fail(label, `${label} format email tidak valid.`);
      }
      const regexArg = argOf('regex');
      if (regexArg !== undefined && raw !== '' && !new RegExp(regexArg).test(raw)) {
        fail(label, `${label} format tidak valid.`);
      }
      if (has('unique') && !Number.isNaN(value) && isTaken(field.name, String(value))) {
        fail(label, `${label} sudah dipakai.`);
      }
      payload[field.name] = value;
      continue;
    }

    if (kind === 'date') {
      const value = String(row[label] ?? '').trim();
      if (value !== '' && !DATE_RE.test(value)) fail(label, `${label} formatnya YYYY-MM-DD.`);
      if (has('required') && !value) fail(label, `${label} wajib diisi.`);
      applyStringRules(field, value, fail, {
        email: true,
        regex: true,
        lengths: true,
        minMaxLength: true,
      });
      if (has('unique') && value !== '' && isTaken(field.name, value)) {
        fail(label, `${label} sudah dipakai.`);
      }
      payload[field.name] = value;
      continue;
    }

    if (kind === 'dateRange') {
      const start = String(row[`${label} Start`] ?? '').trim();
      const end = String(row[`${label} End`] ?? '').trim();
      if (start !== '' && !DATE_RE.test(start)) {
        fail(label, `${label} Start formatnya YYYY-MM-DD.`);
      }
      if (end !== '' && !DATE_RE.test(end)) fail(label, `${label} End formatnya YYYY-MM-DD.`);
      if (has('required') && (!start || !end)) {
        fail(label, `${label} wajib diisi awal dan akhir.`);
      }
      const value = start || end ? `${start},${end}` : '';
      if (has('unique') && value !== '' && isTaken(field.name, value)) {
        fail(label, `${label} sudah dipakai.`);
      }
      payload[field.name] = value;
      continue;
    }

    if (kind === 'multi') {
      const value = String(row[label] ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      if (has('required') && value.length === 0) fail(label, `${label} wajib diisi.`);
      const min = argOf('min');
      const max = argOf('max');
      if (min !== undefined && value.length < Number(min)) {
        fail(label, `${label} minimal ${min} item.`);
      }
      if (max !== undefined && value.length > Number(max)) {
        fail(label, `${label} maksimal ${max} item.`);
      }
      if (field.staticValues) {
        for (const item of value) {
          if (!field.staticValues.includes(item)) {
            fail(label, `${label} berisi nilai tidak dikenal: ${item}`);
          }
        }
      }
      payload[field.name] = value;
      continue;
    }

    if (kind === 'bool') {
      const raw = String(row[label] ?? '').trim().toLowerCase();
      const value = ['ya', 'true', '1'].includes(raw)
        ? true
        : ['tidak', 'false', '0', ''].includes(raw)
          ? false
          : null;
      if (value === null) fail(label, `${label} diisi Ya atau Tidak.`);
      if (has('required') && value !== true) fail(label, `${label} wajib diisi.`);
      payload[field.name] = value ?? false;
      continue;
    }

    const value = String(row[label] ?? '').trim();
    if (has('required') && !value) fail(label, `${label} wajib diisi.`);
    applyStringRules(field, value, fail, {
      email: true,
      regex: true,
      lengths: true,
      emoticon: true,
      minMaxLength: true,
    });
    if (field.staticValues && value !== '' && !field.staticValues.includes(value)) {
      fail(label, `${label} harus salah satu: ${field.staticValues.join(', ')}.`);
    }
    if (has('unique') && value !== '' && isTaken(field.name, value)) {
      fail(label, `${label} sudah dipakai.`);
    }
    payload[field.name] = value;
  }

  if (errors.length > 0) return { payload: null, errors };
  return { payload, errors };
}

function applyStringRules(
  field: BulkFieldMeta,
  value: string,
  fail: (field: string, message: string) => void,
  opts: { email?: boolean; regex?: boolean; lengths?: boolean; emoticon?: boolean; minMaxLength?: boolean },
): void {
  const rules = field.rules.map(splitRule);
  const has = (name: string): boolean => rules.some((rule) => rule.name === name);
  const argOf = (name: string): string | undefined =>
    rules.find((rule) => rule.name === name)?.arg;
  const { label } = field;
  if (opts.minMaxLength) {
    const min = argOf('min');
    const max = argOf('max');
    if (min !== undefined && value !== '' && value.length < Number(min)) {
      fail(label, `${label} minimal ${min} karakter.`);
    }
    if (max !== undefined && value !== '' && value.length > Number(max)) {
      fail(label, `${label} maksimal ${max} karakter.`);
    }
  }
  if (opts.lengths) {
    const minLength = argOf('minLength');
    const maxLength = argOf('maxLength');
    if (minLength !== undefined && value !== '' && value.length < Number(minLength)) {
      fail(label, `${label} minimal ${minLength} karakter.`);
    }
    if (maxLength !== undefined && value !== '' && value.length > Number(maxLength)) {
      fail(label, `${label} maksimal ${maxLength} karakter.`);
    }
  }
  if (opts.email && has('email') && value !== '' && !EMAIL_RE.test(value)) {
    fail(label, `${label} format email tidak valid.`);
  }
  const regexArg = argOf('regex');
  if (opts.regex && regexArg !== undefined && value !== '' && !new RegExp(regexArg).test(value)) {
    fail(label, `${label} format tidak valid.`);
  }
  if (opts.emoticon && has('withoutemoticon') && value !== '' && EMOTICON_RE.test(value)) {
    fail(label, `${label} tidak boleh mengandung emoticon.`);
  }
}
