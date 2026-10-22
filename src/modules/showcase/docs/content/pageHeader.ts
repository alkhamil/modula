import type { ComponentDoc } from '../types';
import { PageHeaderDemo } from './layoutDemos';

export const pageHeaderDoc: ComponentDoc = {
  slug: 'page-header',
  name: 'PageHeader',
  category: 'layout',
  importStatement: "import { PageHeader } from 'shared/components/layout';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=11287-681',
  component: PageHeaderDemo,
  codeName: 'PageHeader',
  codeExtra: ["breadcrumb={[{ label: 'Home', path: '/' }, { label: 'Users' }]}"],
  baseProps: { title: 'Users' },
  controls: [{ prop: 'title', kind: 'text' }],
  figmaMapping: [
    { id: 'title', figma: 'Title (TEXT)', values: 'free text', prop: 'title' },
    { id: 'breadcrumb', figma: 'Breadcrumb', values: 'items', prop: 'breadcrumb' },
    { id: 'slot', figma: 'Actions · profile (slots)', values: 'nodes', prop: 'actions · children' },
  ],
  examples: [],
  props: [
    { id: 'title', name: 'title', type: 'string' },
    { id: 'breadcrumb', name: 'breadcrumb', type: 'BreadcrumbItem[]' },
    { id: 'actions', name: 'actions · children', type: 'ReactNode' },
    { id: 'onMenuToggle', name: 'onMenuToggle', type: '() => void' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-text-primary',
    '--wds-text-tertiary',
    '--wds-text-link',
    '--wds-sz-header-padding-top',
    '--wds-sz-header-padding-left',
    '--wds-sz-header-gap',
    '--wds-sz-header-title-gap',
  ].map((name) => ({ name })),
};
