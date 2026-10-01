/** Helper Excel (.xlsx) server-side — cermin `shared/utils/excel.ts` FE. */
import * as XLSX from 'xlsx';

export const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type ExcelCell = string | number | boolean | null;

export interface WorkbookRows {
  headers: string[];
  rows: Record<string, unknown>[];
}

/** Baca sheet pertama workbook menjadi headers + rows (key = header). */
export function readWorkbookRows(data: Buffer): WorkbookRows {
  const workbook = XLSX.read(data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { headers: [], rows: [] };
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return { headers: [], rows: [] };
  const matrix = XLSX.utils.sheet_to_json<ExcelCell[]>(sheet, {
    header: 1,
    defval: '',
    raw: true,
  });
  if (matrix.length === 0) return { headers: [], rows: [] };
  const headers = (matrix[0] ?? []).map((cell) => String(cell ?? '').trim());
  const rows = matrix.slice(1).map((cells) => {
    const row: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });
    return row;
  });
  return { headers, rows };
}

/** Susun workbook satu sheet dari headers + matriks rows. */
export function buildWorkbook(headers: string[], rows: ExcelCell[][]): Buffer {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  sheet['!cols'] = headers.map((header, index) => ({
    wch: Math.max(header.length, ...rows.map((row) => String(row[index] ?? '').length), 10),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}
