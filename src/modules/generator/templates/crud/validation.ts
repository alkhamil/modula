import type { TemplateContext, FieldModel } from '../../engine/context';
import { splitRule } from '../../parser';
import { buildRulesObject, needsEmoticonUtils } from '../../engine/validationGenerator';

export function validationTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const needUtils = needsEmoticonUtils(fields);

  const rules = fields
    .map(
      (f) =>
        `export const ${f.rulesVar}: RegisterOptions<FormValues, '${f.name}'> = ${buildRulesObject(f)};`,
    )
    .join('\n\n');

  return `import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from '../hooks';
${needUtils ? `import { hasEmoticon, WITHOUT_EMOTICON_MESSAGE } from '${names.sharedPrefix}shared/utils';\n` : ''}
${rules}
`;
}

/** Contoh nilai bulk per field (baris contoh template). */
function bulkExampleValue(field: FieldModel): string | number {
  const options = field.config.options ?? [];
  switch (field.config.type) {
    case 'numberField':
    case 'currencyField':
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
      return options[0]?.value ?? `${field.name.toUpperCase()}_1`;
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return options.length >= 2
        ? `${options[0]?.value},${options[1]?.value}`
        : (options[0]?.value ?? `${field.name.toUpperCase()}_1,${field.name.toUpperCase()}_2`);
    default:
      return `Contoh ${field.label}`;
  }
}

type BulkKind = 'string' | 'number' | 'date' | 'dateRange' | 'multi' | 'bool';

