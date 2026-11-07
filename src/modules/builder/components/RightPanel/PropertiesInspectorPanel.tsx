import { useState } from 'react';
import type {
  CanvasComponentNode,
  ProjectPageDefinition,
  PageType,
} from '../../types';
import {
  Button,
  InputField,
  Textarea,
  Toggle,
  Badge,
} from '../../../../shared/components/ui';
import {
  TrashBinTrash,
  WdsIcon,
} from '../../../../shared/components/icons';

interface PropertiesInspectorPanelProps {
  selectedNode: CanvasComponentNode | null;
  activePage: ProjectPageDefinition;
  pages: ProjectPageDefinition[];
  onUpdateComponent: (id: string, updates: Partial<CanvasComponentNode>) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onDeselect: () => void;
  onUpdatePage: (id: string, updates: Partial<ProjectPageDefinition>) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
}

export default function PropertiesInspectorPanel({
  selectedNode,
  activePage,
  pages,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onDeselect,
  onUpdatePage,
  onDeletePage,
  onDuplicatePage,
}: PropertiesInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'props' | 'validation' | 'actions'>('props');

  // If no node is selected, show Page Settings
  if (!selectedNode) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card shadow-xs">
        <div className="flex items-center justify-between border-b border-border p-4 bg-surface/30">
          <div className="flex items-center gap-2">
            <WdsIcon name="DocumentText" className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Pengaturan Halaman
            </h3>
          </div>
          <Badge variant="primary" size="xs">
            {activePage.type}
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">Judul Halaman</label>
            <InputField
              value={activePage.title}
              onChange={(e) => onUpdatePage(activePage.id, { title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">Path URL</label>
            <InputField
              value={activePage.path}
              onChange={(e) => onUpdatePage(activePage.id, { path: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">Page Key</label>
            <InputField
              value={activePage.key}
              onChange={(e) => onUpdatePage(activePage.id, { key: e.target.value })}
              hint="Kunci unik internal untuk referensi antar halaman"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Tipe Halaman</label>
            <div className="grid grid-cols-2 gap-2">
              {(['LIST', 'FORM', 'DETAIL', 'DASHBOARD', 'CUSTOM'] as PageType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdatePage(activePage.id, { type: t })}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    activePage.type === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-surface'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Button
              hierarchy="secondary"
              size="sm"
              leadingIcon={<WdsIcon name="Copy" className="h-3.5 w-3.5" />}
              onClick={() => onDuplicatePage(activePage.id)}
            >
              Duplikat Halaman Ini
            </Button>

            {pages.length > 1 && (
              <Button
                hierarchy="secondary"
                destructive
                size="sm"
                leadingIcon={<TrashBinTrash className="h-3.5 w-3.5" />}
                onClick={() => {
                  if (confirm(`Hapus halaman "${activePage.title}"?`)) {
                    onDeletePage(activePage.id);
                  }
                }}
              >
                Hapus Halaman Ini
              </Button>
            )}
          </div>
        </div>
      </aside>
    );
  }

  // Component Selected Inspector
  const props = selectedNode.props || {};
  const validation = selectedNode.validation || {};
  const actions = selectedNode.actions || {};

  const handlePropChange = (key: string, value: any) => {
    onUpdateComponent(selectedNode.id, {
      props: {
        ...props,
        [key]: value,
      },
    });
  };

  const handleValidationChange = (key: string, value: any) => {
    onUpdateComponent(selectedNode.id, {
      validation: {
        ...validation,
        [key]: value,
      },
    });
  };

  const handleActionChange = (key: string, value: any) => {
    onUpdateComponent(selectedNode.id, {
      actions: {
        ...actions,
        [key]: value,
      },
    });
  };

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card shadow-xs">
      {/* Component Header */}
      <div className="flex items-center justify-between border-b border-border p-3 bg-surface/30">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="primary" size="xs">
            {selectedNode.type}
          </Badge>
          <span className="truncate text-xs font-bold text-foreground">
            {selectedNode.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Duplikat Elemen"
            onClick={() => onDuplicateComponent(selectedNode.id)}
            className="rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <WdsIcon name="Copy" className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Hapus Elemen"
            onClick={() => onDeleteComponent(selectedNode.id)}
            className="rounded p-1 text-destructive hover:bg-destructive/10"
          >
            <TrashBinTrash className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Tutup Inspector"
            onClick={onDeselect}
            className="rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground text-xs font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-border bg-surface/50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('props')}
          className={`rounded-md py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'props'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Props
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('validation')}
          className={`rounded-md py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'validation'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Validasi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('actions')}
          className={`rounded-md py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'actions'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Aksi
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {activeTab === 'props' && (
          <div className="flex flex-col gap-3">
            {/* Component Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Nama Elemen (Internal)</label>
              <InputField
                value={selectedNode.name}
                onChange={(e) => onUpdateComponent(selectedNode.id, { name: e.target.value })}
              />
            </div>

            {/* Label or Title Prop */}
            {(props.label !== undefined || props.title !== undefined) && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">
                  {props.label !== undefined ? 'Label Teks' : 'Judul (Title)'}
                </label>
                <InputField
                  value={props.label !== undefined ? props.label : props.title}
                  onChange={(e) =>
                    handlePropChange(props.label !== undefined ? 'label' : 'title', e.target.value)
                  }
                />
              </div>
            )}

            {/* Subtitle / Description / HelperText */}
            {props.subtitle !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Subjudul</label>
                <InputField
                  value={props.subtitle}
                  onChange={(e) => handlePropChange('subtitle', e.target.value)}
                />
              </div>
            )}
            {props.description !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Deskripsi</label>
                <InputField
                  value={props.description}
                  onChange={(e) => handlePropChange('description', e.target.value)}
                />
              </div>
            )}
            {props.helperText !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Bantuan (Helper Text)</label>
                <InputField
                  value={props.helperText}
                  onChange={(e) => handlePropChange('helperText', e.target.value)}
                />
              </div>
            )}

            {/* Placeholder */}
            {props.placeholder !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Placeholder</label>
                <InputField
                  value={props.placeholder}
                  onChange={(e) => handlePropChange('placeholder', e.target.value)}
                />
              </div>
            )}

            {/* Message for Alert */}
            {props.message !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Pesan Notifikasi</label>
                <Textarea
                  value={props.message}
                  onChange={(e) => handlePropChange('message', e.target.value)}
                />
              </div>
            )}

            {/* Column Span (12, 6, 4, 3) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Lebar Kolom (Grid Span)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { span: 12, label: 'Penuh (12)' },
                  { span: 6, label: '1/2 (6)' },
                  { span: 4, label: '1/3 (4)' },
                  { span: 3, label: '1/4 (3)' },
                ].map((item) => (
                  <button
                    key={item.span}
                    type="button"
                    onClick={() => handlePropChange('colSpan', item.span)}
                    className={`rounded-lg border px-1.5 py-1 text-center text-xs font-semibold transition-all ${
                      (props.colSpan ?? 12) === item.span
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-surface'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hierarchy / Variant if applicable */}
            {props.hierarchy !== undefined && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Hierarki Tombol</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['primary', 'secondary', 'tertiary', 'destructive'] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handlePropChange('hierarchy', h)}
                      className={`rounded-lg border px-2 py-1 text-xs capitalize font-semibold transition-all ${
                        props.hierarchy === h
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-surface'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {props.variant !== undefined && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Varian Warna</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['info', 'success', 'warning', 'danger', 'primary', 'neutral'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handlePropChange('variant', v)}
                      className={`rounded-lg border px-2 py-1 text-xs capitalize font-semibold transition-all ${
                        props.variant === v
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-surface'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metric Card Specific Props */}
            {selectedNode.type === 'metric-card' && (
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface/30 p-3">
                <span className="text-xs font-bold text-foreground">Konfigurasi KPI</span>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Nilai Angka / Value</label>
                  <InputField
                    value={props.value || ''}
                    onChange={(e) => handlePropChange('value', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Perubahan (% / Delta)</label>
                  <InputField
                    value={props.change || ''}
                    onChange={(e) => handlePropChange('change', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Periode Keterangan</label>
                  <InputField
                    value={props.period || ''}
                    onChange={(e) => handlePropChange('period', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground font-semibold">Tren:</span>
                  {(['up', 'down', 'neutral'] as const).map((tr) => (
                    <button
                      key={tr}
                      type="button"
                      onClick={() => handlePropChange('trend', tr)}
                      className={`rounded-md border px-2 py-0.5 text-xs capitalize ${
                        props.trend === tr
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {tr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle / States */}
            {props.required !== undefined && (
              <Toggle
                switchLabel="Mandatori (Wajib Diisi)"
                value={Boolean(props.required)}
                onChange={(val) => handlePropChange('required', val)}
              />
            )}
            {props.disabled !== undefined && (
              <Toggle
                switchLabel="Nonaktifkan (Disabled)"
                value={Boolean(props.disabled)}
                onChange={(val) => handlePropChange('disabled', val)}
              />
            )}
            {props.checked !== undefined && (
              <Toggle
                switchLabel="Default Terpilih / Aktif"
                value={Boolean(props.checked)}
                onChange={(val) => handlePropChange('checked', val)}
              />
            )}
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="flex flex-col gap-3">
            <Toggle
              switchLabel="Wajib Diisi (Mandatory)"
              value={Boolean(validation.required)}
              onChange={(val) => handleValidationChange('required', val)}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Panjang Minimum (Min Length)</label>
              <InputField
                type="number"
                value={validation.minLength ?? ''}
                onChange={(e) =>
                  handleValidationChange(
                    'minLength',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Panjang Maksimum (Max Length)</label>
              <InputField
                type="number"
                value={validation.maxLength ?? ''}
                onChange={(e) =>
                  handleValidationChange(
                    'maxLength',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Pola Regex (Pattern)</label>
              <InputField
                placeholder="e.g. ^[0-9]+$"
                value={validation.pattern ?? ''}
                onChange={(e) => handleValidationChange('pattern', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Pesan Error Kustom</label>
              <InputField
                placeholder="Field ini wajib diisi dengan benar"
                value={validation.errorMessage ?? ''}
                onChange={(e) => handleValidationChange('errorMessage', e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Aksi Saat Diklik (OnClick)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'none', label: 'Tidak Ada' },
                  { id: 'navigate', label: 'Pindah Halaman' },
                  { id: 'toast', label: 'Notifikasi Toast' },
                  { id: 'submit-form', label: 'Submit Formulir' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleActionChange('onClick', act.id)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                      (actions.onClick || 'none') === act.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-surface'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {actions.onClick === 'navigate' && (
              <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
                <label className="text-xs font-semibold text-foreground">
                  Pilih Halaman Target
                </label>
                <div className="flex flex-col gap-1.5">
                  {pages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleActionChange('targetPageKey', p.key)}
                      className={`flex items-center justify-between rounded-lg border p-2 text-xs transition-all ${
                        actions.targetPageKey === p.key
                          ? 'border-primary bg-primary text-primary-foreground font-semibold'
                          : 'border-border bg-card text-foreground hover:bg-surface'
                      }`}
                    >
                      <span className="truncate">{p.title}</span>
                      <span className="font-mono text-[10px] opacity-80">{p.path}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {actions.onClick === 'toast' && (
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface/30 p-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">Pesan Notifikasi Toast</label>
                  <InputField
                    placeholder="Data berhasil diproses..."
                    value={actions.toastMessage || ''}
                    onChange={(e) => handleActionChange('toastMessage', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Tipe Toast</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['success', 'info', 'warning', 'danger'] as const).map((tt) => (
                      <button
                        key={tt}
                        type="button"
                        onClick={() => handleActionChange('toastType', tt)}
                        className={`rounded-lg border px-2 py-1 text-xs capitalize font-semibold transition-all ${
                          (actions.toastType || 'success') === tt
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:bg-surface'
                        }`}
                      >
                        {tt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
