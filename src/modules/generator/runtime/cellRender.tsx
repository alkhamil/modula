/** Render sel tabel per tipe field — dipakai list runtime + kolom FormArrayField. */
import type { ReactNode } from 'react';
import Badge from '../../../shared/components/ui/Badge';
import type { Column } from '../../../shared/components/ui/Table';
import {
  capitalize,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatNumber,
  stripHtml,
} from '../../../shared/utils';
import type { DynamicListItem } from './types';

export function columnRenderForType(
  fieldType: string,
  name: string,
): ((row: Record<string, unknown>) => ReactNode) | undefined {
  switch (fieldType) {
    case 'numberField':
    case 'currencyField':
      return (row) => formatNumber(Number(row[name] ?? 0));
    case 'dateField':
      return (row) => formatDate(String(row[name] ?? ''));
    case 'dateRangeField':
      return (row) => formatDateRange(String(row[name] ?? ''));
    case 'checkboxField':
    case 'switchField':
      return (row) => (row[name] ? 'Yes' : 'No');
    case 'selectField':
    case 'radioGroupField':
      return (row) => capitalize(String(row[name] ?? ''));
    case 'selectMultipleField':
    case 'checkboxGroupField':
      return (row) => ((row[name] as string[] | null) ?? []).join(', ');
    case 'passwordField':
      return () => '••••••';
    case 'colorField':
      return (row) =>
        row[name] ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-4 w-4 rounded border border-border"
              style={{ backgroundColor: String(row[name]) }}
            />
            <span>{String(row[name])}</span>
          </span>
        ) : (
          '-'
        );
    case 'editorField':
      return (row) => stripHtml(String(row[name] ?? '')) || '-';
    case 'formArrayField':
      return (row) => {
        const rows = row[name];
        const count = Array.isArray(rows) ? rows.length : 0;
        return count > 0 ? `${count} baris` : '-';
      };
    default:
      return undefined;
  }
}

/** Definisi kolom sistem tabel (header label + render sel + class). */
export function systemTableColumn(
  key: string,
): Pick<Column<DynamicListItem>, 'key' | 'header' | 'render' | 'sortable' | 'className'> | null {
  switch (key) {
    case 'created_by':
      return { key, header: 'Created By' };
    case 'created_date':
      return {
        key,
        header: 'Created Date',
        render: (row) => formatDateTime(String(row.created_date ?? '')),
      };
    case 'status':
      return {
        key,
        header: 'Status',
        sortable: false,
        className: 'w-32',
        render: (row) => (
          <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
            {capitalize(row.status)}
          </Badge>
        ),
      };
    default:
      return null;
  }
}