function bulkKind(field: FieldModel): BulkKind {
  switch (field.config.type) {
    case 'numberField':
    case 'currencyField':
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

function bulkStaticValues(field: FieldModel): string[] | null {
  if (field.config.source !== 'mockStatic') return null;
  const options = field.config.options ?? [];
  return options.length > 0 ? options.map((o) => o.value) : null;
}

/** Blok parse + cek rules satu field dalam validator baris bulk. */
function bulkFieldChecks(field: FieldModel): string {
  const { label } = field;
  const kind = bulkKind(field);
  const header = JSON.stringify(label);
  const fail = (message: string): string =>
    `errors.push({ field: ${header}, message: ${JSON.stringify(message)} });`;
  const lines: string[] = [];
  const v = `${field.name}Value`;
  const rules = field.config.rules.map((rule) => splitRule(rule));
  const has = (name: string): boolean => rules.some((r) => r.name === name);
  const argOf = (name: string): string | undefined => rules.find((r) => r.name === name)?.arg;

  if (kind === 'number') {
    const raw = `${field.name}Raw`;
    lines.push(`const ${raw} = String(row[${header}] ?? '').trim();`);
    lines.push(`const ${v} = ${raw} === '' ? NaN : Number(${raw});`);
    if (has('required')) {
      lines.push(`if (${raw} === '') ${fail(`${label} wajib diisi.`)}`);
      lines.push(`else if (Number.isNaN(${v})) ${fail(`${label} harus angka.`)}`);
    } else {
      lines.push(`if (${raw} === '' || Number.isNaN(${v})) ${fail(`${label} harus angka.`)}`);
    }
  } else if (kind === 'date') {
    lines.push(`const ${v} = String(row[${header}] ?? '').trim();`);
    lines.push(
      `if (${v} !== '' && !/^\\d{4}-\\d{2}-\\d{2}$/.test(${v})) ${fail(`${label} formatnya YYYY-MM-DD.`)}`,
    );
    if (has('required')) lines.push(`if (!${v}) ${fail(`${label} wajib diisi.`)}`);
  } else if (kind === 'dateRange') {
    const startHeader = JSON.stringify(`${label} Start`);
    const endHeader = JSON.stringify(`${label} End`);
    const s = `${field.name}Start`;
    const e = `${field.name}End`;
    lines.push(`const ${s} = String(row[${startHeader}] ?? '').trim();`);
    lines.push(`const ${e} = String(row[${endHeader}] ?? '').trim();`);
    lines.push(
      `if (${s} !== '' && !/^\\d{4}-\\d{2}-\\d{2}$/.test(${s})) ${fail(`${label} Start formatnya YYYY-MM-DD.`)}`,
    );
    lines.push(
      `if (${e} !== '' && !/^\\d{4}-\\d{2}-\\d{2}$/.test(${e})) ${fail(`${label} End formatnya YYYY-MM-DD.`)}`,
    );
    if (has('required')) {
      lines.push(`if (!${s} || !${e}) ${fail(`${label} wajib diisi awal dan akhir.`)}`);
    }
    lines.push(`const ${v} = ${s} || ${e} ? ${s} + ',' + ${e} : '';`);
  } else if (kind === 'multi') {
    lines.push(
      `const ${v} = String(row[${header}] ?? '').split(',').map((item) => item.trim()).filter(Boolean);`,
    );
    if (has('required')) {
      lines.push(`if (${v}.length === 0) ${fail(`${label} wajib diisi.`)}`);
    }
  } else if (kind === 'bool') {
    const raw = `${field.name}Raw`;
    lines.push(`const ${raw} = String(row[${header}] ?? '').trim().toLowerCase();`);
    lines.push(
      `const ${v} = ['ya', 'true', '1'].includes(${raw}) ? true : ['tidak', 'false', '0', ''].includes(${raw}) ? false : null;`,
    );
    lines.push(`if (${v} === null) ${fail(`${label} diisi Ya atau Tidak.`)}`);
    if (has('required')) lines.push(`if (${v} !== true) ${fail(`${label} wajib diisi.`)}`);
  } else {
    lines.push(`const ${v} = String(row[${header}] ?? '').trim();`);
    if (has('required')) lines.push(`if (!${v}) ${fail(`${label} wajib diisi.`)}`);
  }

  const min = argOf('min');
  const max = argOf('max');
  const minLength = argOf('minLength');
  const maxLength = argOf('maxLength');
  if (kind === 'number') {
    if (min !== undefined) {
      lines.push(
        `if (!Number.isNaN(${v}) && ${v} < ${min}) ${fail(`${label} minimal ${min}.`)}`,
      );
    }
    if (max !== undefined) {
      lines.push(
        `if (!Number.isNaN(${v}) && ${v} > ${max}) ${fail(`${label} maksimal ${max}.`)}`,
      );
    }
  } else if (kind === 'multi') {
    if (min !== undefined) {
      lines.push(`if (${v}.length < ${min}) ${fail(`${label} minimal ${min} item.`)}`);
    }
    if (max !== undefined) {
      lines.push(`if (${v}.length > ${max}) ${fail(`${label} maksimal ${max} item.`)}`);
    }
  } else if (kind !== 'bool' && kind !== 'dateRange') {
    const target = v;
    if (min !== undefined) {
      lines.push(
        `if (${target} !== '' && ${target}.length < ${min}) ${fail(`${label} minimal ${min} karakter.`)}`,
      );
    }
    if (max !== undefined) {
      lines.push(
        `if (${target} !== '' && ${target}.length > ${max}) ${fail(`${label} maksimal ${max} karakter.`)}`,
      );
    }
  }
  if ((kind === 'string' || kind === 'date' || kind === 'number') && minLength !== undefined) {
    const target = kind === 'number' ? `${field.name}Raw` : v;
    lines.push(
      `if (${target} !== '' && ${target}.length < ${minLength}) ${fail(`${label} minimal ${minLength} karakter.`)}`,
    );
  }
  if ((kind === 'string' || kind === 'date' || kind === 'number') && maxLength !== undefined) {
    const target = kind === 'number' ? `${field.name}Raw` : v;
    lines.push(
      `if (${target} !== '' && ${target}.length > ${maxLength}) ${fail(`${label} maksimal ${maxLength} karakter.`)}`,
    );
  }
  if (has('email') && (kind === 'string' || kind === 'date' || kind === 'number')) {
    const target = kind === 'number' ? `${field.name}Raw` : v;
    lines.push(
      `if (${target} !== '' && !EMAIL_RE.test(${target})) ${fail(`${label} format email tidak valid.`)}`,
    );
  }
  const regexArg = argOf('regex');
  if (regexArg !== undefined && (kind === 'string' || kind === 'date' || kind === 'number')) {
    const target = kind === 'number' ? `${field.name}Raw` : v;
    lines.push(
      `if (${target} !== '' && !new RegExp(${JSON.stringify(regexArg)}).test(${target})) ${fail(`${label} format tidak valid.`)}`,
    );
  }
  if (has('withoutemoticon') && kind === 'string') {
    lines.push(`if (${v} !== '' && hasEmoticon(${v})) ${fail(`${label} tidak boleh mengandung emoticon.`)}`);
  }
  const staticValues = bulkStaticValues(field);
  if (staticValues && (kind === 'string' || kind === 'multi')) {
    if (kind === 'multi') {
      lines.push(
        `for (const item of ${v}) { if (!${field.name}Values.includes(item)) errors.push({ field: ${header}, message: ${JSON.stringify(`${label} berisi nilai tidak dikenal: `)} + item }); }`,
      );
    } else {
      lines.push(
        `if (${v} !== '' && !${field.name}Values.includes(${v})) ${fail(`${label} harus salah satu: ${staticValues.join(', ')}.`)}`,
      );
    }
  }
  if (has('unique') && kind !== 'multi' && kind !== 'bool') {
    if (kind === 'number') {
      lines.push(
        `if (!Number.isNaN(${v}) && isTaken('${field.name}', String(${v}))) ${fail(`${label} sudah dipakai.`)}`,
      );
    } else if (kind === 'dateRange') {
      lines.push(
        `if (${v} !== '' && isTaken('${field.name}', ${v})) ${fail(`${label} sudah dipakai.`)}`,
      );
    } else {
      lines.push(
        `if (${v} !== '' && isTaken('${field.name}', ${v})) ${fail(`${label} sudah dipakai.`)}`,
      );
    }
  }

  return lines.map((line) => `  ${line}`).join('\n');
}

export function bulkValidationTemplate(ctx: TemplateContext): string {
  const { names, fields } = ctx;
  const bulkFields = fields.filter(
    (f) => f.config.type !== 'fileUploadField' && f.config.type !== 'formArrayField',
  );
  const needUtils = needsEmoticonUtils(bulkFields);
  const needEmailRe = bulkFields.some((f) => f.config.rules.includes('email'));
  const constName = names.entity.toUpperCase();

  const headers: string[] = [];
  const examples: (string | number)[] = [];
  for (const field of bulkFields) {
    if (field.config.type === 'dateRangeField') {
      headers.push(`${field.label} Start`, `${field.label} End`);
      examples.push('2024-01-01', '2024-01-31');
    } else {
      headers.push(field.label);
      examples.push(bulkExampleValue(field));
    }
  }
  const valuesConsts = bulkFields
    .map((f) => {
      const values = bulkStaticValues(f);
      return values ? `const ${f.name}Values = ${JSON.stringify(values)};` : '';
    })
    .filter(Boolean)
    .join('\n');

  const checks = bulkFields.map((f) => bulkFieldChecks(f)).join('\n');
  // Samakan kondisi pemakaian isTaken di bulkFieldChecks agar param tak unused.
  const hasUniqueCheck = bulkFields.some(
    (f) =>
      f.config.rules.map((rule) => splitRule(rule)).some((r) => r.name === 'unique') &&
      bulkKind(f) !== 'multi' &&
      bulkKind(f) !== 'bool',
  );
  const payloadLines = fields
    .map((f) => {
      if (f.config.type === 'fileUploadField') return `    ${f.name}: '',`;
      if (f.config.type === 'formArrayField') return `    ${f.name}: [],`;
      if (f.valueType === 'boolean') return `    ${f.name}: ${f.name}Value ?? false,`;
      return `    ${f.name}: ${f.name}Value,`;
    })
    .join('\n');

  return `import type { ${names.payload} } from '../types';
${needUtils ? `import { hasEmoticon } from '${names.sharedPrefix}shared/utils';\n` : ''}
export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: ${names.payload} | null;
  errors: BulkFieldError[];
}

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_${constName}_HEADERS = ${JSON.stringify(headers)};

/** Contoh baris pada template bulk upload. */
export const BULK_${constName}_EXAMPLE = ${JSON.stringify(examples)};
${needEmailRe ? '\nconst EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n' : ''}${valuesConsts ? `\n${valuesConsts}\n` : ''}
/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via \`isTaken\`.
 */
export function validateBulk${names.entity}Row(
  row: Record<string, unknown>,
  ${hasUniqueCheck ? 'isTaken' : '_isTaken'}: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
${checks}
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
${payloadLines}
    },
    errors,
  };
}
`;
}
