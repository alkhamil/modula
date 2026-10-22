import type { ComponentDoc } from '../types';
import { PaginationDemo } from './tableDemos';

export const paginationDoc: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  category: 'data',
  importStatement: "import { Pagination } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9930-246',
  component: PaginationDemo,
  codeName: 'Pagination',
  codeExtra: ['page={page}', 'totalPages={12}', 'onPageChange={setPage}'],
  defaults: { appearance: 'square', showRowsPerPage: true },
  baseProps: { appearance: 'square', showRowsPerPage: true },
  controls: [
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { prop: 'appearance', kind: 'select', options: ['square', 'round'] },
    { prop: 'showFirstLast', kind: 'boolean' },
    { prop: 'showLabels', kind: 'boolean' },
    { prop: 'showRowsPerPage', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'styles', figma: 'Pagination styles (mode)', values: 'square, round', prop: 'appearance' },
    { id: 'firstLast', figma: 'First / last (visible)', values: 'boolean', prop: 'showFirstLast' },
    { id: 'labels', figma: 'Labels (visible)', values: 'boolean', prop: 'showLabels' },
    { id: 'rows', figma: 'Rows per page', values: 'select', prop: 'showRowsPerPage · pageSize' },
  ],
  examples: [
    {
      id: 'styles',
      variants: [
        { label: 'square', props: { appearance: 'square', showRowsPerPage: false } },
        { label: 'round', props: { appearance: 'round', showRowsPerPage: false } },
      ],
    },
  ],
  props: [
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'page', name: 'page · totalPages', type: 'number' },
    { id: 'onPageChange', name: 'onPageChange', type: '(page: number) => void' },
    { id: 'pageSize', name: 'pageSize · onPageSizeChange', type: 'number · (size: number) => void' },
    { id: 'appearance', name: 'appearance', type: "'square' | 'round'", default: "'square'" },
    { id: 'showFirstLast', name: 'showFirstLast', type: 'boolean', default: 'false' },
    { id: 'showLabels', name: 'showLabels', type: 'boolean', default: 'false' },
    { id: 'showRowsPerPage', name: 'showRowsPerPage', type: 'boolean', default: 'true' },
    { id: 'pageSizeOptions', name: 'pageSizeOptions', type: 'number[]', default: '[10, 20, 50, 100]' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-brand',
    '--wds-text-inverse',
    '--wds-text-secondary',
    '--wds-text-tertiary',
    '--wds-icons-secondary',
    '--wds-radius-8',
    '--wds-sz-pagination-button-size',
    '--wds-sz-pagination-gap',
    '--wds-sz-pagination-padding-button',
    '--wds-sz-pagination-rows-gap',
  ].map((name) => ({ name })),
};
