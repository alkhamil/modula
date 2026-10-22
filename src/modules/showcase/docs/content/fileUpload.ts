import type { ComponentDoc } from '../types';
import { FileUploadDemo } from './surfaceDemos';

export const fileUploadDoc: ComponentDoc = {
  slug: 'file-upload',
  name: 'FileUpload',
  category: 'forms',
  importStatement: "import { FileUpload } from 'shared/components/ui';",
  figmaUrl: 'https://www.figma.com/design/ThLaTINM5dmzPW4AsB8dnF/?node-id=11233-15800',
  component: FileUploadDemo,
  codeName: 'FileUpload',
  codeExtra: ['value={file}', 'onChange={setFile}'],
  baseProps: { hint: 'SVG, PNG, JPG or GIF (max. 800×400px)' },
  controls: [
    { prop: 'hint', kind: 'text' },
    { prop: 'error', kind: 'text' },
    { prop: 'multiple', kind: 'boolean' },
    { prop: 'disabled', kind: 'boolean' },
  ],
  figmaMapping: [
    { id: 'states', figma: 'File Upload Area states', values: 'default, focused, hover, disabled, error', prop: 'disabled · error · drag' },
    { id: 'hint', figma: 'Supporting text', values: 'free text', prop: 'hint' },
    { id: 'cards', figma: 'File Upload Cards states', values: 'filled', prop: 'value' },
  ],
  examples: [
    {
      id: 'states',
      variants: [
        { label: 'default', props: {} },
        { label: 'error', props: { error: 'File is required' } },
        { label: 'disabled', props: { disabled: true } },
      ],
    },
    { id: 'multiple', variants: [{ label: 'multiple', props: { multiple: true } }] },
  ],
  props: [
    { id: 'value', name: 'value · onChange', type: 'File | File[] | null · function' },
    { id: 'multiple', name: 'multiple · accept', type: 'boolean · string' },
    { id: 'hint', name: 'hint', type: 'string' },
    { id: 'error', name: 'error', type: 'string' },
    { id: 'disabled', name: 'disabled', type: 'boolean', default: 'false' },
    { id: 'testId', name: 'testId', type: 'string' },
  ],
  tokens: [
    '--wds-bg-surface',
    '--wds-bg-brand-subtle',
    '--wds-bg-disabled',
    '--wds-stroke-default',
    '--wds-stroke-brand',
    '--wds-stroke-danger',
    '--wds-icons-brand',
    '--wds-text-danger',
    '--wds-sz-file-upload-area-padding-top',
    '--wds-sz-file-upload-area-text-gap',
  ].map((name) => ({ name })),
};
