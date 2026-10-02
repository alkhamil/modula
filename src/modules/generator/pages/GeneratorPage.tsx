import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Alert, Button, Card, useToast } from '../../../shared/components/ui';
import { downloadBlob } from '../../../shared/utils';
import { StepDoneIcon, StepInProgressIcon, StepOutGoingIcon } from '../../../shared/components/icons';
import type { FeatureKey, GeneratorConfig, GeneratorFieldConfig } from '../types';
import { normalizeModuleName } from '../parser';
import type { DeleteMode, ModuleDefinition, ModuleLayout } from '../definitions';
import {
  NEW_PARENT_VALUE,
  buildApiContract,
  configToDefinition,
  defaultLayoutForFields,
  normalizeLayout,
  parentOptionsFromDefinitions,
  validateDefinition,
} from '../definitions';
import { saveDefinition, useDynamicDefinitions } from '../runtime';
import type { DynamicListItem } from '../runtime/types';
import type { DynamicFormValues } from '../runtime/validation';
import ModuleInfoStep, {
  resolveEffectiveParent,
  type ModuleInfoValue,
} from '../components/ModuleInfoStep';
import FeaturesStep from '../components/FeaturesStep';
import FieldsStep from '../components/FieldsStep';
import ReviewStep from '../components/ReviewStep';
import FormBuilderCanvas from '../builder/FormBuilderCanvas';
import TestDataPanel from '../builder/TestDataPanel';
import ListBuilderCanvas from '../builder/ListBuilderCanvas';
import DetailBuilderCanvas from '../builder/DetailBuilderCanvas';
import ContractPanel from '../builder/ContractPanel';
import { clearDraft, loadDraft, saveDraft, valuesToSampleRow } from '../builder/draft';

