import type { ComponentDoc } from '../types';
import { TableDemo } from './tableDemos';

export const tableDoc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  category: 'data',
  importStatement: "import { Table } from 'shared/components/ui';",
  component: TableDemo,
  codeName: 'Table',
  codeExtra: ['columns={columns}', 'data={data}', 'rowKey={(row) => row.id}'],
  defaults: { headerStyle: 'white' },
  baseProps: { headerStyle: 'white' },
  controls: [
    { prop: 'headerStyle', kind: 'select', options: ['white', 'gray'] },
    { prop: 'dense', kind: 'boolean' },
    { prop: 'showRowNumber', kind: 'boolean' },
    { prop: 'loading', kind: 'boolean' },
    { prop: 'highlightFirst', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Table styles (mode)', values: 'white, gray', prop: 'headerStyle' },
    { id: 'rowStates', figma: 'Table row states', values: 'default, hover, selected, loading', prop: 'isRowHighlighted · loading' },
    { id: 'header', figma: 'Table header (sortable)', values: 'default, disabled', prop: 'columns[].sortable' },
    { id: 'cell', figma: 'Table cell (padding 12/16)', values: 'token Size', prop: 'dense' },
  ],
  examples: [
    {
      id: 'styles',
      variants: [
        { label: 'white', props: { headerStyle: 'white' } },
        { label: 'gray', props: { headerStyle: 'gray' } },
      ],
    },
  ],
  props: [
    { id: 'columns', name: 'columns · data · rowKey', type: 'Column<T>[] · T[] · (item) => key' },
    { id: 'paging', name: 'totalRecords · page · pageSize', type: 'number' },
    { id: 'handlers', name: 'onPageChange · onPageSizeChange', type: 'function' },
    { id: 'sort', name: 'sortKey · sortDir · onSort', type: 'string · asc | desc · function' },
    { id: 'headerStyle', name: 'headerStyle', type: "'white' | 'gray'", default: "'white'" },
    { id: 'dense', name: 'dense', type: 'boolean', default: 'false' },
    { id: 'showRowNumber', name: 'showRowNumber', type: 'boolean', default: 'false' },
    { id: 'renderAction', name: 'renderAction · actionPosition', type: 'function · left | right' },
    { id: 'highlight', name: 'isRowHighlighted · highlightRowCount', type: 'function · number' },
    { id: 'state', name: 'loading · error · isEmptyState', type: 'boolean · string' },
    { id: 'sticky', name: 'stickyHeader · stickyAction', type: 'boolean' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-bg-subtle',
    '--wds-bg-brand-subtle',
    '--wds-stroke-subtle',
    '--wds-text-primary',
    '--wds-text-secondary',
    '--wds-sz-table-stroke',
    '--wds-sz-table-header-cell-root-padding-top',
    '--wds-sz-table-cell-root-padding-top',
    '--wds-sz-table-cell-root-padding-right',
  ].map((name) => ({ name })),
};
