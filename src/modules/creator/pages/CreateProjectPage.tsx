import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Badge,
  Button,
  FileUpload,
  InputField,
  RadioButtonGroup,
  SegmentedControl,
  useToast,
} from '../../../shared/components/ui';
import { AltArrowLeft, AltArrowRight, Check, CheckCircle, Download } from '../../../shared/components/icons';
import type { UiStyle } from '../../../shared/theme';
import { BRAND_ACCEPT, HEX_COLOR, PRIMARY_PRESETS, readBrandAsset, validateBrandFile } from '../brand';
import SidebarPreview from '../components/SidebarPreview';
import StylePreview, { type PreviewScreen } from '../components/StylePreview';
import { createProjectZip, downloadBlob, type CreatedProject } from '../createProject';
import { saveProjectLiveConfig } from '../liveStore';
import { localRunAvailable, runProjectLocally, stopProjectLocally, type LocalRunResult } from '../localRun';
import { NODE_MAJOR, slugifyProjectName, type ProjectThemeMode } from '../engine/compose';
import { MODULE_CARDS, MODULE_GROUPS, defaultCards, packIdsFor } from '../modules';
import { UI_STYLE_OPTIONS } from '../uiStyles';

const STEPS = ['identity', 'style', 'modules', 'review', 'install', 'finish'] as const;
type Step = (typeof STEPS)[number];
type CollapsedMode = 'initial' | 'upload';

