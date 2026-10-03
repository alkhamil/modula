import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Alert, Button, Card, Dialog, useToast } from '../../../shared/components/ui';
import { downloadBlob } from '../../../shared/utils';
import { ChevronLeftIcon, ChevronRightIcon, StepDoneIcon, StepInProgressIcon, StepOutGoingIcon } from '../../../shared/components/icons';
import type { FeatureKey, GeneratorConfig, GeneratorFieldConfig, MenuIcon } from '../types';
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
import {
  deleteDefinition,
  deleteModuleRecords,
  saveDefinition,
  useDynamicDefinitions,
} from '../runtime';
import type { DynamicListItem } from '../runtime/types';
import type { DynamicFormValues } from '../runtime/validation';
import ModuleInfoStep, {
  resolveEffectiveParent,
  type ModuleInfoValue,
} from '../components/ModuleInfoStep';
import FeaturesStep from '../components/FeaturesStep';
import MenuIconDialog from '../components/MenuIconDialog';
import ModulesTab from '../components/ModulesTab';
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
  'Live Preview',
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
  const [menuIcon, setMenuIcon] = useState<MenuIcon | null>(initialDraft?.menuIcon ?? null);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const [sampleRows, setSampleRows] = useState<DynamicListItem[]>(
    initialDraft?.sampleRows ?? [],
  );
  const [stepError, setStepError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [view, setView] = useState<'builder' | 'modules'>('builder');
  const [infoSession, setInfoSession] = useState(0);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingApiPlural, setEditingApiPlural] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<ModuleDefinition | null>(null);

  // '' = semua status (draft + published) untuk opsi parent + target relasi.
  const definitionsQuery = useDynamicDefinitions('');
  const parentOptions = useMemo(
    () => parentOptionsFromDefinitions(definitionsQuery.data ?? []),
    [definitionsQuery.data],
  );

  useEffect(() => {
    if (publishResult) return;
    saveDraft({ info, features, fields, layout, deleteMode, menuIcon, sampleRows, step });
  }, [info, features, fields, layout, deleteMode, menuIcon, sampleRows, step, publishResult]);

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
      menuIcon: menuIcon ?? undefined,
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
    [info, features, fields, effectiveLayout, deleteMode, menuIcon],
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
      return null;
    }
    if (current === 1) {
      if (fields.length === 0) return 'Tambahkan minimal satu field dari palet.';
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
    setMenuIcon(null);
    setSampleRows([]);
    setStepError(null);
    setPublishResult(null);
    setEditingKey(null);
    setEditingApiPlural(null);
    setInfoSession((prev) => prev + 1);
  }

  /** Muat definisi listing ke wizard untuk diedit; publish menimpa key yang sama. */
  function loadDefinitionToWizard(def: ModuleDefinition): void {
    setInfo({
      parentName: def.parent ?? '',
      newParentName: '',
      moduleName: def.singularLabel,
      type: def.moduleType,
      permissionKey: def.permissionKey,
    });
    setFeatures({ ...def.features });
    setFields(structuredClone(def.fields));
    setLayout(structuredClone(def.layout));
    setDeleteMode(def.deleteMode);
    setMenuIcon(def.menuIcon ? { ...def.menuIcon } : null);
    setSampleRows([]);
    setStep(0);
    setStepError(null);
    setPublishResult(null);
    setEditingKey(def.key);
    setEditingApiPlural(def.apiPlural);
    setInfoSession((prev) => prev + 1);
    setView('builder');
    showToast({ variant: 'info', message: `Memuat "${def.key}" ke Builder untuk diedit.` });
  }

  function requestEdit(def: ModuleDefinition): void {
    const draft = loadDraft();
    const hasWork =
      draft !== null && (draft.fields.length > 0 || draft.info.moduleName.trim() !== '');
    if (hasWork) {
      setEditTarget(def);
    } else {
      loadDefinitionToWizard(def);
    }
  }

  function handleAddSampleRow(values: DynamicFormValues): void {
    const nextId = Math.max(...sampleRows.map((row) => row.id), 0) + 1;
    setSampleRows((prev) => [...prev, valuesToSampleRow(values, nextId, fields)]);
    showToast({ variant: 'success', message: `Baris contoh #${nextId} ditambahkan.` });
    // Langsung lanjut ke List Canvas setelah test data dibuat.
    setStepError(null);
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
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
      // Edit yang mengubah key (ganti parent/nama): bersihkan definisi + records lama.
      if (editingKey && editingKey !== saved.definition.key) {
        await deleteDefinition(editingKey);
        if (editingApiPlural) await deleteModuleRecords(editingApiPlural);
        showToast({ variant: 'info', message: `Definisi lama "${editingKey}" dihapus.` });
      }
      setEditingKey(null);
      setEditingApiPlural(null);
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                resetWizard();
                setView('modules');
              }}
            >
              Lihat daftar modul
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
      <div role="tablist" aria-label="Tampilan generator" className="flex items-center gap-4 border-b border-border">
        {(
          [
            { id: 'builder', label: 'Builder' },
            { id: 'modules', label: 'Daftar Modul' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`-mb-px cursor-pointer border-b-2 px-1 pb-2 pt-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              view === tab.id
                ? 'border-primary font-semibold text-primary'
                : 'border-transparent font-normal text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {view === 'modules' && (
        <Card title="Daftar Modul">
          <ModulesTab
            definitions={definitionsQuery.data ?? []}
            isLoading={definitionsQuery.isLoading}
            onEdit={requestEdit}
          />
        </Card>
      )}
      {view === 'builder' && (
        <>
          <StepIndicator step={step} />
          {editingKey && (
            <Alert variant="info" message={`Mengedit "${editingKey}" — publish menimpa modul ini.`} />
          )}
          {stepError && <Alert variant="error" message={stepError} />}
          {initialDraft && step === 0 && (
            <Alert
              variant="info"
              message="Draft terakhir dimuat otomatis. Selesaikan atau mulai baru."
            />
          )}
          <Card
            title={step === 5 ? 'Review & Generate' : `Builder — ${STEPS[step]}`}
            actions={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={step === 0}
                  icon={<ChevronLeftIcon className="h-4 w-4" />}
                >
                  Kembali
                </Button>
                {step === 0 && (
                  <Button type="button" variant="secondary" onClick={resetWizard}>
                    Buang draft
                  </Button>
                )}
                {step < 5 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    iconPosition="right"
                    icon={<ChevronRightIcon className="h-4 w-4" />}
                  >
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
            }
          >
        {step === 0 && (
          <div className="flex flex-col stack-gap">
            <Card title="Module Info">
              <ModuleInfoStep
                key={infoSession}
                value={info}
                onChange={(next) => {
                  setInfo(next);
                  setStepError(null);
                }}
                errors={{}}
                parentOptions={parentOptions}
                menuIcon={menuIcon}
                onOpenIconDialog={() => setIconDialogOpen(true)}
              />
            </Card>
            <Card title="Features">
              <FeaturesStep value={features} onChange={setFeatures} />
            </Card>
          </div>
        )}
        {iconDialogOpen && (
          <MenuIconDialog
            open={iconDialogOpen}
            initial={menuIcon}
            parentName={resolveEffectiveParent(info)}
            moduleName={info.moduleName.trim()}
            onClose={() => setIconDialogOpen(false)}
            onSave={(next) => {
              setMenuIcon(next);
              setStepError(null);
              showToast({
                variant: 'success',
                message:
                  next === null
                    ? 'Ikon menu dihapus — sidebar memakai ikon bawaan.'
                    : 'Ikon menu tersimpan ke draft.',
              });
            }}
          />
        )}
        {step === 1 && (
          <FormBuilderCanvas
            fields={fields}
            onFieldsChange={setFields}
            layout={layout}
            onChange={setLayout}
            previewTitle={info.moduleName.trim() || 'Preview'}
            definitions={definitionsQuery.data ?? []}
            sampleRows={sampleRows}
            onSampleRowsChange={setSampleRows}
          />
        )}
        {step === 2 && (
          <TestDataPanel
            def={draftDef}
            onAddRow={handleAddSampleRow}
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
          </Card>
        </>
      )}
      <Dialog
        testId="generator-edit-dialog"
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title="Muat modul ke Builder"
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                if (editTarget) loadDefinitionToWizard(editTarget);
                setEditTarget(null);
              }}
            >
              Buang draft, muat modul
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          Draft berjalan akan dibuang dan diganti modul "{editTarget?.key}". Lanjutkan?
        </p>
      </Dialog>
    </div>
  );
}

export default GeneratorPage;
