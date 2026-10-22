import type { ComponentType } from 'react';
import type { ComponentDoc, DocControl, FigmaMapping, GroupDoc } from '../types';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const FOCUS_ROW: FigmaMapping = {
  id: 'focus',
  figma: 'Focus indicator',
  values: '1px stroke outside, 2px gap',
  prop: '— (CSS)',
};

function horizontalRow(group: string): FigmaMapping {
  return {
    id: 'horizontal',
    figma: group === 'CheckboxGroup' ? 'Horizontal Checkbox' : 'Horizontal Radio Button',
    values: 'Description, Options (slot)',
    prop: group,
  };
}

interface SelectionDocConfig {
  slug: 'checkbox' | 'radio-button' | 'toggle';
  name: string;
  /** Node Figma (format URL, mis. `9928-9343`). */
  node: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  /** Komponen asli yang dipakai di kode contoh. */
  real: string;
  /** Prop teks label pada komponen asli. */
  labelProp: string;
  /** Atribut tambahan di kode contoh (state demo → props asli). */
  codeExtra: string[];
  /** Style outline/solid (Checkbox & RadioButton). */
  appearance: boolean;
  indeterminate?: boolean;
  figma: FigmaMapping[];
  /** Komponen grup (CheckboxGroup / RadioButtonGroup) yang didokumentasikan di halaman ini. */
  group?: GroupDoc;
  valueProp: string;
  valueType: string;
  onChangeType: string;
}

/** Bangun `ComponentDoc` kontrol seleksi (Checkbox/RadioButton/Toggle) — struktur sama, token & state sama. */
export function selectionDoc(c: SelectionDocConfig): ComponentDoc {
  const baseProps: Record<string, unknown> = {
    checked: false,
    size: 'md',
    ...(c.appearance ? { appearance: 'outline' } : {}),
    [c.labelProp]: 'Remember me',
    hint: 'This is a hint text to help user',
  };
  const controls: DocControl[] = [
    { prop: 'checked', kind: 'boolean' },
    ...(c.indeterminate ? [{ prop: 'indeterminate', kind: 'boolean' } as DocControl] : []),
    { prop: 'disabled', kind: 'boolean' },
    ...(c.appearance ? [{ prop: 'appearance', kind: 'select', options: ['outline', 'solid'] } as DocControl] : []),
    { prop: 'size', kind: 'select', options: SIZES },
    { prop: c.labelProp, kind: 'text' },
    { prop: 'hint', kind: 'text' },
    { prop: 'error', kind: 'text' },
  ];
  const columns = [
    { label: 'Default', props: {} },
    { label: 'Selected', props: { checked: true } },
    ...(c.indeterminate ? [{ label: 'Indeterminate', props: { indeterminate: true } }] : []),
    { label: 'Disabled off', props: { disabled: true } },
    { label: 'Disabled on', props: { disabled: true, checked: true } },
    { label: 'Error', props: { error: 'Error' } },
    { label: 'Focused', props: { 'data-wds-state': 'focused' } },
  ];
  const compact = { [c.labelProp]: 'Label', hint: '' };
  const rows = c.appearance
    ? (['outline', 'solid'] as const).map((a) => ({ label: a, props: { appearance: a, ...compact } }))
    : [{ label: c.slug, props: compact }];

  return {
    slug: c.slug,
    name: c.name,
    category: 'forms',
    importStatement: `import { ${c.real} } from 'shared/components/ui';`,
    figmaUrl: `https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=${c.node}`,
    component: c.component,
    codeName: c.real,
    codeExtra: c.codeExtra,
    codeOmit: ['checked'],
    defaults: { size: 'md', ...(c.appearance ? { appearance: 'outline' } : {}) },
    baseProps,
    controls,
    figmaMapping: [...c.figma, ...(c.group ? [horizontalRow(c.group.name)] : []), FOCUS_ROW],
    examples: [
      ...(c.appearance
        ? [
            {
              id: 'appearance',
              variants: [
                { label: 'outline', props: { appearance: 'outline', checked: true } },
                { label: 'solid', props: { appearance: 'solid', checked: true } },
              ],
            },
          ]
        : []),
      { id: 'sizes', variants: SIZES.map((s) => ({ label: s, props: { size: s, checked: true, hint: '' } })) },
      {
        id: 'hint',
        variants: [
          { label: 'withHint', props: { checked: true } },
          { label: 'noHint', props: { checked: true, hint: '' } },
        ],
      },
    ],
    matrices: [{ id: 'states', rows, columns }],
    props: [
      { id: 'value', name: c.valueProp, type: c.valueType },
      { id: 'onChange', name: 'onChange', type: c.onChangeType },
      ...(c.slug === 'radio-button' ? [{ id: 'radioValue', name: 'value', type: 'string' }] : []),
      { id: 'label', name: c.labelProp, type: 'string' },
      { id: 'hint', name: 'hint', type: 'string' },
      ...(c.appearance ? [{ id: 'appearance', name: 'appearance', type: "'outline' | 'solid'", default: "'outline'" }] : []),
      { id: 'size', name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
      ...(c.indeterminate ? [{ id: 'indeterminate', name: 'indeterminate', type: 'boolean', default: 'false' }] : []),
      { id: 'disabled', name: 'disabled', type: 'boolean', default: 'false' },
      { id: 'error', name: 'error', type: 'string' },
      { id: 'className', name: 'className', type: 'string' },
      { id: 'testId', name: 'testId', type: 'string' },
    ],
    group: c.group,
    tokens: [
      '--wds-stroke-default',
      '--wds-stroke-info',
      '--wds-bg-info',
      '--wds-bg-subtle-3',
      '--wds-icons-on-brand',
      '--wds-stroke-danger',
      '--wds-text-secondary',
      '--wds-text-tertiary',
      '--wds-sz-selection-controls-width',
      '--wds-sz-selection-controls-stroke',
      '--wds-sz-selection-controls-gap',
      '--wds-sz-selection-controls-radius-all',
      '--wds-stroke-focus',
    ].map((name) => ({ name })),
  };
}