const STAGE_DELAY_MS = 380;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Wizard bergaya installer: Identitas → Gaya & tema → Modul & fitur → Ringkasan → Pemasangan → Selesai. */
function CreateProjectPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [stepIndex, setStepIndex] = useState(0);
  const step: Step = STEPS[stepIndex] ?? 'identity';

  // Identitas + brand.
  const [projectName, setProjectName] = useState('My Enterprise App');
  const [nameError, setNameError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [collapsedMode, setCollapsedMode] = useState<CollapsedMode>('initial');
  const [collapsedFile, setCollapsedFile] = useState<File | null>(null);
  const [collapsedPreview, setCollapsedPreview] = useState<string | null>(null);
  const [collapsedError, setCollapsedError] = useState<string | null>(null);

  // Gaya & tema.
  const [uiStyle, setUiStyle] = useState<UiStyle>('classic');
  const [themeMode, setThemeMode] = useState<ProjectThemeMode>('light');
  const [colorChoice, setColorChoice] = useState('default');
  const [customColor, setCustomColor] = useState('#00487a');

  // Modul & fitur.
  const [selectedCards, setSelectedCards] = useState<string[]>(defaultCards);

  // Pemasangan.
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [installError, setInstallError] = useState<string | null>(null);
  const [built, setBuilt] = useState<CreatedProject | null>(null);
  const runId = useRef(0);

  // Jalankan di localhost (hanya saat `npm run dev`).
  const [localRun, setLocalRun] = useState<{ status: 'idle' | 'starting' | 'running' | 'error'; result?: LocalRunResult; error?: string }>({ status: 'idle' });

  const projectSlug = slugifyProjectName(projectName);
  const customColorValid = HEX_COLOR.test(customColor);
  const primaryColor =
    colorChoice === 'custom'
      ? customColorValid
        ? customColor.toLowerCase()
        : ''
      : (PRIMARY_PRESETS.find((preset) => preset.id === colorChoice)?.color ?? '');
  const styleName = t(`creator.installer.style.styles.${uiStyle}.name`);
  const modeLabel = t(themeMode === 'dark' ? 'creator.installer.style.modeDark' : 'creator.installer.style.modeLight');
  const activeCards = MODULE_CARDS.filter((card) => card.ready && (card.locked || selectedCards.includes(card.id)));
  const installing = step === 'install' && !installError && !built;

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
      set.error(t(`creator.installer.identity.${problem}`));
      return;
    }
    set.file(file);
    set.preview(URL.createObjectURL(file));
    set.error(null);
  }

  function toggleCard(id: string) {
    setSelectedCards((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  /** Validasi langkah aktif sebelum pindah; true bila boleh lanjut. */
  function validateStep(): boolean {
    if (step === 'identity' && !projectName.trim()) {
      setNameError(t('creator.installer.identity.nameRequired'));
      return false;
    }
    if (step === 'style' && colorChoice === 'custom' && !customColorValid) return false;
    return true;
  }

  function goTo(target: number) {
    if (installing || stepIndex >= 4) return;
    if (target > stepIndex && !validateStep()) return;
    setNameError(null);
    setStepIndex(target);
  }

  async function runInstall() {
    if (!validateStep()) return;
    const id = (runId.current += 1);
    const alive = () => runId.current === id;
    setStepIndex(4);
    setBuilt(null);
    setInstallError(null);
    setLog([]);
    setProgress(0);

    const stages = [
      t('creator.installer.install.stages.structure'),
      t('creator.installer.install.stages.designSystem'),
      t('creator.installer.install.stages.style', { style: styleName.toLowerCase() }),
      t('creator.installer.install.stages.brand'),
      ...activeCards.map((card) => t('creator.installer.install.stages.module', { name: t(`creator.installer.modules.cards.${card.id}.name`) })),
      t('creator.installer.install.stages.node'),
      t('creator.installer.install.stages.pack'),
    ];

    // Zip sungguhan dibuat paralel dengan log tahapan; hasilnya ditunggu di tahap terakhir.
    const build = (async () =>
      createProjectZip({
        name: projectName,
        selectedPacks: packIdsFor(selectedCards),
        options: {
          theme: themeMode,
          uiStyle,
          primaryColor: primaryColor || (projectSlug === 'fahmiapp' ? '#a01713' : undefined),
          brand: {
            logo: logoFile ? await readBrandAsset(logoFile) : undefined,
            collapsedLogo: collapsedMode === 'upload' && collapsedFile ? await readBrandAsset(collapsedFile) : undefined,
          },
        },
      }))();
    build.catch(() => undefined);

    for (let i = 0; i < stages.length; i += 1) {
      await sleep(STAGE_DELAY_MS);
      if (!alive()) return;
      setLog((prev) => [...prev, stages[i]!]);
      setProgress(Math.round(((i + 1) / stages.length) * 100));
    }
    try {
      const created = await build;
      if (!alive()) return;
      saveProjectLiveConfig({
        name: projectName,
        slug: projectSlug,
        theme: themeMode,
        uiStyle,
        primaryColor: primaryColor || (projectSlug === 'fahmiapp' ? '#a01713' : undefined),
        logoUrl: logoPreview,
        collapsedLogoUrl: collapsedPreview,
        selectedPacks: packIdsFor(selectedCards),
        customModules: [],
      });
      setBuilt(created);
      setStepIndex(5);

      // Otomatis jalankan server live Vite di background agar URL Live langsung aktif
      if (localRunAvailable()) {
        setLocalRun({ status: 'starting' });
        void runProjectLocally({
          name: projectName,
          selectedPacks: packIdsFor(selectedCards),
          theme: themeMode,
          uiStyle,
          primaryColor: primaryColor || (projectSlug === 'fahmiapp' ? '#a01713' : undefined),
          logoFile,
          collapsedLogoFile: collapsedMode === 'upload' ? collapsedFile : null,
        })
          .then((result) => {
            if (alive()) setLocalRun({ status: 'running', result });
          })
          .catch((err: unknown) => {
            if (alive()) setLocalRun({ status: 'error', error: err instanceof Error ? err.message : String(err) });
          });
      }
    } catch (error) {
      if (!alive()) return;
      setInstallError(error instanceof Error ? error.message : String(error));
    }
  }

  function handleDownload() {
    if (!built) return;
    downloadBlob(built.blob, built.fileName);
    toast.showToast({ variant: 'success', message: t('creator.installer.finish.downloaded', { fileName: built.fileName }) });
  }

  async function handleRunLocal() {
    setLocalRun({ status: 'starting' });
    try {
      const result = await runProjectLocally({
        name: projectName,
        selectedPacks: packIdsFor(selectedCards),
        theme: themeMode,
        uiStyle,
        primaryColor: primaryColor || (projectSlug === 'fahmiapp' ? '#a01713' : undefined),
        logoFile,
        collapsedLogoFile: collapsedMode === 'upload' ? collapsedFile : null,
      });
      setLocalRun({ status: 'running', result });
    } catch (error) {
      setLocalRun({ status: 'error', error: error instanceof Error ? error.message : String(error) });
    }
  }

  function handleStopLocal() {
    const slug = localRun.result?.slug;
    setLocalRun({ status: 'idle' });
    if (slug) void stopProjectLocally(slug).catch(() => undefined);
  }

  function startOver() {
    handleStopLocal();
    runId.current += 1;
    setBuilt(null);
    setInstallError(null);
    setLog([]);
    setProgress(0);
    setStepIndex(0);
  }

  const swatch = (id: string, color: string, label: string) => {
    const selected = colorChoice === id;
    return (
      <button
        key={id}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={label}
        title={label}
        onClick={() => setColorChoice(id)}
        data-testid={`theme-color-${id}`}
        style={{ backgroundColor: color || 'var(--wds-bg-brand)' }}
        className={[
          'h-9 w-9 cursor-pointer rounded-full border-2 transition-shadow focus-visible:outline-2 focus-visible:outline-primary',
          selected ? 'border-foreground ring-2 ring-primary' : 'border-border',
        ].join(' ')}
      />
    );
  };

  const sectionTitle = (key: string) => (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(key)}</h3>
  );

  const summaryRow = (label: string, value: string) => (
    <div key={label} className="flex items-start justify-between gap-4 border-t border-border py-2.5 text-sm first:border-t-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col stack-gap" data-testid="create-project-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('creator.installer.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('creator.installer.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Daftar langkah ala installer */}
        <nav aria-label={t('creator.installer.title')} className="rounded-xl border border-border bg-surface p-4 lg:self-start">
          <ol className="flex flex-col gap-1" data-testid="wizard-stepper">
            {STEPS.map((key, index) => {
              const state = index < stepIndex ? 'done' : index === stepIndex ? 'current' : 'todo';
              const clickable = state === 'done' && stepIndex < 4;
              return (
                <li key={key}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => goTo(index)}
                    aria-current={state === 'current' ? 'step' : undefined}
                    data-testid={`wizard-step-btn-${key}`}
                    className={[
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm',
                      state === 'current' ? 'font-semibold text-foreground' : 'text-muted-foreground',
                      clickable ? 'cursor-pointer hover:bg-muted' : 'cursor-default',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                        state === 'done' ? 'border-success bg-success/15 text-success' : '',
                        state === 'current' ? 'border-primary bg-primary/10 text-primary' : '',
                        state === 'todo' ? 'border-border' : '',
                      ].join(' ')}
                    >
                      {state === 'done' ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className="truncate">{t(`creator.installer.steps.${key}`)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Isi langkah */}
        <section className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-background p-5 sm:p-6" data-testid={`wizard-step-${step}`}>
          <header className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t('creator.installer.stepOf', { current: stepIndex + 1, total: STEPS.length })}
            </span>
            <h2 className="text-lg font-semibold text-foreground">{t(`creator.installer.${step}.title`)}</h2>
            <p className="text-sm text-muted-foreground">{t(`creator.installer.${step}.desc`)}</p>
          </header>

          {step === 'identity' && (
            <div className="flex flex-col stack-gap">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">{t('creator.installer.identity.nameLabel')}</label>
                  <InputField
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    placeholder={t('creator.installer.identity.namePlaceholder')}
                    error={nameError ?? undefined}
                    data-testid="project-name-input"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">{t('creator.installer.identity.slugLabel')}</label>
                  <InputField value={projectSlug} readOnly disabled data-testid="project-slug-preview" />
                </div>
              </div>

              <div className="flex flex-col stack-gap rounded-xl border border-border p-4">
                {sectionTitle('creator.installer.identity.brandTitle')}
                <div>
                  <span className="mb-1.5 block text-xs font-semibold text-foreground">{t('creator.installer.identity.logoLabel')}</span>
                  <FileUpload
                    size="sm"
                    accept={BRAND_ACCEPT}
                    value={logoFile}
                    error={logoError ?? undefined}
                    supportingText={t('creator.installer.identity.logoSupporting')}
                    onChange={(files) => pickBrand(files, { file: setLogoFile, preview: setLogoPreview, error: setLogoError }, logoPreview)}
                    testId="brand-logo-upload"
                  />
                </div>
                <div className="flex flex-col field-gap">
                  <span className="text-xs font-semibold text-foreground">{t('creator.installer.identity.collapsedTitle')}</span>
                  <RadioButtonGroup
                    direction="vertical"
                    value={collapsedMode}
                    onChange={(v) => setCollapsedMode(v as CollapsedMode)}
                    options={[
                      { value: 'initial', label: t('creator.installer.identity.collapsedInitial') },
                      { value: 'upload', label: t('creator.installer.identity.collapsedUpload') },
                    ]}
                    testId="collapsed-mode"
                  />
                  {collapsedMode === 'upload' && (
                    <FileUpload
                      size="sm"
                      accept={BRAND_ACCEPT}
                      value={collapsedFile}
                      error={collapsedError ?? undefined}
                      supportingText={t('creator.installer.identity.collapsedSupporting')}
                      onChange={(files) =>
                        pickBrand(files, { file: setCollapsedFile, preview: setCollapsedPreview, error: setCollapsedError }, collapsedPreview)
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
            </div>
          )}

          {step === 'style' && (
            <div className="flex flex-col stack-gap">
              <div className="flex flex-col gap-2" data-testid="ui-style-picker">
                <span className="text-xs font-semibold text-foreground">{t('creator.installer.style.styleLabel')}</span>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5" role="radiogroup" aria-label={t('creator.installer.style.styleLabel')}>
                  {UI_STYLE_OPTIONS.map((option) => {
                    const selected = uiStyle === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-disabled={!option.ready}
                        disabled={!option.ready}
                        onClick={() => option.ready && setUiStyle(option.id)}
                        data-testid={`ui-style-${option.id}`}
                        className={[
                          'relative flex flex-col gap-2 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                          option.ready ? 'cursor-pointer hover:border-primary' : 'cursor-not-allowed opacity-60',
                          selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background',
                        ].join(' ')}
                      >
                        <StylePreview style={option.id} screen="list" mode={themeMode} primaryColor={primaryColor} className="rounded-md border border-border" />
                        <span className="text-xs font-semibold text-foreground">{t(`creator.installer.style.styles.${option.id}.name`)}</span>
                        <span className="text-[11px] leading-snug text-muted-foreground">{t(`creator.installer.style.styles.${option.id}.desc`)}</span>
                        {(!option.ready || option.id === 'classic') && (
                          <span className="absolute right-3 top-3">
                            <Badge variant={option.ready ? 'primary' : 'neutral'} size="sm">
                              {t(option.ready ? 'creator.installer.style.official' : 'creator.installer.style.comingSoon')}
                            </Badge>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(['login', 'forgot', 'list'] as PreviewScreen[]).map((screen) => (
                    <div key={screen} className="flex flex-col gap-1">
                      <StylePreview style={uiStyle} screen={screen} mode={themeMode} primaryColor={primaryColor} className="rounded-md border border-border" />
                      <span className="text-[11px] text-muted-foreground">{t(`creator.installer.style.screens.${screen}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-foreground">{t('creator.installer.style.modeLabel')}</span>
                <div>
                  <SegmentedControl
                    size="sm"
                    aria-label={t('creator.installer.style.modeLabel')}
                    value={themeMode}
                    onChange={(v) => setThemeMode(v as ProjectThemeMode)}
                    options={[
                      { value: 'light', label: t('creator.installer.style.modeLight') },
                      { value: 'dark', label: t('creator.installer.style.modeDark') },
                    ]}
                    testId="theme-mode"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">{t('creator.installer.style.colorLabel')}</span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('creator.installer.style.colorLabel')}>
                  {PRIMARY_PRESETS.map((preset) => swatch(preset.id, preset.color, preset.id === 'default' ? t('creator.installer.style.colorDefault') : preset.color))}
                  {swatch('custom', customColorValid ? customColor : '', t('creator.installer.style.colorCustom'))}
                </div>
                {colorChoice === 'custom' && (
                  <div className="max-w-xs">
                    <InputField
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      aria-label={t('creator.installer.style.colorCustom')}
                      placeholder="#00487a"
                      error={customColorValid ? undefined : t('creator.installer.style.colorInvalid')}
                      data-testid="theme-color-hex"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'modules' && (
            <div className="flex flex-col stack-gap" data-testid="module-cards">
              {MODULE_GROUPS.map((group) => (
                <div key={group} className="flex flex-col gap-2">
                  {sectionTitle(`creator.installer.modules.groups.${group}`)}
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {MODULE_CARDS.filter((card) => card.group === group).map((card) => {
                      const on = card.ready && (card.locked || selectedCards.includes(card.id));
                      return (
                        <button
                          key={card.id}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          aria-disabled={!card.ready || card.locked}
                          disabled={!card.ready}
                          onClick={() => card.ready && !card.locked && toggleCard(card.id)}
                          data-testid={`module-card-${card.id}`}
                          className={[
                            'relative flex flex-col gap-2 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                            card.ready && !card.locked ? 'cursor-pointer hover:border-primary' : 'cursor-default',
                            !card.ready ? 'opacity-60' : '',
                            on ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background',
                          ].join(' ')}
                        >
                          <StylePreview style={uiStyle} screen={card.thumb} mode={themeMode} primaryColor={primaryColor} className="rounded-md border border-border" />
                          <span className="text-sm font-semibold text-foreground">{t(`creator.installer.modules.cards.${card.id}.name`)}</span>
                          <span className="text-xs leading-snug text-muted-foreground">{t(`creator.installer.modules.cards.${card.id}.desc`)}</span>
                          <span className="absolute right-3 top-3">
                            {!card.ready ? (
                              <Badge variant="neutral" size="sm">{t('creator.installer.modules.comingSoon')}</Badge>
                            ) : card.locked ? (
                              <Badge variant="neutral" size="sm">{t('creator.installer.modules.required')}</Badge>
                            ) : on ? (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 'review' && (
            <div className="flex flex-col" data-testid="review-summary">
              {summaryRow(t('creator.installer.review.project'), `${projectName} (${projectSlug})`)}
              {summaryRow(
                t('creator.installer.review.logo'),
                logoFile ? logoFile.name : t('creator.installer.review.noLogo'),
              )}
              {summaryRow(
                t('creator.installer.review.collapsed'),
                collapsedMode === 'upload' && collapsedFile
                  ? t('creator.installer.review.collapsedIcon', { name: collapsedFile.name })
                  : t('creator.installer.review.collapsedInitial'),
              )}
              {summaryRow(
                t('creator.installer.review.style'),
                `${styleName} · ${t('creator.installer.review.theme', { mode: modeLabel, color: primaryColor || t('creator.installer.style.colorDefault') })}`,
              )}
              {summaryRow(
                t('creator.installer.review.modules'),
                activeCards.map((card) => t(`creator.installer.modules.cards.${card.id}.name`)).join(', '),
              )}
              {summaryRow(t('creator.installer.review.runtime'), t('creator.installer.review.runtimeValue'))}
            </div>
          )}

          {step === 'install' && (
            <div className="flex flex-col gap-3" data-testid="install-progress">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <ul className="min-h-40 rounded-lg bg-surface p-3 font-mono text-xs text-foreground" aria-live="polite">
                {log.map((line, index) => (
                  <li key={`${index}-${line}`} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-success" />
                    {line}
                  </li>
                ))}
              </ul>
              {installError && (
                <Alert variant="error" message={t('creator.installer.install.error', { message: installError })} />
              )}
              {installError && (
                <div className="flex gap-2">
                  <Button hierarchy="secondary" onClick={() => setStepIndex(3)} testId="install-back-btn">
                    {t('creator.installer.back')}
                  </Button>
                  <Button onClick={() => void runInstall()} testId="install-retry-btn">
                    {t('creator.installer.install.retry')}
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'finish' && built && (
            <div className="flex flex-col stack-gap" data-testid="finish-panel">
              <Alert variant="success" message={t('creator.installer.finish.ready', { fileName: built.fileName, count: built.fileCount })} />

              {/* Alamat Live Project: localhost:port/:slug/live atau domain.com/:slug/live */}
              <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4" data-testid="live-url-panel">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-base">
                      {t('creator.installer.finish.live.title')}
                    </span>
                    <Badge variant="primary" size="sm">
                      {t('creator.installer.finish.live.badge')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('creator.installer.finish.live.desc')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 flex items-center rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-primary overflow-x-auto select-all">
                    <span>{`${window.location.origin}/${projectSlug}/live${primaryColor ? `?color=${encodeURIComponent(primaryColor)}` : ''}`}</span>
                  </div>
                  <Button
                    size="md"
                    hierarchy="primary"
                    onClick={() => window.open(`/${projectSlug}/live${primaryColor ? `?color=${encodeURIComponent(primaryColor)}` : ''}`, '_blank')}
                    testId="open-live-url-btn"
                  >
                    {t('creator.installer.finish.live.open')}
                  </Button>
                  <Button
                    size="md"
                    hierarchy="secondary"
                    onClick={() => {
                      void navigator.clipboard.writeText(`${window.location.origin}/${projectSlug}/live${primaryColor ? `?color=${encodeURIComponent(primaryColor)}` : ''}`);
                      toast.showToast({ variant: 'success', message: t('creator.installer.finish.live.copied') });
                    }}
                    testId="copy-live-url-btn"
                  >
                    {t('creator.installer.finish.live.copy')}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {sectionTitle('creator.installer.finish.quickStart')}
                <pre className="overflow-x-auto rounded-lg bg-surface p-3 font-mono text-xs text-foreground">
                  {`unzip ${built.fileName}\ncd ${projectSlug}\nnvm use   # Node ${NODE_MAJOR} (.nvmrc)\ncp .env.example .env\nnpm install\nnpm run dev`}
                </pre>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-border p-4" data-testid="local-run-panel">
                {sectionTitle('creator.installer.finish.local.title')}
                {!localRunAvailable() ? (
                  <p className="text-sm text-muted-foreground">{t('creator.installer.finish.local.unavailable')}</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">{t('creator.installer.finish.local.intro')}</p>
                    {localRun.status === 'running' && localRun.result ? (
                      <div className="flex flex-col gap-2">
                        <a
                          href={localRun.result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-fit font-mono text-sm font-medium text-primary hover:underline"
                          data-testid="local-run-url"
                        >
                          {localRun.result.url}
                        </a>
                        <p className="text-xs text-muted-foreground">{t('creator.installer.finish.local.note')}</p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => window.open(localRun.result?.url, '_blank', 'noopener,noreferrer')} testId="local-run-open-btn">
                            {t('creator.installer.finish.local.open')}
                          </Button>
                          <Button size="sm" hierarchy="secondary" onClick={handleStopLocal} testId="local-run-stop-btn">
                            {t('creator.installer.finish.local.stop')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Button hierarchy="secondary" disabled={localRun.status === 'starting'} onClick={() => void handleRunLocal()} testId="local-run-btn">
                          {t(localRun.status === 'starting' ? 'creator.installer.finish.local.starting' : 'creator.installer.finish.local.run')}
                        </Button>
                      </div>
                    )}
                    {localRun.status === 'error' && (
                      <Alert variant="error" message={t('creator.installer.finish.local.error', { message: localRun.error ?? '' })} />
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="lg" leadingIcon={<Download className="h-5 w-5" />} onClick={handleDownload} testId="download-project-zip-btn">
                  {t('creator.installer.finish.download')}
                </Button>
                <Button size="lg" hierarchy="secondary" onClick={startOver} testId="start-over-btn">
                  {t('creator.installer.startOver')}
                </Button>
              </div>
            </div>
          )}

          {step !== 'install' && step !== 'finish' && (
            <footer className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
              <Button
                hierarchy="secondary"
                leadingIcon={<AltArrowLeft className="h-4 w-4" />}
                disabled={stepIndex === 0}
                onClick={() => goTo(stepIndex - 1)}
                testId="wizard-prev-btn"
              >
                {t('creator.installer.back')}
              </Button>
              {step === 'modules' && (
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {t('creator.installer.modules.count', { count: activeCards.length })}
                </span>
              )}
              {step === 'review' ? (
                <Button leadingIcon={<Download className="h-4 w-4" />} onClick={() => void runInstall()} testId="wizard-install-btn">
                  {t('creator.installer.install')}
                </Button>
              ) : (
                <Button trailingIcon={<AltArrowRight className="h-4 w-4" />} onClick={() => goTo(stepIndex + 1)} testId="wizard-next-btn">
                  {t('creator.installer.next')}
                </Button>
              )}
            </footer>
          )}
        </section>
      </div>
    </div>
  );
}

export default CreateProjectPage;