const STEPS = [
  'Config',
  'Form Canvas',
  'Test Data',
  'List Canvas',
  'Detail Canvas',
  'Review & Generate',
] as const;

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
    <ol className="flex flex-wrap items-center gap-2">
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
  const [initialDraft] = useState(loadDraft);
  const [step, setStep] = useState(() =>
    Math.min(initialDraft?.step ?? 0, STEPS.length - 1),
  );
  const [info, setInfo] = useState<ModuleInfoValue>(initialDraft?.info ?? INITIAL_INFO);
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>(
    initialDraft?.features ?? DEFAULT_FEATURES,
  );
  const [fields, setFields] = useState<GeneratorFieldConfig[]>(initialDraft?.fields ?? []);
  const [layout, setLayout] = useState<ModuleLayout | null>(initialDraft?.layout ?? null);
  const [deleteMode, setDeleteMode] = useState<DeleteMode>(initialDraft?.deleteMode ?? 'soft');
  const [sampleRows, setSampleRows] = useState<DynamicListItem[]>(
    initialDraft?.sampleRows ?? [],
  );
  const [stepError, setStepError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  // '' = semua status (draft + published) untuk opsi parent + target relasi.
  const definitionsQuery = useDynamicDefinitions('');
  const parentOptions = useMemo(
    () => parentOptionsFromDefinitions(definitionsQuery.data ?? []),
    [definitionsQuery.data],
  );

  useEffect(() => {
    if (publishResult) return;
    saveDraft({ info, features, fields, layout, deleteMode, sampleRows, step });
  }, [info, features, fields, layout, deleteMode, sampleRows, step, publishResult]);

  const effectiveLayout = useMemo(
    () => normalizeLayout(layout ?? defaultLayoutForFields(fields), fields.map((f) => f.name)),
    [layout, fields],
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

  const draftDef = useMemo(
    () =>
      configToDefinition(buildConfig(), {
        status: 'draft',
        layout: effectiveLayout,
        deleteMode,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [info, features, fields, effectiveLayout, deleteMode],
  );

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
      if (!Object.values(features).some(Boolean)) return 'Pilih minimal satu feature.';
      if ((features.bulkUpload || features.export) && !features.list) {
        return 'Bulk upload & export butuh feature list.';
      }
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
    if (step === 0) {
      // Masuk kanvas: selaraskan layout dengan fields terkini.
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
    clearDraft();
    setStep(0);
    setInfo(INITIAL_INFO);
    setFeatures(DEFAULT_FEATURES);
    setFields([]);
    setLayout(null);
    setDeleteMode('soft');
    setSampleRows([]);
    setStepError(null);
    setPublishResult(null);
  }

  function handleAddSampleRow(values: DynamicFormValues): void {
    const nextId = Math.max(...sampleRows.map((row) => row.id), 0) + 1;
    setSampleRows((prev) => [...prev, valuesToSampleRow(values, nextId)]);
    showToast({ variant: 'success', message: `Baris contoh #${nextId} ditambahkan.` });
  }

  async function handlePublish(targetStatus: 'draft' | 'published'): Promise<void> {
    const config = buildConfig();
    const definition = configToDefinition(config, {
      status: targetStatus,
      layout: effectiveLayout,
      deleteMode,
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
      clearDraft();
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

  function handleDownloadContract(definition: ModuleDefinition): void {
    const json = JSON.stringify(buildApiContract(definition), null, 2);
    downloadBlob(new Blob([json], { type: 'application/json' }), `${definition.apiPlural}.contract.json`);
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
            <dt className="text-muted-foreground">Data</dt>
            <dd className="font-mono text-xs text-foreground">{definition.apiPlural} (mock store)</dd>
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
            <Button type="button" variant="secondary" onClick={() => handleDownloadContract(definition)}>
              Unduh kontrak
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
      {initialDraft && step === 0 && (
        <Alert variant="info" message="Draft terakhir dimuat otomatis. Selesaikan atau mulai baru." />
      )}
      <Card title={step === 5 ? 'Review & Generate' : `Builder — ${STEPS[step]}`}>
        {step === 0 && (
          <div className="flex flex-col stack-gap">
            <Card title="Module Info">
              <ModuleInfoStep
                value={info}
                onChange={(next) => {
                  setInfo(next);
                  setStepError(null);
                }}
                errors={{}}
                parentOptions={parentOptions}
              />
            </Card>
            <Card title="Features">
              <FeaturesStep value={features} onChange={setFeatures} />
            </Card>
            <Card title="Fields">
              <FieldsStep
                fields={fields}
                onChange={setFields}
                definitions={definitionsQuery.data ?? []}
              />
            </Card>
          </div>
        )}
        {step === 1 && (
          <FormBuilderCanvas
            fields={fields}
            onFieldsChange={setFields}
            layout={layout}
            onChange={setLayout}
            previewTitle={info.moduleName.trim() || 'Preview'}
            definitions={definitionsQuery.data ?? []}
          />
        )}
        {step === 2 && (
          <TestDataPanel
            def={draftDef}
            sampleRows={sampleRows}
            onAddRow={handleAddSampleRow}
            onClearRows={() => setSampleRows([])}
          />
        )}
        {step === 3 && (
          <ListBuilderCanvas
            def={draftDef}
            fields={fields}
            onFieldsChange={setFields}
            layout={effectiveLayout}
            onChange={setLayout}
            features={features}
            onFeaturesChange={setFeatures}
            deleteMode={deleteMode}
            onDeleteModeChange={setDeleteMode}
            sampleRows={sampleRows}
          />
        )}
        {step === 4 && (
          <DetailBuilderCanvas
            def={draftDef}
            fields={fields}
            layout={effectiveLayout}
            onChange={setLayout}
            sampleRows={sampleRows}
          />
        )}
        {step === 5 && (
          <div className="flex flex-col stack-gap">
            <ReviewStep config={buildConfig()} layout={layout} deleteMode={deleteMode} />
            <ContractPanel def={draftDef} />
          </div>
        )}
        <div className="mt-6 flex justify-between gap-2">
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={handleBack} disabled={step === 0}>
              Kembali
            </Button>
            {step === 0 && (
              <Button type="button" variant="secondary" onClick={resetWizard}>
                Buang draft
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 5 && (
              <Button type="button" onClick={handleNext}>
                Lanjut
              </Button>
            )}
            {step === 5 && (
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
