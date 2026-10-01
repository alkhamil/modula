import { useState } from 'react';
import { Alert, Button, Card, Dialog, useToast } from '../../../shared/components/ui';
import { StepDoneIcon, StepInProgressIcon, StepOutGoingIcon } from '../../../shared/components/icons';
import type {
  FeatureKey,
  GeneratedFile,
  GeneratorConfig,
  ModuleRegistration,
} from '../types';
import { generateModule, GeneratorConfigError } from '../engine/moduleGenerator';
import { buildRegistration } from '../engine/registration';
import { normalizeModuleName, validateConfig } from '../parser';
import { NEW_PARENT_VALUE, getParentModuleOptions } from '../parentModules';
import {
  WriteConflictError,
  WriteEndpointUnavailableError,
  writeModuleToRepo,
} from '../api/writeToRepo';
import ModuleInfoStep, {
  resolveEffectiveParent,
  type ModuleInfoValue,
} from '../components/ModuleInfoStep';
import FeaturesStep from '../components/FeaturesStep';
import FieldsStep from '../components/FieldsStep';
import ReviewStep from '../components/ReviewStep';
import OutputPanel from '../components/OutputPanel';
import type { GeneratorFieldConfig } from '../types';

const STEPS = ['Module Info', 'Features', 'Fields', 'Review'] as const;

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

function GeneratorPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<ModuleInfoValue>({
    parentName: '',
    newParentName: '',
    moduleName: '',
    type: 'crud',
    permissionKey: '',
  });
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>(DEFAULT_FEATURES);
  const [fields, setFields] = useState<GeneratorFieldConfig[]>([]);
  const [stepError, setStepError] = useState<string | null>(null);
  const [output, setOutput] = useState<GeneratedFile[] | null>(null);
  const [usedConfig, setUsedConfig] = useState<GeneratorConfig | null>(null);
  const [writeStatus, setWriteStatus] = useState<
    | { state: 'idle' }
    | { state: 'writing' }
    | { state: 'written'; count: number; registered: { routes: number; navigation: boolean } | null }
    | { state: 'conflict'; existing: string[] }
    | { state: 'unavailable' | 'error'; message: string }
  >({ state: 'idle' });
  const [pendingRegistration, setPendingRegistration] = useState<ModuleRegistration | null>(null);

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
      } else if (info.parentName !== '' && !getParentModuleOptions().includes(info.parentName)) {
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
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function handleBack(): void {
    setStepError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function writeFiles(
    files: GeneratedFile[],
    overwrite: boolean,
    registration: ModuleRegistration | null,
  ): Promise<void> {
    setWriteStatus({ state: 'writing' });
    try {
      const result = await writeModuleToRepo(
        files,
        overwrite,
        registration ?? undefined,
      );
      setWriteStatus({
        state: 'written',
        count: result.written.length,
        registered: result.registered,
      });
      const reg = result.registered;
      showToast({
        variant: 'success',
        message:
          reg && (reg.routes > 0 || reg.navigation)
            ? `${result.written.length} file ditulis ke repo. Routes + navigasi terdaftar.`
            : `${result.written.length} file ditulis ke repo.`,
      });
    } catch (err) {
      if (err instanceof WriteConflictError) {
        setWriteStatus({ state: 'conflict', existing: err.existing });
      } else if (err instanceof WriteEndpointUnavailableError) {
        setWriteStatus({ state: 'unavailable', message: err.message });
      } else {
        setWriteStatus({
          state: 'error',
          message: err instanceof Error ? err.message : 'Gagal menulis ke repo.',
        });
      }
    }
  }

  function handleGenerate(): void {
    const config = buildConfig();
    const issues = validateConfig({ ...config, moduleName: config.moduleName });
    if (issues.length > 0) {
      setStepError(`${issues.length} masalah konfigurasi. Periksa kembali langkah sebelumnya.`);
      return;
    }
    try {
      const files = generateModule(config);
      const registration = buildRegistration(config);
      setUsedConfig(config);
      setOutput(files);
      setPendingRegistration(registration);
      setStepError(null);
      showToast({ variant: 'success', message: `${files.length} file berhasil di-generate.` });
      void writeFiles(files, false, registration);
    } catch (err) {
      if (err instanceof GeneratorConfigError) {
        setStepError(err.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '));
      } else {
        setStepError('Gagal men-generate modul.');
      }
    }
  }

  if (output && usedConfig) {
    return (
      <div className="flex flex-col stack-gap">
        {writeStatus.state === 'writing' && (
          <Alert variant="info" message="Menulis file ke repo…" />
        )}
        {writeStatus.state === 'written' && (
          <Alert
            variant="success"
            message={`${writeStatus.count} file sudah ditulis ke repo.${
              writeStatus.registered &&
              (writeStatus.registered.routes > 0 || writeStatus.registered.navigation)
                ? ` ${writeStatus.registered.routes} route(s) + navigasi terdaftar otomatis — modul langsung bisa dibuka.`
                : ' Routes + navigasi sudah terdaftar sebelumnya.'
            }`}
          />
        )}
        {(writeStatus.state === 'unavailable' || writeStatus.state === 'error') && (
          <Alert
            variant="warning"
            message={`${writeStatus.message} File tetap bisa disalin/download manual di bawah.`}
          />
        )}
        <Card title={`Output: ${usedConfig.moduleName}`}>
          <OutputPanel
            files={output}
            config={usedConfig}
            onBack={() => {
              setOutput(null);
              setWriteStatus({ state: 'idle' });
            }}
          />
        </Card>
        <Dialog
          testId="generator-overwrite-dialog"
          open={writeStatus.state === 'conflict'}
          onClose={() => setWriteStatus({ state: 'idle' })}
          title="File sudah ada"
          maxWidth="md"
          closeOnEscape
          closeOnBackdropClick
        >
          <p className="text-sm text-foreground">
            {writeStatus.state === 'conflict' ? writeStatus.existing.length : 0} file sudah ada di
            repo dan akan ditimpa:
          </p>
          <ul className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
            {writeStatus.state === 'conflict' &&
              writeStatus.existing.map((path) => (
                <li key={path} className="py-0.5">
                  {path}
                </li>
              ))}
          </ul>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setWriteStatus({ state: 'idle' })}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => void writeFiles(output, true, pendingRegistration)}
            >
              Timpa & tulis
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col stack-gap">
      <StepIndicator step={step} />
      {stepError && <Alert variant="error" message={stepError} />}
      <Card title={step === 3 ? 'Review' : `Create New Module — ${STEPS[step]}`}>
        {step === 0 && (
          <ModuleInfoStep
            value={info}
            onChange={(next) => {
              setInfo(next);
              setStepError(null);
            }}
            errors={{}}
          />
        )}
        {step === 1 && <FeaturesStep value={features} onChange={setFeatures} />}
        {step === 2 && <FieldsStep fields={fields} onChange={setFields} />}
        {step === 3 && <ReviewStep config={buildConfig()} />}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleGenerate}>Generate</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default GeneratorPage;
