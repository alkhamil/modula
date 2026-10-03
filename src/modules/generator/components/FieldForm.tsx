import { useRef, useState, type ReactNode } from 'react';
import {
  Button,
  Card,
  CheckboxField,
  Dialog,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from '../../../shared/components/ui';
import { TrashIcon } from '../../../shared/components/icons';
import type {
  ApiSourceConfig,
  DataSource,
  FieldComponentProps,
  FieldOption,
  FieldSize,
  FieldType,
  FilterCriteria,
  GeneratorFieldConfig,
  RelationConfig,
} from '../types';
import { pruneComponentProps } from '../componentProps';
import type { ModuleDefinition } from '../definitions';
import {
  criteriaForFieldType,
  dataSourceRegistry,
  defaultCriteria,
  defaultFilterable,
  defaultSortable,
  defaultRuleArg,
  fieldTypeOptions,
  filterCriteriaRegistry,
  validationRegistry,
  validationRuleNames,
} from '../registry';
import { deriveFieldNaming, isReservedFieldName } from '../parser';
import type { ValidationRuleName } from '../registry';

/** Nilai form field: semua attr editable + default terisi (tanpa optional). */
export interface FieldFormValue {
  label: string;
  name: string;
  type: FieldType;
  rules: string[];
  sortable: boolean;
  filterable: boolean;
  filterCriteria: FilterCriteria | null;
  source: DataSource;
  options: FieldOption[];
  api: Required<ApiSourceConfig>;
  relation: { definitionKey: string; labelField: string; valueField: string };
  placeholder: string;
  disabled: boolean;
  /** String mentah input angka ('' = default). */
  rows: string;
  accept: string;
  /** Props komponen + FormItem (per tipe). */
  props: FieldComponentProps;
  /** Draft sub-field kolom (formArrayField). */
  subFields: SubFieldDraft[];
}

/** Satu sub-field kolom array: paritas penuh dengan parent (rules + source + tampilan + props). */
export interface SubFieldDraft {
  label: string;
  name: string;
  type: FieldType;
  /** Rules penuh seperti parent (`required|min:3|...`). */
  rules: string[];
  source: DataSource;
  options: FieldOption[];
  api: Required<ApiSourceConfig>;
  relation: { definitionKey: string; labelField: string; valueField: string };
  placeholder: string;
  disabled: boolean;
  /** String mentah input angka ('' = default). */
  rows: string;
  accept: string;
  /** Props komponen + FormItem (layout vertical, dsb.) — diedit via modal. */
  props: FieldComponentProps;
  nameTouched: boolean;
}

/** Draft kosong untuk tambah kolom baru via modal. */
function blankSubDraft(): SubFieldDraft {
  return {
    label: '',
    name: '',
    type: 'textField',
    rules: [],
    source: 'none',
    options: [],
    api: { endpoint: '', method: 'GET', valueField: 'value', labelField: 'label' },
    relation: { definitionKey: '', labelField: '', valueField: 'id' },
    placeholder: '',
    disabled: false,
    rows: '',
    accept: '',
    props: {},
    nameTouched: false,
  };
}

/** Sub draft → nilai FieldForm agar bisa diedit penuh di modal. */
function subToFormValue(sub: SubFieldDraft): FieldFormValue {
  return {
    label: sub.label,
    name: sub.name,
    type: sub.type,
    rules: [...sub.rules],
    sortable: false,
    filterable: false,
    filterCriteria: null,
    source: sub.source,
    options: sub.options.map((o) => ({ ...o })),
    api: { ...sub.api },
    relation: { ...sub.relation },
    placeholder: sub.placeholder,
    disabled: sub.disabled,
    rows: sub.rows,
    accept: sub.accept,
    props: structuredClone(sub.props),
    subFields: [],
  };
}

/** Nilai FieldForm modal → patch sub draft. */
function formValueToSub(form: FieldFormValue): SubFieldDraft {
  return {
    label: form.label,
    name: form.name,
    type: form.type,
    rules: [...form.rules],
    source: form.source,
    options: form.options.map((o) => ({ ...o })),
    api: { ...form.api },
    relation: { ...form.relation },
    placeholder: form.placeholder,
    disabled: form.disabled,
    rows: form.rows,
    accept: form.accept,
    props: form.props ? structuredClone(form.props) : {},
    nameTouched: true,
  };
}

function configToSubDraft(sub: GeneratorFieldConfig): SubFieldDraft {
  return {
    label: sub.label,
    name: sub.name,
    type: sub.type,
    rules: [...sub.rules],
    source: sub.source,
    options: (sub.options ?? []).map((o) => ({ ...o })),
    api: {
      endpoint: sub.api?.endpoint ?? '',
      method: sub.api?.method ?? 'GET',
      valueField: sub.api?.valueField ?? 'value',
      labelField: sub.api?.labelField ?? 'label',
    },
    relation: {
      definitionKey: sub.relation?.definitionKey ?? '',
      labelField: sub.relation?.labelField ?? '',
      valueField: sub.relation?.valueField ?? 'id',
    },
    placeholder: sub.placeholder ?? '',
    disabled: sub.disabled ?? false,
    rows: sub.rows ? String(sub.rows) : '',
    accept: sub.accept ?? '',
    props: sub.componentProps ? structuredClone(sub.componentProps) : {},
    nameTouched: true,
  };
}

function subDraftToConfig(sub: SubFieldDraft): GeneratorFieldConfig {
  const allowed = (Object.keys(dataSourceRegistry) as DataSource[]).filter((key) =>
    dataSourceRegistry[key].appliesTo.includes(sub.type),
  );
  const source = allowed.includes(sub.source) ? sub.source : 'none';
  const rows = Number.parseInt(sub.rows, 10);
  const prunedProps = pruneComponentProps(sub.type, sub.props);
  return {
    name: sub.name,
    label: sub.label.trim(),
    type: sub.type,
    rules: [...sub.rules],
    source,
    ...(source === 'mockStatic' || source === 'api' ? { options: sub.options } : {}),
    ...(source === 'api'
      ? {
          api: {
            endpoint: sub.api.endpoint.trim(),
            method: sub.api.method,
            valueField: sub.api.valueField,
            labelField: sub.api.labelField,
          },
        }
      : {}),
    ...(source === 'relation'
      ? {
          relation: {
            definitionKey: sub.relation.definitionKey,
            labelField: sub.relation.labelField,
            valueField: sub.relation.valueField.trim() || 'id',
          },
        }
      : {}),
    ...(sub.placeholder.trim() ? { placeholder: sub.placeholder.trim() } : {}),
    ...(sub.disabled ? { disabled: true } : {}),
    ...(sub.type === 'textareaField' && Number.isFinite(rows) && rows > 0 ? { rows } : {}),
    ...(sub.type === 'fileUploadField' && sub.accept.trim() ? { accept: sub.accept.trim() } : {}),
    ...(prunedProps ? { componentProps: prunedProps } : {}),
    sortable: false,
    filterable: false,
    filterCriteria: null,
  };
}

export interface FieldFormPreset {
  type?: FieldType;
  source?: DataSource;
  label?: string;
}

interface RuleDraft {
  enabled: boolean;
  arg: string;
}

function rulesToDraft(rules: string[]): Record<ValidationRuleName, RuleDraft> {
  const draft = {} as Record<ValidationRuleName, RuleDraft>;
  for (const name of validationRuleNames) draft[name] = { enabled: false, arg: '' };
  for (const rule of rules) {
    const sep = rule.indexOf(':');
    const name = (sep === -1 ? rule : rule.slice(0, sep)) as ValidationRuleName;
    if (name in draft) {
      draft[name] = { enabled: true, arg: sep === -1 ? '' : rule.slice(sep + 1) };
    }
  }
  return draft;
}

function draftToRules(draft: Record<ValidationRuleName, RuleDraft>): string[] {
  const rules: string[] = [];
  for (const name of validationRuleNames) {
    const entry = draft[name];
    if (!entry.enabled) continue;
    const needsArg = validationRegistry[name].needsArg;
    if (needsArg && entry.arg.trim() === '') continue;
    rules.push(needsArg ? `${name}:${entry.arg.trim()}` : name);
  }
  return rules;
}

/** Nilai awal form dari field existing, preset palet, atau kosong. */
export function initialFormValue(
  field: GeneratorFieldConfig | null,
  preset?: FieldFormPreset,
): FieldFormValue {
  const type = field?.type ?? preset?.type ?? 'textField';
  const source = field?.source ?? preset?.source ?? 'none';
  return {
    label: field?.label ?? preset?.label ?? '',
    name: field?.name ?? '',
    type,
    rules: field ? [...field.rules] : [],
    sortable: field?.sortable ?? defaultSortable(type),
    filterable: field?.filterable ?? defaultFilterable(type),
    filterCriteria: field?.filterCriteria ?? defaultCriteria(type),
    source,
    options:
      field?.options?.map((o) => ({ ...o })) ??
      (source === 'mockStatic'
        ? [
            { label: 'Option 1', value: 'option_1' },
            { label: 'Option 2', value: 'option_2' },
          ]
        : []),
    api: {
      endpoint: field?.api?.endpoint ?? '',
      method: field?.api?.method ?? 'GET',
      valueField: field?.api?.valueField ?? 'value',
      labelField: field?.api?.labelField ?? 'label',
    },
    relation: {
      definitionKey: field?.relation?.definitionKey ?? '',
      labelField: field?.relation?.labelField ?? '',
      valueField: field?.relation?.valueField ?? 'id',
    },
    placeholder: field?.placeholder ?? '',
    disabled: field?.disabled ?? false,
    rows: field?.rows ? String(field.rows) : '',
    accept: field?.accept ?? '',
    props: field?.componentProps ? structuredClone(field.componentProps) : {},
    subFields: (field?.subFields ?? [])
      .filter((sub) => sub.type !== 'formArrayField')
      .map(configToSubDraft),
  };
}

/** Form → config field (buang default kosong; muatan source tak relevan ikut di-strip normalize). */
export function buildFieldConfig(form: FieldFormValue): GeneratorFieldConfig {
  const rows = Number.parseInt(form.rows, 10);
  const prunedProps = pruneComponentProps(form.type, form.props);
  const relation: RelationConfig = {
    definitionKey: form.relation.definitionKey,
    labelField: form.relation.labelField,
    valueField: form.relation.valueField.trim() || 'id',
  };
  return {
    name: form.name,
    label: form.label.trim(),
    type: form.type,
    rules: [...form.rules],
    sortable: form.sortable,
    filterable: form.filterable,
    filterCriteria: form.filterable ? form.filterCriteria : null,
    source: form.source,
    ...(form.source === 'mockStatic' || form.source === 'api' ? { options: form.options } : {}),
    ...(form.source === 'api'
      ? {
          api: {
            endpoint: form.api.endpoint.trim(),
            method: form.api.method,
            valueField: form.api.valueField,
            labelField: form.api.labelField,
          },
        }
      : {}),
    ...(form.source === 'relation' ? { relation } : {}),
    ...(form.placeholder.trim() ? { placeholder: form.placeholder.trim() } : {}),
    ...(form.disabled ? { disabled: true } : {}),
    ...(form.type === 'textareaField' && Number.isFinite(rows) && rows > 0 ? { rows } : {}),
    ...(form.type === 'fileUploadField' && form.accept.trim() ? { accept: form.accept.trim() } : {}),
    ...(form.type === 'formArrayField' ? { subFields: form.subFields.map(subDraftToConfig) } : {}),
    ...(prunedProps ? { componentProps: prunedProps } : {}),
  };
}

const PLACEHOLDER_TYPES: FieldType[] = [
  'textField',
  'textareaField',
  'passwordField',
  'numberField',
  'currencyField',
  'dateField',
  'dateRangeField',
  'selectField',
  'selectMultipleField',
];

const COMPONENT_LABEL: Record<FieldType, string> = {
  textField: 'TextField',
  numberField: 'TextField (currency)',
  currencyField: 'TextField (currency + simbol)',
  textareaField: 'TextAreaField',
  passwordField: 'PasswordField',
  dateField: 'DatePickerField',
  dateRangeField: 'DateRangeField',
  selectField: 'SelectField',
  selectMultipleField: 'SelectMultipleField',
  radioGroupField: 'RadioGroupField',
  checkboxField: 'CheckboxField',
  checkboxGroupField: 'CheckboxGroupField',
  switchField: 'SwitchField',
  fileUploadField: 'FileUploadField',
  colorField: 'ColorField',
  editorField: 'EditorField (TipTap)',
  formArrayField: 'FormArrayField',
};

const TRI_STATE_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Ya', value: 'true' },
  { label: 'Tidak', value: 'false' },
];

