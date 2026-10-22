import type { ComponentDoc } from '../types';
import { BreadcrumbsDemo } from './layoutDemos';

export const breadcrumbsDoc: ComponentDoc = {
  slug: 'breadcrumbs',
  name: 'Breadcrumbs',
  category: 'navigation',
  importStatement: "import { Breadcrumbs } from 'shared/components/ui';",
  component: BreadcrumbsDemo,
  codeName: 'Breadcrumbs',
  codeExtra: ["items={[{ label: 'Home', to: '/' }, { label: 'Users', to: '/users' }, { label: 'Detail' }]}"],
  baseProps: {},
  controls: [],
  figmaMapping: [
    { id: 'states', figma: 'Breadcrumbs states', values: 'default, hover, pressed, active, disabled', prop: 'items[].to · disabled' },
    { id: 'chevron', figma: 'Chevron separator', values: 'icon', prop: '— (CSS)' },
  ],
  examples: [],
  props: [
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
