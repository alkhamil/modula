import { useMemo } from 'react';
import { SelectField, TextField } from '../../../shared/components/ui';
import type { ModuleType } from '../types';
import { moduleTypeOptions } from '../registry';
import { NEW_PARENT_VALUE } from '../definitions/parents';

export interface ModuleInfoValue {
  /** '' = root, nama parent yang ada, atau NEW_PARENT_VALUE. */
  parentName: string;
  /** Nama parent baru bila parentName === NEW_PARENT_VALUE. */
  newParentName: string;
  moduleName: string;
  type: ModuleType;
  permissionKey: string;
}

/** Parent efektif untuk config: teks baru bila mode "Parent baru". */
export function resolveEffectiveParent(value: ModuleInfoValue): string {
  if (value.parentName === NEW_PARENT_VALUE) return value.newParentName.trim();
  return value.parentName;
}

interface ModuleInfoStepProps {
  value: ModuleInfoValue;
  onChange: (value: ModuleInfoValue) => void;
  errors: Record<string, string>;
  /** Parent dari definisi yang sudah terdaftar (draft maupun published). */
  parentOptions: string[];
}

function ModuleInfoStep({ value, onChange, errors, parentOptions }: ModuleInfoStepProps) {
  const options = useMemo(
    () => [
      { label: '(root) — modul top-level', value: '' },
      ...parentOptions.map((parent) => ({ label: parent, value: parent })),
      { label: '+ Parent baru…', value: NEW_PARENT_VALUE },
    ],
    [parentOptions],
  );
  const isNewParent = value.parentName === NEW_PARENT_VALUE;

  return (
    <div className="flex flex-col stack-gap">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Parent module</label>
        <SelectField
          value={value.parentName}
          onChange={(next) => onChange({ ...value, parentName: next })}
          options={options}
          clearable={false}
          searchable
          error={errors.parentName}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Opsi dari parent modul yang sudah terdaftar. Pilih (root) untuk modul top-level.
        </p>
      </div>
      {isNewParent && (
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Nama parent baru
          </label>
          <TextField
            value={value.newParentName}
            onChange={(e) => onChange({ ...value, newParentName: e.target.value })}
            placeholder="administration"
            maxLength={50}
            error={errors.newParentName}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Mendukung nested dengan slash, mis. finance/accounting.
          </p>
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Module name</label>
        <TextField
          value={value.moduleName}
          onChange={(e) => onChange({ ...value, moduleName: e.target.value })}
          placeholder="Region"
          maxLength={50}
          error={errors.moduleName}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Module type</label>
        <SelectField
          value={value.type}
          onChange={(next) => onChange({ ...value, type: next as ModuleType })}
          options={moduleTypeOptions}
          clearable={false}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Permission key <span className="text-danger">*</span>
        </label>
        <TextField
          value={value.permissionKey}
          onChange={(e) => onChange({ ...value, permissionKey: e.target.value })}
          placeholder="region"
          maxLength={100}
          error={errors.permissionKey}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Single value tanpa titik (mis.{' '}
          <span className="font-mono">user</span>, <span className="font-mono">generator</span>,{' '}
          <span className="font-mono">audit_trail</span>). Suffix{' '}
          <span className="font-mono">.view</span>, <span className="font-mono">.create</span>,{' '}
          <span className="font-mono">.update</span>, <span className="font-mono">.delete</span>,{' '}
          <span className="font-mono">.bulk_upload</span>, <span className="font-mono">.export</span>{' '}
          otomatis.
        </p>
        {value.permissionKey.trim() !== '' && (
          <ul className="mt-2 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
            {['view', 'create', 'update', 'delete', 'bulk_upload', 'export'].map((suffix) => (
              <li key={suffix} className="py-0.5">
                {value.permissionKey.trim().toLowerCase()}.{suffix}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ModuleInfoStep;