/** Pilihan boolean 3-status: Default (tak di-set) / Ya / Tidak. */
function TriState({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (next: boolean | undefined) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-muted-foreground">{label}</label>
      <SelectField size="sm"
        value={value === undefined ? '' : value ? 'true' : 'false'}
        onChange={(next) => onChange(next === '' ? undefined : next === 'true')}
        options={TRI_STATE_OPTIONS}
        clearable={false}
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SizeSelect({
  value,
  onChange,
}: {
  value: FieldSize | undefined;
  onChange: (next: FieldSize | undefined) => void;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-muted-foreground">size</label>
      <SelectField size="sm"
        value={value ?? ''}
        onChange={(next) => onChange(next === '' ? undefined : (next as FieldSize))}
        options={[
          { label: 'Default (md)', value: '' },
          { label: 'sm', value: 'sm' },
          { label: 'md', value: 'md' },
          { label: 'lg', value: 'lg' },
        ]}
        clearable={false}
      />
    </div>
  );
}

function PropText({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-muted-foreground">{label}</label>
      <TextField size="sm" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function PropNumber({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number | undefined;
  onChange: (next: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-muted-foreground">{label}</label>
      <TextField size="sm"
        value={value ? String(value) : ''}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, '');
          onChange(digits === '' ? undefined : Number(digits));
        }}
        placeholder={placeholder}
        maxLength={5}
      />
    </div>
  );
}

interface FieldFormProps {
  value: FieldFormValue;
  onChange: (value: FieldFormValue) => void;
  /** Definisi terdaftar untuk picker target relasi. */
  definitions: ModuleDefinition[];
  /** Dipanggil saat input Name kehilangan fokus (drawer pakai untuk commit rename). */
  onNameBlur?: () => void;
  /** Sembunyikan kartu Tabel & Filter (untuk editor sub-field di modal). */
  hideTableFilter?: boolean;
}

/**
 * Editor daftar rule validasi — dipakai parent field maupun sub-field kolom
 * sehingga perilakunya paritas penuh (checkbox + argumen auto-default).
 */
function ValidationEditor({
  rules,
  onChange,
}: {
  rules: string[];
  onChange: (rules: string[]) => void;
}) {
  // Argumen terakhir per rule agar enable ulang memakai nilai sebelumnya.
  const lastArgsRef = useRef<Partial<Record<ValidationRuleName, string>>>({});
  const draft = rulesToDraft(rules);
  function setDraft(next: Record<ValidationRuleName, RuleDraft>): void {
    onChange(draftToRules(next));
  }

  /**
   * Centang/hapus rule. Rule berargumen yang dicentang tanpa argumen langsung
   * diisi nilai bawaan (argumen terakhir / placeholder registry) — tanpa ini
   * `draftToRules` membuang rule ber-argumen kosong sehingga checkbox
   * tampak tidak bisa dicentang.
   */
  function setEnabled(ruleName: ValidationRuleName, enabled: boolean): void {
    const current = draft[ruleName];
    const needsArg = validationRegistry[ruleName].needsArg;
    const arg = needsArg
      ? current.arg.trim() || lastArgsRef.current[ruleName] || defaultRuleArg(ruleName)
      : '';
    if (needsArg && arg.trim()) lastArgsRef.current[ruleName] = arg.trim();
    setDraft({ ...draft, [ruleName]: { enabled, arg } });
  }

  return (
    <div className="flex flex-col field-gap">
      <p className="text-xs text-muted-foreground">
        Centang rule untuk mengaktifkan. Rule berargumen terisi otomatis dan bisa diubah.
      </p>
      {validationRuleNames.map((ruleName) => {
        const def = validationRegistry[ruleName];
        const entry = draft[ruleName];
        return (
          <div
            key={ruleName}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
              entry.enabled ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <CheckboxField
              size="sm"
              value={entry.enabled}
              onChange={(checked) => setEnabled(ruleName, checked)}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground">{def.label}</p>
              <p className="truncate text-xs text-muted-foreground" title={def.description}>
                {def.description}
              </p>
            </div>
            {def.needsArg && (
              <div className="w-24 shrink-0">
                <TextField size="sm"
                  value={entry.arg}
                  onChange={(e) => {
                    const arg = e.target.value;
                    if (arg.trim()) lastArgsRef.current[ruleName] = arg.trim();
                    setDraft({ ...draft, [ruleName]: { ...entry, arg } });
                  }}
                  placeholder={def.placeholder ?? 'value'}
                  disabled={!entry.enabled}
                />
              </div>
            )}
          </div>
        );
      })}
      <p className="font-mono text-xs text-muted-foreground">{rules.join('|') || '(no rules)'}</p>
    </div>
  );
}

export interface SourcePatch {
  source?: DataSource;
  options?: FieldOption[];
  api?: Required<ApiSourceConfig>;
  relation?: { definitionKey: string; labelField: string; valueField: string };
}

/**
 * Editor sumber data — dipakai parent field maupun sub-field kolom sehingga
 * pilihannya paritas penuh (none/mockStatic/paging/relation/api per tipe).
 */
function SourceEditor({
  type,
  source,
  options,
  api,
  relation,
  definitions,
  onPatch,
  /** Bila true, tombol hapus option hanya ikon (tanpa label) — untuk sub-field. */
  iconOnlyRemove = false,
}: {
  type: FieldType;
  source: DataSource;
  options: FieldOption[];
  api: Required<ApiSourceConfig>;
  relation: { definitionKey: string; labelField: string; valueField: string };
  definitions: ModuleDefinition[];
  onPatch: (part: SourcePatch) => void;
  iconOnlyRemove?: boolean;
}) {
  const allowedSources = (Object.keys(dataSourceRegistry) as DataSource[]).filter((key) =>
    dataSourceRegistry[key].appliesTo.includes(type),
  );
  const relationTargetDef = definitions.find((d) => d.key === relation.definitionKey);

  function updateOption(index: number, optPatch: Partial<FieldOption>): void {
    onPatch({ options: options.map((opt, i) => (i === index ? { ...opt, ...optPatch } : opt)) });
  }

  return (
    <div className="flex flex-col stack-gap">
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground">Source</label>
        <SelectField size="sm"
          value={source}
          onChange={(next) => onPatch({ source: next as DataSource })}
          options={allowedSources.map((item) => ({
            label: dataSourceRegistry[item].label,
            value: item,
          }))}
          clearable={false}
        />
      </div>

      {source === 'mockStatic' && (
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">Options</label>
          <div className="flex flex-col field-gap">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <TextField size="sm"
                    value={opt.label}
                    onChange={(e) => updateOption(i, { label: e.target.value })}
                    placeholder="Label"
                  />
                </div>
                <div className="flex-1">
                  <TextField size="sm"
                    value={opt.value}
                    onChange={(e) => updateOption(i, { value: e.target.value })}
                    placeholder="value"
                  />
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onPatch({ options: options.filter((_, j) => j !== i) })}
                  icon={<TrashIcon className="h-4 w-4" />}
                  title="Hapus"
                >
                  {iconOnlyRemove ? null : 'Hapus'}
                </Button>
              </div>
            ))}
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPatch({ options: [...options, { label: '', value: '' }] })}
              >
                Tambah option
              </Button>
            </div>
          </div>
        </div>
      )}

      {source === 'relation' && (
        <div className="flex flex-col field-gap">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Modul target</label>
            <SelectField size="sm"
              value={relation.definitionKey}
              onChange={(next) => {
                const target = definitions.find((d) => d.key === next);
                onPatch({
                  relation: {
                    ...relation,
                    definitionKey: next,
                    labelField: target?.fields.some((f) => f.name === relation.labelField)
                      ? relation.labelField
                      : '',
                  },
                });
              }}
              options={definitions.map((d) => ({ label: `${d.label} (${d.key})`, value: d.key }))}
              clearable={false}
              searchable
            />
            {definitions.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Belum ada modul terdaftar — publish modul target dulu.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 field-gap">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Label field</label>
              <SelectField size="sm"
                value={relation.labelField}
                onChange={(next) => onPatch({ relation: { ...relation, labelField: next } })}
                options={(relationTargetDef?.fields ?? []).map((f) => ({
                  label: `${f.label} (${f.name})`,
                  value: f.name,
                }))}
                clearable={false}
                searchable
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Value field</label>
              <TextField size="sm"
                value={relation.valueField}
                onChange={(e) => onPatch({ relation: { ...relation, valueField: e.target.value } })}
                placeholder="id"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Options diambil dari records modul target (search + paging ikut).
          </p>
        </div>
      )}

      {source === 'api' && (
        <div className="flex flex-col field-gap">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Endpoint</label>
            <TextField size="sm"
              value={api.endpoint}
              onChange={(e) => onPatch({ api: { ...api, endpoint: e.target.value } })}
              placeholder="https://api.example.com/suppliers"
            />
          </div>
          <div className="grid grid-cols-3 field-gap">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Method</label>
              <TextField size="sm"
                value={api.method}
                onChange={(e) => onPatch({ api: { ...api, method: e.target.value } })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Value field</label>
              <TextField size="sm"
                value={api.valueField}
                onChange={(e) => onPatch({ api: { ...api, valueField: e.target.value } })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Label field</label>
              <TextField size="sm"
                value={api.labelField}
                onChange={(e) => onPatch({ api: { ...api, labelField: e.target.value } })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Contoh options (untuk mock)
            </label>
            <TextAreaField size="sm"
              value={options.map((o) => `${o.label}=${o.value}`).join('\n')}
              onChange={(e) =>
                onPatch({
                  options: e.target.value
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [optLabel, ...rest] = line.split('=');
                      return { label: optLabel.trim(), value: (rest.join('=') || optLabel).trim() };
                    }),
                })
              }
              placeholder={'PT Maju=MJU\nPT Mundur=MDR'}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Modal editor satu sub-field kolom: FieldForm penuh (semua properti seperti
 * parent, tanpa kartu Tabel & Filter) + validasi nama saat simpan.
 * Dipakai dari daftar ringkas agar drawer parent tidak bertabrakan.
 */
function SubFieldModal({
  title,
  initial,
  siblingNames,
  definitions,
  onClose,
  onSave,
}: {
  title: string;
  initial: SubFieldDraft;
  siblingNames: string[];
  definitions: ModuleDefinition[];
  onClose: () => void;
  onSave: (next: SubFieldDraft) => void;
}) {
  const [draft, setDraft] = useState<FieldFormValue>(() => subToFormValue(initial));
  const [error, setError] = useState<string | null>(null);

  function handleSave(): void {
    const name = draft.name.trim();
    if (!name) {
      setError('Name wajib diisi.');
      return;
    }
    if (isReservedFieldName(name)) {
      setError(`"${name}" reserved untuk kolom sistem.`);
      return;
    }
    if (siblingNames.includes(name)) {
      setError(`Field name "${name}" sudah dipakai.`);
      return;
    }
    onSave({ ...formValueToSub(draft), name });
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      maxWidth="lg"
      testId="subfield-modal"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave} testId="subfield-modal-save">
            Simpan
          </Button>
        </>
      }
    >
      {error && <p className="mb-3 text-sm text-danger">{error}</p>}
      <FieldForm
        value={draft}
        onChange={(next) => {
          setDraft(next);
          setError(null);
        }}
        definitions={definitions}
        hideTableFilter
      />
    </Dialog>
  );
}

/**
 * Editor field terkontrol penuh — dipakai dialog tambah/edit maupun panel
 * properti kanvas. Induk remount via key tiap ganti field.
 */
function FieldForm({ value, onChange, definitions, onNameBlur, hideTableFilter = false }: FieldFormProps) {
  const [nameTouched, setNameTouched] = useState(value.name !== '');
  const [subModal, setSubModal] = useState<{ mode: 'create' } | { mode: 'edit'; index: number } | null>(null);
  const form = value;
  const patch = (part: Partial<FieldFormValue>): void => onChange({ ...form, ...part });

  function handleLabelChange(next: string): void {
    patch({
      label: next,
      ...(nameTouched ? {} : { name: deriveFieldNaming(next).name }),
    });
  }

  function handleTypeChange(next: FieldType): void {
    patch({
      type: next,
      sortable: defaultSortable(next),
      filterable: defaultFilterable(next),
      filterCriteria: defaultCriteria(next),
      source: dataSourceRegistry[form.source].appliesTo.includes(next) ? form.source : 'none',
    });
  }

  function patchSub(index: number, part: Partial<SubFieldDraft>): void {
    patch({
      subFields: form.subFields.map((sub, i) => (i === index ? { ...sub, ...part } : sub)),
    });
  }

  function patchTypedProps(key: keyof FieldComponentProps, part: Record<string, unknown>): void {
    const current = (form.props[key] as Record<string, unknown> | undefined) ?? {};
    patch({ props: { ...form.props, [key]: { ...current, ...part } } as FieldComponentProps });
  }

  function patchFormItem(part: Record<string, unknown>): void {
    patchTypedProps('formItem', part);
  }

  /** Props terketik untuk satu kunci (default objek kosong). */
  function typedProps<K extends keyof FieldComponentProps>(
    key: K,
  ): NonNullable<FieldComponentProps[K]> {
    return (form.props[key] ?? {}) as NonNullable<FieldComponentProps[K]>;
  }

  function renderTypedProps(): ReactNode {
    switch (form.type) {
      case 'textField':
      case 'numberField':
      case 'currencyField': {
        const p = typedProps('text');
        const isCurrency = form.type === 'currencyField';
        return (
          <>
            <SizeSelect value={p.size} onChange={(size) => patchTypedProps('text', { size })} />
            <TriState
              label="clearable"
              value={p.clearable}
              onChange={(clearable) => patchTypedProps('text', { clearable })}
              hint="Tombol X untuk mengosongkan input."
            />
            <PropText
              label="prefix"
              value={p.prefix ?? ''}
              onChange={(prefix) => patchTypedProps('text', { prefix })}
              placeholder={isCurrency ? 'Rp (default)' : 'Rp'}
            />
            <PropText
              label="suffix"
              value={p.suffix ?? ''}
              onChange={(suffix) => patchTypedProps('text', { suffix })}
              placeholder="kg"
            />
            {isCurrency && (
              <p className="text-xs text-muted-foreground">
                Selalu format currency; simbol prefix default Rp bila dikosongkan.
              </p>
            )}
          </>
        );
      }
      case 'textareaField': {
        const p = typedProps('textarea');
        return (
          <SizeSelect
            value={p.size}
            onChange={(size) => patchTypedProps('textarea', { size })}
          />
        );
      }
      case 'passwordField': {
        const p = typedProps('password');
        return (
          <>
            <SizeSelect
              value={p.size}
              onChange={(size) => patchTypedProps('password', { size })}
            />
            <TriState
              label="defaultVisible"
              value={p.defaultVisible}
              onChange={(defaultVisible) => patchTypedProps('password', { defaultVisible })}
              hint="Password terlihat sejak awal."
            />
          </>
        );
      }
      case 'dateField': {
        const p = typedProps('date');
        return (
          <>
            <SizeSelect value={p.size} onChange={(size) => patchTypedProps('date', { size })} />
            <TriState
              label="showTime"
              value={p.showTime}
              onChange={(showTime) => patchTypedProps('date', { showTime })}
              hint="Pilih jam + menit."
            />
            <TriState
              label="clearable"
              value={p.clearable}
              onChange={(clearable) => patchTypedProps('date', { clearable })}
              hint="Default: tombol X tampil."
            />
            <PropText
              label="minDate"
              value={p.minDate ?? ''}
              onChange={(minDate) => patchTypedProps('date', { minDate })}
              placeholder="2026-01-01"
            />
            <PropText
              label="maxDate"
              value={p.maxDate ?? ''}
              onChange={(maxDate) => patchTypedProps('date', { maxDate })}
              placeholder="2026-12-31"
            />
          </>
        );
      }
      case 'dateRangeField': {
        const p = typedProps('dateRange');
        return (
          <>
            <SizeSelect
              value={p.size}
              onChange={(size) => patchTypedProps('dateRange', { size })}
            />
            <PropText
              label="maxDate"
              value={p.maxDate ?? ''}
              onChange={(maxDate) => patchTypedProps('dateRange', { maxDate })}
              placeholder="2026-12-31"
            />
            <PropNumber
              label="maxRangeDays"
              value={p.maxRangeDays}
              onChange={(maxRangeDays) => patchTypedProps('dateRange', { maxRangeDays })}
              placeholder="Batas hari"
            />
          </>
        );
      }
      case 'selectField': {
        const p = typedProps('select');
        return (
          <>
            <SizeSelect value={p.size} onChange={(size) => patchTypedProps('select', { size })} />
            <TriState
              label="clearable"
              value={p.clearable}
              onChange={(clearable) => patchTypedProps('select', { clearable })}
              hint="Default: mati (statis) / nyala (loader)."
            />
            <TriState
              label="searchable"
              value={p.searchable}
              onChange={(searchable) => patchTypedProps('select', { searchable })}
              hint="Default: bisa cari."
            />
            <TriState
              label="paginateOnScroll"
              value={p.paginateOnScroll}
              onChange={(paginateOnScroll) => patchTypedProps('select', { paginateOnScroll })}
              hint="Default: aktif untuk loader."
            />
            <PropNumber
              label="pageSize"
              value={p.pageSize}
              onChange={(pageSize) => patchTypedProps('select', { pageSize })}
              placeholder="20"
            />
            <PropText
              label="emptyOptionsText"
              value={p.emptyOptionsText ?? ''}
              onChange={(emptyOptionsText) => patchTypedProps('select', { emptyOptionsText })}
              placeholder="No options"
            />
            <TriState
              label="showSelectedOptions"
              value={p.showSelectedOptions}
              onChange={(showSelectedOptions) =>
                patchTypedProps('select', { showSelectedOptions })
              }
            />
            <TriState
              label="showValueOnly"
              value={p.showValueOnly}
              onChange={(showValueOnly) => patchTypedProps('select', { showValueOnly })}
              hint="Trigger tampilkan value mentah."
            />
          </>
        );
      }
      case 'selectMultipleField': {
        const p = typedProps('selectMultiple');
        return (
          <>
            <SizeSelect
              value={p.size}
              onChange={(size) => patchTypedProps('selectMultiple', { size })}
            />
            <TriState
              label="clearable"
              value={p.clearable}
              onChange={(clearable) => patchTypedProps('selectMultiple', { clearable })}
            />
            <TriState
              label="searchable"
              value={p.searchable}
              onChange={(searchable) => patchTypedProps('selectMultiple', { searchable })}
              hint="Default: bisa cari."
            />
            <TriState
              label="paginateOnScroll"
              value={p.paginateOnScroll}
              onChange={(paginateOnScroll) => patchTypedProps('selectMultiple', { paginateOnScroll })}
              hint="Default: aktif untuk loader."
            />
            <PropNumber
              label="pageSize"
              value={p.pageSize}
              onChange={(pageSize) => patchTypedProps('selectMultiple', { pageSize })}
              placeholder="20"
            />
            <PropText
              label="emptyOptionsText"
              value={p.emptyOptionsText ?? ''}
              onChange={(emptyOptionsText) =>
                patchTypedProps('selectMultiple', { emptyOptionsText })
              }
              placeholder="No options"
            />
            <TriState
              label="showSelectedOptions"
              value={p.showSelectedOptions}
              onChange={(showSelectedOptions) =>
                patchTypedProps('selectMultiple', { showSelectedOptions })
              }
            />
            <TriState
              label="chipsSummary"
              value={p.chipsSummary}
              onChange={(chipsSummary) => patchTypedProps('selectMultiple', { chipsSummary })}
              hint="Ringkas jadi “[n] items selected”."
            />
            <TriState
              label="closeOnSelect"
              value={p.closeOnSelect}
              onChange={(closeOnSelect) => patchTypedProps('selectMultiple', { closeOnSelect })}
              hint="Tutup dropdown tiap pilih."
            />
            <TriState
              label="hideCheckBox"
              value={p.hideCheckBox}
              onChange={(hideCheckBox) => patchTypedProps('selectMultiple', { hideCheckBox })}
              hint="Sembunyikan checkbox opsi."
            />
          </>
        );
      }
      case 'radioGroupField': {
        const p = typedProps('radio');
        return (
          <SizeSelect value={p.size} onChange={(size) => patchTypedProps('radio', { size })} />
        );
      }
      case 'checkboxField': {
        const p = typedProps('checkbox');
        return (
          <>
            <SizeSelect
              value={p.size}
              onChange={(size) => patchTypedProps('checkbox', { size })}
            />
            <TriState
              label="indeterminate"
              value={p.indeterminate}
              onChange={(indeterminate) => patchTypedProps('checkbox', { indeterminate })}
              hint="Status setengah tercentang."
            />
          </>
        );
      }
      case 'checkboxGroupField': {
        const p = typedProps('checkboxGroup');
        return (
          <SizeSelect
            value={p.size}
            onChange={(size) => patchTypedProps('checkboxGroup', { size })}
          />
        );
      }
      case 'switchField': {
        const p = typedProps('switch');
        return (
          <>
            <SizeSelect value={p.size} onChange={(size) => patchTypedProps('switch', { size })} />
            <TriState
              label="showCheckedLabels"
              value={p.showCheckedLabels}
              onChange={(showCheckedLabels) => patchTypedProps('switch', { showCheckedLabels })}
              hint="Default: label statis."
            />
            <PropText
              label="checkedLabel"
              value={p.checkedLabel ?? ''}
              onChange={(checkedLabel) => patchTypedProps('switch', { checkedLabel })}
              placeholder="Ya"
            />
            <PropText
              label="uncheckedLabel"
              value={p.uncheckedLabel ?? ''}
              onChange={(uncheckedLabel) => patchTypedProps('switch', { uncheckedLabel })}
              placeholder="Tidak"
            />
          </>
        );
      }
      case 'fileUploadField': {
        const p = typedProps('upload');
        return (
          <>
            <SizeSelect value={p.size} onChange={(size) => patchTypedProps('upload', { size })} />
            <TriState
              label="multiple"
              value={p.multiple}
              onChange={(multiple) => patchTypedProps('upload', { multiple })}
              hint="Aktif = pilih banyak file, nilai File[]."
            />
          </>
        );
      }
      case 'colorField': {
        const p = typedProps('color');
        return (
          <SizeSelect value={p.size} onChange={(size) => patchTypedProps('color', { size })} />
        );
      }
      case 'editorField': {
        const p = typedProps('editor');
        return (
          <SizeSelect value={p.size} onChange={(size) => patchTypedProps('editor', { size })} />
        );
      }
      case 'formArrayField': {
        const p = typedProps('array');
        return (
          <>
            <SizeSelect value={p.size} onChange={(size) => patchTypedProps('array', { size })} />
            <PropText
              label="addLabel"
              value={p.addLabel ?? ''}
              onChange={(addLabel) => patchTypedProps('array', { addLabel })}
              placeholder="Tambah"
            />
            <PropText
              label="editorTitle"
              value={p.editorTitle ?? ''}
              onChange={(editorTitle) => patchTypedProps('array', { editorTitle })}
              placeholder="Otomatis dari label"
            />
            <PropText
              label="emptyTitle"
              value={p.emptyTitle ?? ''}
              onChange={(emptyTitle) => patchTypedProps('array', { emptyTitle })}
              placeholder="Belum ada data"
            />
            <PropText
              label="emptyDescription"
              value={p.emptyDescription ?? ''}
              onChange={(emptyDescription) => patchTypedProps('array', { emptyDescription })}
              placeholder="Klik tombol di bawah untuk menambah baris."
            />
            <PropNumber
              label="maxRows"
              value={p.maxRows}
              onChange={(maxRows) => patchTypedProps('array', { maxRows })}
              placeholder="Tanpa batas"
            />
            <TriState
              label="lockFirstRow"
              value={p.lockFirstRow}
              onChange={(lockFirstRow) => patchTypedProps('array', { lockFirstRow })}
              hint="Baris pertama selalu ada dan tidak bisa dihapus."
            />
          </>
        );
      }
    }
  }

  return (
    <div className="flex flex-col stack-gap">
      <Card size="sm" title="General" collapsible>
        <div className="flex flex-col stack-gap">
          <div className="grid grid-cols-2 stack-gap">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Label</label>
              <TextField size="sm"
                value={form.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Region Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Name</label>
              <TextField size="sm"
                value={form.name}
                onChange={(e) => {
                  patch({ name: e.target.value.replace(/[^a-zA-Z0-9]/g, '') });
                  setNameTouched(true);
                }}
                onBlur={() => onNameBlur?.()}
                placeholder="regionName"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Type</label>
            <SelectField size="sm"
              value={form.type}
              onChange={(next) => handleTypeChange(next as FieldType)}
              options={fieldTypeOptions}
              clearable={false}
            />
          </div>
        </div>
      </Card>

      {form.type === 'formArrayField' && (
        <Card size="sm" title="Sub-fields & Kolom" collapsible>
          <div className="flex flex-col stack-gap">
            {form.subFields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Belum ada kolom. Tambahkan minimal satu sub-field.
              </p>
            )}
            {form.subFields.map((sub, i) => {
              const typeLabel =
                fieldTypeOptions.find((opt) => opt.value === sub.type)?.label ?? sub.type;
              return (
                <div
                  key={i}
                  data-testid={`subfield-${i}`}
                  role="button"
                  tabIndex={0}
                  title="Klik untuk ubah"
                  onClick={() => setSubModal({ mode: 'edit', index: i })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSubModal({ mode: 'edit', index: i });
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 hover:border-primary"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      Kolom {i + 1} — {sub.label.trim() || '(tanpa label)'}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {sub.name || '(tanpa name)'} · {typeLabel} ·{' '}
                      {dataSourceRegistry[sub.source]?.label ?? sub.source}
                      {sub.rules.length > 0 ? ` · ${sub.rules.join('|')}` : ''}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    title="Hapus kolom"
                    onClick={(e) => {
                      e.stopPropagation();
                      patch({ subFields: form.subFields.filter((_, j) => j !== i) });
                    }}
                    icon={<TrashIcon className="h-4 w-4" />}
                  />
                </div>
              );
            })}
            <div>
              <Button variant="secondary" size="sm" onClick={() => setSubModal({ mode: 'create' })}>
                Tambah sub-field
              </Button>
            </div>
            {subModal && (
              <SubFieldModal
                key={subModal.mode === 'edit' ? `edit-${subModal.index}` : 'create'}
                title={
                  subModal.mode === 'edit'
                    ? `Ubah kolom — ${form.subFields[subModal.index]?.label || `Kolom ${subModal.index + 1}`}`
                    : 'Tambah kolom'
                }
                initial={
                  subModal.mode === 'edit'
                    ? (form.subFields[subModal.index] ?? blankSubDraft())
                    : blankSubDraft()
                }
                siblingNames={form.subFields
                  .filter((_, j) => subModal.mode === 'create' || j !== subModal.index)
                  .map((s) => s.name)}
                definitions={definitions}
                onClose={() => setSubModal(null)}
                onSave={(next) => {
                  if (subModal.mode === 'create') {
                    patch({ subFields: [...form.subFields, next] });
                  } else {
                    patchSub(subModal.index, next);
                  }
                  setSubModal(null);
                }}
              />
            )}
          </div>
        </Card>
      )}

      <Card size="sm" title="Appearance" collapsible>
        <div className="flex flex-col stack-gap">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Tampilan input</label>
            <div className="flex flex-col field-gap rounded-lg border border-border px-3 py-2">
              {PLACEHOLDER_TYPES.includes(form.type) && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Placeholder</label>
                  <TextField size="sm"
                    value={form.placeholder}
                    onChange={(e) => patch({ placeholder: e.target.value })}
                    placeholder="Otomatis dari label"
                    maxLength={100}
                  />
                </div>
              )}
              {form.type === 'textareaField' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">
                    Tinggi (baris)
                  </label>
                  <TextField size="sm"
                    value={form.rows}
                    onChange={(e) => patch({ rows: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="Default"
                    maxLength={2}
                  />
                </div>
              )}
              {form.type === 'fileUploadField' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">
                    Accept (filter file)
                  </label>
                  <TextField size="sm"
                    value={form.accept}
                    onChange={(e) => patch({ accept: e.target.value })}
                    placeholder=".pdf,.png"
                    maxLength={100}
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">Disabled</p>
                  <p className="text-xs text-muted-foreground">Input nonaktif di form.</p>
                </div>
                <SwitchField
                  value={form.disabled}
                  onChange={(disabled) => patch({ disabled })}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Props FormItem</label>
            <div className="flex flex-col field-gap rounded-lg border border-border px-3 py-2">
              <div>
                <label className="mb-1 block font-mono text-xs text-muted-foreground">layout</label>
                <SelectField size="sm"
                  value={form.props.formItem?.layout ?? ''}
                  onChange={(next) =>
                    patchFormItem({ layout: next === '' ? undefined : next })
                  }
                  options={[
                    { label: 'Default (horizontal)', value: '' },
                    { label: 'horizontal', value: 'horizontal' },
                    { label: 'vertical', value: 'vertical' },
                  ]}
                  clearable={false}
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-muted-foreground">align</label>
                <SelectField size="sm"
                  value={form.props.formItem?.align ?? ''}
                  onChange={(next) => patchFormItem({ align: next === '' ? undefined : next })}
                  options={[
                    { label: 'Default (center)', value: '' },
                    { label: 'center', value: 'center' },
                    { label: 'start', value: 'start' },
                  ]}
                  clearable={false}
                />
              </div>
              <PropText
                label="labelTooltip"
                value={form.props.formItem?.labelTooltip ?? ''}
                onChange={(labelTooltip) => patchFormItem({ labelTooltip })}
                placeholder="Teks bantuan label"
              />
              <div>
                <label className="mb-1 block font-mono text-xs text-muted-foreground">
                  labelFontWeight
                </label>
                <SelectField size="sm"
                  value={form.props.formItem?.labelFontWeight ?? ''}
                  onChange={(next) => patchFormItem({ labelFontWeight: next === '' ? undefined : next })}
                  options={[
                    { label: 'Default (medium)', value: '' },
                    { label: 'light', value: 'light' },
                    { label: 'normal', value: 'normal' },
                    { label: 'medium', value: 'medium' },
                    { label: 'semibold', value: 'semibold' },
                    { label: 'bold', value: 'bold' },
                  ]}
                  clearable={false}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Props {COMPONENT_LABEL[form.type]}
            </label>
            <div className="flex flex-col field-gap rounded-lg border border-border px-3 py-2">
              {renderTypedProps()}
            </div>
          </div>
        </div>
      </Card>


      {!hideTableFilter && (
      <Card size="sm" title="Tabel & Filter" collapsible defaultOpen={false}>
        <div className="flex flex-col field-gap">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Sortable</p>
              <p className="text-xs text-muted-foreground">Kolom bisa di-sort di tabel.</p>
            </div>
            <SwitchField
              value={form.sortable}
              onChange={(sortable) => patch({ sortable })}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Filterable</p>
              <p className="text-xs text-muted-foreground">Tampil di filter drawer halaman list.</p>
            </div>
            <SwitchField
              value={form.filterable}
              onChange={(filterable) => patch({ filterable })}
              size="sm"
            />
          </div>
          {form.filterable && (
            <div className="rounded-lg border border-border px-3 py-2">
              <label className="mb-1 block text-xs font-medium text-foreground">
                Kriteria filter
              </label>
              <SelectField size="sm"
                value={form.filterCriteria ?? defaultCriteria(form.type)}
                onChange={(next) => patch({ filterCriteria: next as FilterCriteria })}
                options={criteriaForFieldType(form.type).map((name) => ({
                  label: filterCriteriaRegistry[name].label,
                  value: name,
                }))}
                clearable={false}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {
                  filterCriteriaRegistry[form.filterCriteria ?? defaultCriteria(form.type)]
                    .description
                }
              </p>
            </div>
          )}
        </div>
      </Card>
      )}


      <Card size="sm" title="Validasi" collapsible defaultOpen={false}>
        <ValidationEditor rules={form.rules} onChange={(rules) => patch({ rules })} />
      </Card>


      <Card size="sm" title="Sumber Data" collapsible defaultOpen={false}>
        <SourceEditor
          type={form.type}
          source={form.source}
          options={form.options}
          api={form.api}
          relation={form.relation}
          definitions={definitions}
          onPatch={(part) => patch(part)}
        />
      </Card>

    </div>
  );
}

export default FieldForm;
