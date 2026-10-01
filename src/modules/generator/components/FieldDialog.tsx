import { useState } from 'react';
import {
  Button,
  CheckboxField,
  Dialog,
  SelectField,
  TextAreaField,
  TextField,
} from '../../../shared/components/ui';
import type {
  DataSource,
  FieldOption,
  FieldType,
  FilterCriteria,
  GeneratorFieldConfig,
} from '../types';
import {
  criteriaForFieldType,
  dataSourceRegistry,
  defaultCriteria,
  defaultFilterable,
  defaultSortable,
  fieldTypeOptions,
  filterCriteriaRegistry,
  validationRegistry,
  validationRuleNames,
} from '../registry';
import { deriveFieldNaming, stringifyRules } from '../parser';
import type { ValidationRuleName } from '../registry';

interface RuleDraft {
  enabled: boolean;
  arg: string;
}

interface FieldDialogProps {
  open: boolean;
  /** Null = tambah baru; terisi = edit (index dipakai untuk cek duplikat). */
  initial: { field: GeneratorFieldConfig; index: number } | null;
  existingNames: string[];
  onClose: () => void;
  onSave: (field: GeneratorFieldConfig, index: number | null) => void;
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

function FieldDialog({ open, initial, existingNames, onClose, onSave }: FieldDialogProps) {
  const [label, setLabel] = useState(initial?.field.label ?? '');
  const [name, setName] = useState(initial?.field.name ?? '');
  const [nameTouched, setNameTouched] = useState(!!initial);
  const [type, setType] = useState<FieldType>(initial?.field.type ?? 'textField');
  const [sortable, setSortable] = useState(
    initial?.field.sortable ?? defaultSortable(initial?.field.type ?? 'textField'),
  );
  const [filterable, setFilterable] = useState(
    initial?.field.filterable ?? defaultFilterable(initial?.field.type ?? 'textField'),
  );
  const [criteria, setCriteria] = useState<FilterCriteria>(
    initial?.field.filterCriteria ??
      defaultCriteria(initial?.field.type ?? 'textField'),
  );
  const [rulesDraft, setRulesDraft] = useState<Record<ValidationRuleName, RuleDraft>>(() =>
    rulesToDraft(initial?.field.rules ?? []),
  );
  const [source, setSource] = useState<DataSource>(initial?.field.source ?? 'none');
  const [options, setOptions] = useState<FieldOption[]>(initial?.field.options ?? []);
  const [endpoint, setEndpoint] = useState(initial?.field.api?.endpoint ?? '');
  const [method, setMethod] = useState(initial?.field.api?.method ?? 'GET');
  const [valueField, setValueField] = useState(initial?.field.api?.valueField ?? 'value');
  const [labelField, setLabelField] = useState(initial?.field.api?.labelField ?? 'label');
  const [error, setError] = useState<string | null>(null);

  const allowedSources = (Object.keys(dataSourceRegistry) as DataSource[]).filter((key) =>
    dataSourceRegistry[key].appliesTo.includes(type),
  );
  const sourceOptions = allowedSources.map((value) => ({
    label: dataSourceRegistry[value].label,
    value,
  }));
  const rulesPreview = stringifyRules(draftToRules(rulesDraft));

  function handleLabelChange(value: string): void {
    setLabel(value);
    if (!nameTouched) setName(deriveFieldNaming(value).name);
  }

  function handleTypeChange(value: string): void {
    const next = value as FieldType;
    setType(next);
    setSortable(defaultSortable(next));
    setFilterable(defaultFilterable(next));
    setCriteria(defaultCriteria(next));
    if (!dataSourceRegistry[source].appliesTo.includes(next)) setSource('none');
  }

  function updateOption(index: number, patch: Partial<FieldOption>): void {
    setOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, ...patch } : opt)));
  }

  function handleSave(): void {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      setError('Label wajib diisi.');
      return;
    }
    if (!name) {
      setError('Name wajib diisi.');
      return;
    }
    const selfName = initial ? existingNames[initial.index] : undefined;
    if (name !== selfName && existingNames.includes(name)) {
      setError(`Field name "${name}" sudah dipakai.`);
      return;
    }
    if (source === 'mockStatic' && options.length === 0) {
      setError('Source mockStatic butuh minimal satu option.');
      return;
    }
    if (
      source === 'mockStatic' &&
      options.some((o) => !o.label.trim() || !o.value.trim())
    ) {
      setError('Setiap option harus punya label dan value.');
      return;
    }
    if (source === 'api' && !endpoint.trim()) {
      setError('Source api butuh endpoint.');
      return;
    }
    const field: GeneratorFieldConfig = {
      name,
      label: trimmedLabel,
      type,
      rules: draftToRules(rulesDraft),
      sortable,
      filterable,
      filterCriteria: filterable ? criteria : null,
      source,
      ...(source === 'mockStatic' || source === 'api' ? { options } : {}),
      ...(source === 'api'
        ? { api: { endpoint: endpoint.trim(), method, valueField, labelField } }
        : {}),
    };
    onSave(field, initial ? initial.index : null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Field' : 'Add Field'}
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save field</Button>
        </>
      }
    >
      <div className="flex flex-col stack-gap">
        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="grid grid-cols-2 stack-gap">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Label</label>
            <TextField
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Region Name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
            <TextField
              value={name}
              onChange={(e) => {
                setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                setNameTouched(true);
              }}
              placeholder="regionName"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Type</label>
          <SelectField
            value={type}
            onChange={(value) => handleTypeChange(value)}
            options={fieldTypeOptions}
            clearable={false}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Tabel & filter</label>
          <div className="flex flex-col field-gap rounded-lg border border-border px-3 py-2">
            <CheckboxField
              value={sortable}
              onChange={setSortable}
              checkboxLabel="Sortable (kolom bisa di-sort)"
            />
            <CheckboxField
              value={filterable}
              onChange={setFilterable}
              checkboxLabel="Filterable (tampil di filter drawer)"
            />
            {filterable && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Kriteria filter
                </label>
                <SelectField
                  value={criteria}
                  onChange={(value) => setCriteria(value as FilterCriteria)}
                  options={criteriaForFieldType(type).map((name) => ({
                    label: filterCriteriaRegistry[name].label,
                    value: name,
                  }))}
                  clearable={false}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {filterCriteriaRegistry[criteria].description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Validation rules</label>
          <div className="rounded-lg border border-border">
            {validationRuleNames.map((ruleName) => {
              const def = validationRegistry[ruleName];
              const draft = rulesDraft[ruleName];
              return (
                <div
                  key={ruleName}
                  className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-b-0"
                >
                  <CheckboxField
                    value={draft.enabled}
                    onChange={(checked) =>
                      setRulesDraft((prev) => ({
                        ...prev,
                        [ruleName]: { ...prev[ruleName], enabled: checked },
                      }))
                    }
                    checkboxLabel={def.label}
                  />
                  <span className="flex-1 text-xs text-muted-foreground">{def.description}</span>
                  {def.needsArg && (
                    <div className="w-40">
                      <TextField
                        value={draft.arg}
                        onChange={(e) =>
                          setRulesDraft((prev) => ({
                            ...prev,
                            [ruleName]: { ...prev[ruleName], arg: e.target.value },
                          }))
                        }
                        placeholder={def.placeholder ?? 'value'}
                        disabled={!draft.enabled}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {rulesPreview || '(no rules)'}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Source</label>
          <SelectField
            value={source}
            onChange={(value) => setSource(value as DataSource)}
            options={sourceOptions}
            clearable={false}
          />
        </div>

        {source === 'mockStatic' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Options</label>
            <div className="flex flex-col field-gap">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextField
                      value={opt.label}
                      onChange={(e) => updateOption(i, { label: e.target.value })}
                      placeholder="Label"
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      value={opt.value}
                      onChange={(e) => updateOption(i, { value: e.target.value })}
                      placeholder="value"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setOptions((prev) => prev.filter((_, j) => j !== i))}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOptions((prev) => [...prev, { label: '', value: '' }])}
                >
                  Tambah option
                </Button>
              </div>
            </div>
          </div>
        )}

        {source === 'api' && (
          <div className="flex flex-col field-gap">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Endpoint</label>
              <TextField
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/v1/suppliers"
              />
            </div>
            <div className="grid grid-cols-3 field-gap">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Method</label>
                <TextField value={method} onChange={(e) => setMethod(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Value field</label>
                <TextField value={valueField} onChange={(e) => setValueField(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Label field</label>
                <TextField value={labelField} onChange={(e) => setLabelField(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Contoh options (untuk mock)
              </label>
              <TextAreaField
                value={options.map((o) => `${o.label}=${o.value}`).join('\n')}
                onChange={(e) =>
                  setOptions(
                    e.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [optLabel, ...rest] = line.split('=');
                        return { label: optLabel.trim(), value: (rest.join('=') || optLabel).trim() };
                      }),
                  )
                }
                placeholder={'PT Maju=MJU\nPT Mundur=MDR'}
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default FieldDialog;
