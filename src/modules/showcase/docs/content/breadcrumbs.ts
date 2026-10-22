import type { ComponentDoc } from '../types';
import { BreadcrumbsDemo } from './layoutDemos';

export const breadcrumbsDoc: ComponentDoc = {
  slug: 'breadcrumbs',
  name: 'Breadcrumbs',
  category: 'navigation',
  importStatement: "import { Breadcrumbs } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=9928-8401',
  component: BreadcrumbsDemo,
  codeName: 'Breadcrumbs',
  codeExtra: ["items={[{ label: 'Home', to: '/' }, { label: 'Users', to: '/users' }, { label: 'Detail' }]}"],
  baseProps: {},
  controls: [
    { prop: 'size', kind: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  ],
  figmaMapping: [
    { id: 'states', figma: 'Breadcrumbs states', values: 'default, hover, pressed, active, disabled', prop: 'items[].to · disabled' },
    { id: 'chevron', figma: 'Chevron separator', values: 'icon', prop: '— (CSS)' },
  ],
  examples: [],
  props: [
    { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
    { id: 'items', name: 'items', type: 'BreadcrumbsItem[] ({ label, to?, icon?, disabled? })' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-text-tertiary',
    '--wds-text-brand',
    '--wds-text-brand-pressed',
    '--wds-text-disabled',
    '--wds-icons-tertiary',
    '--wds-sz-breadcrumbs-gap',
  ].map((name) => ({ name })),
};
