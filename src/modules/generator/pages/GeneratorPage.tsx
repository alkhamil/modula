import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Alert, Button, Card, useToast } from '../../../shared/components/ui';
import { StepDoneIcon, StepInProgressIcon, StepOutGoingIcon } from '../../../shared/components/icons';
import type { FeatureKey, GeneratorConfig, GeneratorFieldConfig } from '../types';
import { normalizeModuleName } from '../parser';
import type { ModuleDefinition, ModuleLayout } from '../definitions';
import {
  NEW_PARENT_VALUE,
  configToDefinition,
  defaultLayoutForFields,
  normalizeLayout,
  parentOptionsFromDefinitions,
  validateDefinition,
} from '../definitions';
import { saveDefinition, useDynamicDefinitions } from '../runtime';
import ModuleInfoStep, {
  resolveEffectiveParent,
  type ModuleInfoValue,
} from '../components/ModuleInfoStep';
import FeaturesStep from '../components/FeaturesStep';
import FieldsStep from '../components/FieldsStep';
import LayoutStep from '../components/LayoutStep';
import ReviewStep from '../components/ReviewStep';

const STEPS = ['Module Info', 'Features', 'Fields', 'Layout', 'Review'] as const;

const DEFAULT_FEATURES: Record<FeatureKey, boolean> = {
  list: true,
  detail: true,
  create: true,
  edit: true,
  delete: true,
  bulkUpload: true,
  export: true,
};

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, index) => {
        const state = index < step ? 'done' : index === step ? 'current' : 'todo';
        return (
          <li key={label} className="flex items-center gap-2">
            {index > 0 && <span className="h-px w-6 bg-border" />}
            {state === 'done' ? (
              <StepDoneIcon className="h-5 w-5" />
            ) : state === 'current' ? (
              <StepInProgressIcon className="h-5 w-5" />
            ) : (
              <StepOutGoingIcon className="h-5 w-5" />
            )}
            <span
              className={`text-sm ${state === 'current' ? 'font-semibold text-foreground' : state === 'done' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const INITIAL_INFO: ModuleInfoValue = {
  parentName: '',
  newParentName: '',
  moduleName: '',
  type: 'crud',
  permissionKey: '',
};

interface PublishResult {
  definition: ModuleDefinition;
  created: boolean;
}

function GeneratorPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<ModuleInfoValue>(INITIAL_INFO);
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>(DEFAULT_FEATURES);
  const [fields, setFields] = useState<GeneratorFieldConfig[]>([]);
  const [layout, setLayout] = useState<ModuleLayout | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  // '' = semua status (draft + published) untuk opsi parent.
  const definitionsQuery = useDynamicDefinitions('');
  const parentOptions = useMemo(
    () => parentOptionsFromDefinitions(definitionsQuery.data ?? []),
    [definitionsQuery.data],
  );

  function buildConfig(): GeneratorConfig {
    const parent = resolveEffectiveParent(info);
    return {
      parentName: parent === '' ? null : parent,
      moduleName: info.moduleName.trim(),
      type: info.type,
      permissionKey: info.permissionKey.trim().toLowerCase(),
      features,
      fields,
    };
  }

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!info.moduleName.trim()) return 'Module name wajib diisi.';
      if (!normalizeModuleName(info.moduleName)) return 'Module name tidak valid.';
      if (info.parentName === NEW_PARENT_VALUE) {
        if (!info.newParentName.trim()) return 'Nama parent baru wajib diisi.';
        if (info.newParentName.length > 50) return 'Parent module maksimal 50 karakter.';
        if (!/^[a-zA-Z0-9 /_-]*$/.test(info.newParentName)) {
          return 'Parent module mengandung karakter tidak valid.';
        }
      } else if (info.parentName !== '' && !parentOptions.includes(info.parentName)) {
        return 'Parent module tidak dikenal. Pilih dari daftar atau buat parent baru.';
      }
      if (!info.permissionKey.trim()) return 'Permission key wajib diisi.';
      if (!/^[a-z][a-z0-9_]*$/.test(info.permissionKey.trim().toLowerCase())) {
        return 'Permission key harus single value tanpa titik (contoh: user, audit_trail).';
      }
      return null;
    }
    if (current === 1) {
      if (!Object.values(features).some(Boolean)) return 'Pilih minimal satu feature.';
      if ((features.bulkUpload || features.export) && !features.list) {
        return 'Bulk upload & export butuh feature list.';
      }
      return null;
    }
    if (current === 2) {
      if (fields.length === 0) return 'Tambahkan minimal satu field.';
      return null;
    }
    return null;
  }

  function handleNext(): void {
    const message = validateStep(step);
    if (message) {
      setStepError(message);
      return;
    }
    setStepError(null);
    if (step === 2) {
      // Masuk langkah Layout: selaraskan layout dengan fields terkini.
      setLayout((prev) =>
        normalizeLayout(prev ?? defaultLayoutForFields(fields), fields.map((f) => f.name)),
      );
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function handleBack(): void {
    setStepError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function resetWizard(): void {
    setStep(0);
    setInfo(INITIAL_INFO);
    setFeatures(DEFAULT_FEATURES);
    setFields([]);
    setLayout(null);
    setStepError(null);
    setPublishResult(null);
  }

  async function handlePublish(targetStatus: 'draft' | 'published'): Promise<void> {
    const config = buildConfig();
    const effectiveLayout = normalizeLayout(
      layout ?? defaultLayoutForFields(fields),
      fields.map((f) => f.name),
    );
    const definition = configToDefinition(config, {
      status: targetStatus,
      layout: effectiveLayout,
    });
    const issues = validateDefinition(definition);
    if (issues.length > 0) {
      const shown = issues
        .slice(0, 3)
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join('; ');
      setStepError(
        `${issues.length} masalah definisi: ${shown}${issues.length > 3 ? '…' : ''} Periksa kembali langkah sebelumnya.`,
      );
      return;
    }
    setIsPublishing(true);
    setStepError(null);
    try {
      const saved = await saveDefinition(definition);
      await queryClient.invalidateQueries({ queryKey: ['dynamic-definitions'] });
      await queryClient.invalidateQueries({ queryKey: ['dynamic-definition', saved.definition.key] });
      setPublishResult({ definition: saved.definition, created: saved.created });
      showToast({
        variant: 'success',
        message:
          targetStatus === 'published'
            ? `Modul "${saved.definition.key}" terbit dan langsung live.`
            : `Draft "${saved.definition.key}" tersimpan.`,
      });
    } catch (err) {
      setStepError(err instanceof Error ? err.message : 'Gagal menyimpan definisi.');
    } finally {
      setIsPublishing(false);
    }
  }

  if (publishResult) {
    const { definition, created } = publishResult;
    const isLive = definition.status === 'published';
    return (
      <div className="flex flex-col stack-gap">
        <Alert
          variant="success"
          message={
            isLive
              ? `Modul "${definition.key}" ${created ? 'dibuat' : 'diperbarui'} dan langsung live di navigasi + routes.`
              : `Draft "${definition.key}" ${created ? 'disimpan' : 'diperbarui'}. Terbitkan untuk menampilkannya di navigasi.`
          }
        />
        <Card title={`Modul: ${definition.singularLabel}`}>
          <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
            <dt className="text-muted-foreground">Key</dt>
            <dd className="font-mono text-xs text-foreground">{definition.key}</dd>
            <dt className="text-muted-foreground">Route</dt>
            <dd className="font-mono text-xs text-foreground">/{definition.routeBase}</dd>
            <dt className="text-muted-foreground">API</dt>
            <dd className="font-mono text-xs text-foreground">/api/v1/{definition.apiPlural}</dd>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-foreground">{isLive ? 'Published' : 'Draft'}</dd>
            <dt className="text-muted-foreground">Fields</dt>
            <dd className="text-foreground">{definition.fields.length} field(s)</dd>
          </dl>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setPublishResult(null)}>
              Ubah lagi
            </Button>
            <Button type="button" variant="secondary" onClick={resetWizard}>
              Buat modul baru
            </Button>
            <Button
              type="button"
              onClick={() => navigate(`/preview/${encodeURIComponent(definition.key)}`)}
            >
              Buka pratinjau
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col stack-gap">
      <StepIndicator step={step} />
      {stepError && <Alert variant="error" message={stepError} />}
      <Card title={step === 4 ? 'Review' : `Create New Module — ${STEPS[step]}`}>
        {step === 0 && (
          <ModuleInfoStep
            value={info}
            onChange={(next) => {
              setInfo(next);
              setStepError(null);
            }}
            errors={{}}
            parentOptions={parentOptions}
          />
        )}
        {step === 1 && <FeaturesStep value={features} onChange={setFeatures} />}
        {step === 2 && <FieldsStep fields={fields} onChange={setFields} />}
        {step === 3 && (
          <LayoutStep
            fields={fields}
            layout={layout}
            onChange={setLayout}
            previewTitle={info.moduleName.trim() || 'Preview'}
          />
        )}
        {step === 4 && <ReviewStep config={buildConfig()} layout={layout} />}
        <div className="mt-6 flex justify-between gap-2">
          <Button type="button" variant="secondary" onClick={handleBack} disabled={step === 0}>
            Kembali
          </Button>
          <div className="flex gap-2">
            {step < 4 && (
              <Button type="button" onClick={handleNext}>
                Lanjut
              </Button>
            )}
            {step === 4 && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPublishing}
                  onClick={() => void handlePublish('draft')}
                >
                  {isPublishing ? 'Menyimpan…' : 'Simpan sebagai Draft'}
                </Button>
                <Button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => void handlePublish('published')}
                >
                  {isPublishing ? 'Menerbitkan…' : 'Publish'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default GeneratorPage;
