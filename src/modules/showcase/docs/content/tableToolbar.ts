import type { ComponentDoc } from '../types';
import { TableToolbarDemo } from './tableDemos';

export const tableToolbarDoc: ComponentDoc = {
  slug: 'table-toolbar',
  name: 'TableToolbar',
  category: 'data',
  importStatement: "import { TableToolbar } from 'shared/components/ui';",
  component: TableToolbarDemo,
  codeName: 'TableToolbar',
  codeExtra: [
    'searchValue={search}',
    'onSearchChange={setSearch}',
    'filterFields={filterFields}',
    'filterValues={filters}',
    'onApply={setFilters}',
    'onReset={() => setFilters({})}',
  ],
  defaults: { withFilterButton: true },
  baseProps: { searchPlaceholder: 'Search', withFilterButton: true },
  controls: [
    { prop: 'searchPlaceholder', kind: 'text' },
    { prop: 'filterTitle', kind: 'text' },
    { prop: 'withFilterButton', kind: 'boolean' },
    { prop: 'filtered', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'states', figma: 'Table Toolbar states (mode)', values: 'default, filtered', prop: 'filterValues' },
    { id: 'search', figma: 'Search', values: 'search field', prop: 'searchValue · onSearchChange' },
    { id: 'filter', figma: 'Filter button + panel', values: 'drawer', prop: 'filterFields · onApply · onReset' },
  ],
  examples: [
    {
      id: 'states',
      variants: [
        { label: 'default', props: { filtered: false } },
        { label: 'filtered', props: { filtered: true } },
      ],
    },
  ],
  props: [
    { id: 'search', name: 'searchValue · onSearchChange', type: 'string · (value) => void' },
    { id: 'searchPlaceholder', name: 'searchPlaceholder', type: 'string' },
    { id: 'filterFields', name: 'filterFields', type: 'FilterField[]' },
    { id: 'filterValues', name: 'filterValues · defaultValues', type: 'Record<string, string>' },
    { id: 'onApply', name: 'onApply · onReset', type: 'function' },
    { id: 'filterTitle', name: 'filterTitle', type: 'string' },
    { id: 'withFilterButton', name: 'withFilterButton', type: 'boolean', default: 'true' },
    { id: 'debounce', name: 'debounceMs · searchParamName', type: 'number · string', default: '300' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-stroke-subtle',
    '--wds-sz-table-toolbar-padding-top',
    '--wds-sz-table-toolbar-padding-left',
    '--wds-sz-table-toolbar-root-gap',
    '--wds-sz-table-stroke',
  ].map((name) => ({ name })),
};
