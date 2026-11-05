import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  FileUpload,
  InputField,
  RadioButtonGroup,
  SegmentedControl,
  useToast,
} from '../../../shared/components/ui';
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  Download,
} from '../../../shared/components/icons';
import { getContrastForeground, themes } from '../../../shared/theme';
import { BRAND_ACCEPT, HEX_COLOR, PRIMARY_PRESETS, readBrandAsset, validateBrandFile } from '../brand';
import SidebarPreview from '../components/SidebarPreview';
import { createProjectZip, downloadBlob } from '../createProject';
import {
  NODE_ENGINE_RANGE,
  NODE_MAJOR,
  slugifyProjectName,
  type PackManifest,
  type ProjectThemeMode,
} from '../engine/compose';
import { listPackManifests } from '../sources';

const WIZARD_STEPS = ['project', 'theme', 'auth', 'modules', 'review'] as const;
type WizardStep = (typeof WIZARD_STEPS)[number];

const AUTH_PACK_IDS = new Set(['login', 'logout', 'forgot-password', 'register', 'two-factor']);
const CORE_MODULE_IDS = new Set(['user', 'role']);
const EXAMPLE_MODULE_IDS = new Set(['example-flat', 'example-nested']);

type CollapsedMode = 'initial' | 'upload';

/** Halaman wizard installer 6 langkah untuk membuat & mengunduh basecode project React (.zip). */
function CreateProjectPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const manifests = useMemo(() => listPackManifests(), []);

  const [stepIndex, setStepIndex] = useState(0);
  const [projectName, setProjectName] = useState('My Enterprise App');
  const [nameError, setNameError] = useState<string | null>(null);

  // Brand: logo penuh + (opsional) ikon ringkas untuk sidebar collapsed.
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [collapsedMode, setCollapsedMode] = useState<CollapsedMode>('initial');
  const [collapsedFile, setCollapsedFile] = useState<File | null>(null);
  const [collapsedPreview, setCollapsedPreview] = useState<string | null>(null);
  const [collapsedError, setCollapsedError] = useState<string | null>(null);

  // Tema & runtime.
  const [themeMode, setThemeMode] = useState<ProjectThemeMode>('light');
  const [colorChoice, setColorChoice] = useState('default');
  const [customColor, setCustomColor] = useState('#00487a');

  // Default pilihan awal: login + logout + semua pack dengan default=true
  const [selectedPacks, setSelectedPacks] = useState<string[]>(() => {
    const initial = new Set<string>(['login', 'logout']);
    for (const m of manifests) {
      if (m.locked || m.default) initial.add(m.id);
    }
    return [...initial];
  });

  // State langkah 4: Build & Download
  const [building, setBuilding] = useState(false);
  const [lastBuilt, setLastBuilt] = useState<{ fileName: string; fileCount: number } | null>(null);

  const projectSlug = slugifyProjectName(projectName);
  const customColorValid = HEX_COLOR.test(customColor);
  const primaryColor =
    colorChoice === 'custom'
      ? customColorValid
        ? customColor.toLowerCase()
        : ''
      : (PRIMARY_PRESETS.find((p) => p.id === colorChoice)?.color ?? '');
  const themeBlocked = colorChoice === 'custom' && !customColorValid;
  const modeLabel = themeMode === 'dark' ? t('creator.wizard.themeStep.modeDark') : t('creator.wizard.themeStep.modeLight');
  const currentStep: WizardStep = WIZARD_STEPS[stepIndex] ?? 'project';

  const authPacks = useMemo(() => manifests.filter((m) => AUTH_PACK_IDS.has(m.id)), [manifests]);
  const coreModulePacks = useMemo(() => manifests.filter((m) => CORE_MODULE_IDS.has(m.id)), [manifests]);
  const exampleModulePacks = useMemo(() => manifests.filter((m) => EXAMPLE_MODULE_IDS.has(m.id)), [manifests]);
  const generatorPack = useMemo(() => manifests.find((m) => m.id === 'generator'), [manifests]);

  function togglePack(id: string, locked?: boolean) {
    if (locked) return;
    setSelectedPacks((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function selectAllAuth() {
    setSelectedPacks((prev) => {
      const next = new Set(prev);
      authPacks.forEach((p) => next.add(p.id));
      return [...next];
    });
  }

  function resetDefaultAuth() {
    setSelectedPacks((prev) => {
      const nonAuth = prev.filter((id) => !AUTH_PACK_IDS.has(id));
      return [...nonAuth, 'login', 'logout'];
    });
  }

  /** Terima file logo: validasi, simpan file + URL pratinjau (URL lama dilepas). */
  function pickBrand(
    files: File | File[] | null,
    set: { file: (f: File | null) => void; preview: (u: string | null) => void; error: (e: string | null) => void },
    previous: string | null,
  ) {
    if (previous) URL.revokeObjectURL(previous);
    const file = Array.isArray(files) ? (files[0] ?? null) : files;
    if (!file) {
      set.file(null);
      set.preview(null);
      set.error(null);
      return;
    }
    const problem = validateBrandFile(file);
    if (problem) {
      set.file(null);
      set.preview(null);
      set.error(t(`creator.wizard.projectStep.${problem}`));
      return;
    }
    set.file(file);
    set.preview(URL.createObjectURL(file));
    set.error(null);
  }

  function goToStep(target: number) {
    if (target > 0 && !projectName.trim()) {
      setNameError(t('creator.wizard.projectStep.nameRequired'));
      setStepIndex(0);
      return;
    }
    setNameError(null);
    setStepIndex(target);
  }

  function handleNext() {
    if (stepIndex === 0 && !projectName.trim()) {
      setNameError(t('creator.wizard.projectStep.nameRequired'));
      return;
    }
    setNameError(null);
    if (currentStep === 'theme' && themeBlocked) return;
    if (stepIndex < WIZARD_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }

  async function handleDownloadZip() {
    if (!projectName.trim()) {
      setNameError(t('creator.wizard.projectStep.nameRequired'));
      setStepIndex(0);
      return;
    }
    setBuilding(true);
    try {
      const created = await createProjectZip({
        name: projectName,
        selectedPacks,
        options: {
          theme: themeMode,
          primaryColor: primaryColor || undefined,
          brand: {
            logo: logoFile ? await readBrandAsset(logoFile) : undefined,
            collapsedLogo:
              collapsedMode === 'upload' && collapsedFile ? await readBrandAsset(collapsedFile) : undefined,
          },
        },
      });
      downloadBlob(created.blob, created.fileName);
      setLastBuilt({ fileName: created.fileName, fileCount: created.fileCount });
      toast.showToast({
        variant: 'success',
        message: t('creator.wizard.reviewStep.successMsg', {
          fileName: created.fileName,
          count: created.fileCount,
        }),
      });
    } catch (err) {
      toast.showToast({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Failed to build project zip.',
      });
    } finally {
      setBuilding(false);
    }
  }

  function renderPackOption(pack: PackManifest, badgeLabel?: string) {
    const checked = Boolean(pack.locked || selectedPacks.includes(pack.id));
    return (
      <div
        key={pack.id}
        data-testid={`pack-item-${pack.id}`}
        onClick={() => togglePack(pack.id, pack.locked)}
        className={[
          'flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors',
          pack.locked ? 'cursor-default border-border bg-surface' : 'cursor-pointer hover:border-primary',
          checked && !pack.locked ? 'border-primary bg-primary/5' : 'border-border bg-background',
        ].join(' ')}
      >
        <div onClick={(e) => e.stopPropagation()} className="flex items-start gap-3">
          <Checkbox
            value={checked}
            disabled={pack.locked}
            onChange={() => togglePack(pack.id, pack.locked)}
            testId={`pack-checkbox-${pack.id}`}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">{pack.label}</span>
            <span className="text-xs leading-relaxed text-muted-foreground">{pack.description}</span>
          </div>
        </div>
        <div className="shrink-0">
          {pack.locked ? (
            <Badge variant="neutral" size="sm">
              {badgeLabel ?? t('creator.wizard.authStep.lockedBadge')}
            </Badge>
          ) : checked ? (
            <Badge variant="primary" size="sm">
              {badgeLabel ?? t('creator.wizard.authStep.selectedBadge')}
            </Badge>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col stack-gap" data-testid="create-project-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('creator.wizard.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('creator.wizard.subtitle')}</p>
      </div>

      {/* Stepper navigasi installer */}
      <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5" data-testid="wizard-stepper">
        {WIZARD_STEPS.map((stepKey, idx) => {
          const active = idx === stepIndex;
          const completed = idx < stepIndex;
          return (
            <li key={stepKey}>
              <button
                type="button"
                onClick={() => goToStep(idx)}
                data-testid={`wizard-step-btn-${stepKey}`}
                className={[
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-xs font-semibold transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : completed
                      ? 'border-border bg-surface text-foreground hover:border-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : completed
                        ? 'bg-success text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  {idx + 1}
                </span>
                <span className="truncate">{t(`creator.wizard.steps.${stepKey}`)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Isi Langkah 1: Project Info */}
      {currentStep === 'project' && (
        <Card title={t('creator.wizard.projectStep.title')} testId="wizard-step-project">
          <div className="flex flex-col stack-gap">
            <p className="text-sm text-muted-foreground">{t('creator.wizard.projectStep.desc')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {t('creator.wizard.projectStep.nameLabel')}
                </label>
                <InputField
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder={t('creator.wizard.projectStep.namePlaceholder')}
                  error={nameError ?? undefined}
                  data-testid="project-name-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {t('creator.wizard.projectStep.slugLabel')}
                </label>
                <InputField value={projectSlug} readOnly disabled data-testid="project-slug-preview" />
              </div>
            </div>

            <div className="flex flex-col stack-gap rounded-xl border border-border p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('creator.wizard.projectStep.brandTitle')}
              </h3>
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-foreground">
                  {t('creator.wizard.projectStep.logoLabel')}
                </span>
                <FileUpload
                  size="sm"
                  accept={BRAND_ACCEPT}
                  value={logoFile}
                  error={logoError ?? undefined}
                  supportingText={t('creator.wizard.projectStep.logoSupporting')}
                  onChange={(files) =>
                    pickBrand(files, { file: setLogoFile, preview: setLogoPreview, error: setLogoError }, logoPreview)
                  }
                  testId="brand-logo-upload"
                />
              </div>

              <div className="flex flex-col field-gap">
                <span className="text-xs font-semibold text-foreground">
                  {t('creator.wizard.projectStep.collapsedTitle')}
                </span>
                <RadioButtonGroup
                  direction="vertical"
                  value={collapsedMode}
                  onChange={(v) => setCollapsedMode(v as CollapsedMode)}
                  options={[
                    { value: 'initial', label: t('creator.wizard.projectStep.collapsedInitial') },
                    { value: 'upload', label: t('creator.wizard.projectStep.collapsedUpload') },
                  ]}
                  testId="collapsed-mode"
                />
                {collapsedMode === 'upload' && (
                  <FileUpload
                    size="sm"
                    accept={BRAND_ACCEPT}
                    value={collapsedFile}
                    error={collapsedError ?? undefined}
                    supportingText={t('creator.wizard.projectStep.collapsedSupporting')}
                    onChange={(files) =>
                      pickBrand(
                        files,
                        { file: setCollapsedFile, preview: setCollapsedPreview, error: setCollapsedError },
                        collapsedPreview,
                      )
                    }
                    testId="brand-collapsed-upload"
                  />
                )}
              </div>

              <SidebarPreview
                projectName={projectName}
                logoUrl={logoPreview}
                collapsedLogoUrl={collapsedMode === 'upload' ? collapsedPreview : null}
                primaryColor={primaryColor}
              />
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('creator.wizard.projectStep.stackTitle')}
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-xs text-foreground">
                {(['ui', 'data', 'routing', 'generator'] as const).map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{t(`creator.wizard.projectStep.stackItems.${k}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Isi Langkah 2: Tema */}
      {currentStep === 'theme' && (
        <Card title={t('creator.wizard.themeStep.title')} testId="wizard-step-theme">
          <div className="flex flex-col stack-gap">
            <p className="text-sm text-muted-foreground">{t('creator.wizard.themeStep.desc')}</p>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground">{t('creator.wizard.themeStep.modeLabel')}</span>
              <div>
                <SegmentedControl
                  size="sm"
                  aria-label={t('creator.wizard.themeStep.modeLabel')}
                  value={themeMode}
                  onChange={(v) => setThemeMode(v as ProjectThemeMode)}
                  options={[
                    { value: 'light', label: t('creator.wizard.themeStep.modeLight') },
                    { value: 'dark', label: t('creator.wizard.themeStep.modeDark') },
                  ]}
                  testId="theme-mode"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">{t('creator.wizard.themeStep.colorLabel')}</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('creator.wizard.themeStep.colorLabel')}>
                {[...PRIMARY_PRESETS, { id: 'custom', color: customColorValid ? customColor : '' }].map((preset) => {
                  const selected = colorChoice === preset.id;
                  const label =
                    preset.id === 'default'
                      ? t('creator.wizard.themeStep.colorDefault')
                      : preset.id === 'custom'
                        ? t('creator.wizard.themeStep.colorCustom')
                        : preset.color;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={label}
                      title={label}
                      onClick={() => setColorChoice(preset.id)}
                      data-testid={`theme-color-${preset.id}`}
                      style={{ backgroundColor: preset.color || 'var(--wds-bg-brand)' }}
                      className={[
                        'h-9 w-9 cursor-pointer rounded-full border-2 transition-shadow focus-visible:outline-2 focus-visible:outline-primary',
                        selected ? 'border-foreground ring-2 ring-primary' : 'border-border',
                      ].join(' ')}
                    />
                  );
                })}
              </div>
              {colorChoice === 'custom' && (
                <div className="max-w-xs">
                  <InputField
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    aria-label={t('creator.wizard.themeStep.colorCustom')}
                    placeholder="#00487a"
                    error={customColorValid ? undefined : t('creator.wizard.themeStep.colorInvalid')}
                    data-testid="theme-color-hex"
                  />
                </div>
              )}
            </div>

            <div
              className="flex flex-col gap-3 rounded-xl border p-4"
              style={{
                backgroundColor: themes[themeMode].background,
                borderColor: themes[themeMode].border,
                color: themes[themeMode].foreground,
              }}
              data-testid="theme-preview"
            >
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: themes[themeMode].mutedForeground }}>
                {t('creator.wizard.themeStep.previewTitle')}
              </span>
              <p className="text-sm">{t('creator.wizard.themeStep.previewText')}</p>
              <div>
                <span
                  className="inline-flex rounded-lg px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: primaryColor || themes[themeMode].primary,
                    color: primaryColor ? getContrastForeground(primaryColor) : themes[themeMode].primaryForeground,
                  }}
                >
                  {t('creator.wizard.themeStep.previewButton')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Isi Langkah 3: Auth Features (Plug & Play Checkbox) */}
      {currentStep === 'auth' && (
        <Card title={t('creator.wizard.authStep.title')} testId="wizard-step-auth">
          <div className="flex flex-col stack-gap">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{t('creator.wizard.authStep.desc')}</p>
              <div className="flex items-center gap-2">
                <Button size="xs" hierarchy="secondary" onClick={selectAllAuth} testId="auth-select-all-btn">
                  {t('creator.wizard.authStep.selectAll')}
                </Button>
                <Button size="xs" hierarchy="tertiary" onClick={resetDefaultAuth} testId="auth-reset-btn">
                  {t('creator.wizard.authStep.resetDefault')}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {authPacks.map((pack) => renderPackOption(pack))}
            </div>
          </div>
        </Card>
      )}

      {/* Isi Langkah 3: Default & Example Modules */}
      {currentStep === 'modules' && (
        <Card title={t('creator.wizard.modulesStep.title')} testId="wizard-step-modules">
          <div className="flex flex-col stack-gap">
            <p className="text-sm text-muted-foreground">{t('creator.wizard.modulesStep.desc')}</p>

            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('creator.wizard.modulesStep.coreGroup')}
              </h3>
              {coreModulePacks.map((pack) => renderPackOption(pack, t('creator.wizard.modulesStep.defaultBadge')))}
            </div>

            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('creator.wizard.modulesStep.exampleGroup')}
              </h3>
              {exampleModulePacks.map((pack) => renderPackOption(pack, t('creator.wizard.modulesStep.defaultBadge')))}
            </div>

            {generatorPack && (
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.modulesStep.embeddedGroup')}
                </h3>
                {renderPackOption(generatorPack, t('creator.wizard.modulesStep.alwaysIncluded'))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Isi Langkah 4: Review & Download */}
      {currentStep === 'review' && (
        <Card title={t('creator.wizard.reviewStep.title')} testId="wizard-step-review">
          <div className="flex flex-col stack-gap">
            <p className="text-sm text-muted-foreground">{t('creator.wizard.reviewStep.desc')}</p>

            {lastBuilt && (
              <Alert
                variant="success"
                message={t('creator.wizard.reviewStep.successMsg', {
                  fileName: lastBuilt.fileName,
                  count: lastBuilt.fileCount,
                })}
              />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.reviewStep.summaryProject')}
                </span>
                <p className="text-base font-bold text-foreground">{projectName}</p>
                <p className="font-mono text-xs text-muted-foreground">{projectSlug}.zip</p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.reviewStep.summaryBrand')}
                </span>
                <p className="text-xs text-foreground">
                  {logoFile ? `${t('creator.wizard.reviewStep.logoSet')} · ${logoFile.name}` : t('creator.wizard.reviewStep.noLogo')}
                </p>
                <p className="text-xs text-foreground">
                  {collapsedMode === 'upload' && collapsedFile
                    ? `${t('creator.wizard.reviewStep.collapsedIcon')} · ${collapsedFile.name}`
                    : t('creator.wizard.reviewStep.collapsedInitial')}
                </p>
                <p className="text-xs text-foreground">
                  {t('creator.wizard.reviewStep.themeSummary', {
                    mode: modeLabel,
                    color: primaryColor || t('creator.wizard.themeStep.colorDefault'),
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.reviewStep.summaryRuntime')}
                </span>
                <p className="text-xs text-foreground">{t('creator.wizard.reviewStep.nodeSummary', { version: NODE_MAJOR })}</p>
                <p className="font-mono text-xs text-muted-foreground">engines.node {NODE_ENGINE_RANGE}</p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.reviewStep.summaryGenerator')}
                </span>
                <p className="text-xs leading-relaxed text-foreground">
                  {t('creator.wizard.reviewStep.generatorNote')}
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.reviewStep.summaryAuth')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {authPacks
                    .filter((p) => p.locked || selectedPacks.includes(p.id))
                    .map((p) => (
                      <Badge key={p.id} variant="primary" size="sm">
                        {p.label}
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('creator.wizard.reviewStep.summaryModules')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...coreModulePacks, ...exampleModulePacks]
                    .filter((p) => selectedPacks.includes(p.id))
                    .map((p) => (
                      <Badge key={p.id} variant="info" size="sm">
                        {p.label}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('creator.wizard.reviewStep.quickStartTitle')}
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-surface p-3 font-mono text-xs text-foreground">
                {`unzip ${projectSlug}.zip\ncd ${projectSlug}\nnvm use   # Node ${NODE_MAJOR} (.nvmrc)\ncp .env.example .env\nnpm install\nnpm run dev`}
              </pre>
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                leadingIcon={<Download className="h-5 w-5" />}
                disabled={building}
                onClick={() => void handleDownloadZip()}
                testId="download-project-zip-btn"
              >
                {building ? t('creator.wizard.reviewStep.buildingBtn') : t('creator.wizard.reviewStep.downloadBtn')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Footer navigasi antar langkah */}
      <div className="flex items-center justify-between">
        <Button
          hierarchy="secondary"
          leadingIcon={<AltArrowLeft className="h-4 w-4" />}
          disabled={stepIndex === 0}
          onClick={() => goToStep(stepIndex - 1)}
          testId="wizard-prev-btn"
        >
          {t('creator.wizard.back')}
        </Button>
        {stepIndex < WIZARD_STEPS.length - 1 && (
          <Button
            trailingIcon={<AltArrowRight className="h-4 w-4" />}
            onClick={handleNext}
            testId="wizard-next-btn"
          >
            {t('creator.wizard.next')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default CreateProjectPage;
