import { useState } from 'react';
import type { ProjectPageDefinition, PageType } from '../../types';
import { Button, InputField, Badge, Dialog } from '../../../../shared/components/ui';
import {
  Plus,
  TrashBinTrash,
  Pen2,
  WdsIcon,
} from '../../../../shared/components/icons';
import { COMPONENT_CATALOG } from '../../componentRegistry';

interface PageManagerPanelProps {
  pages: ProjectPageDefinition[];
  activePageId: string;
  projectSlug: string;
  onSelectPage: (id: string) => void;
  onAddPage: (page: Partial<ProjectPageDefinition>) => void;
  onUpdatePage: (id: string, updates: Partial<ProjectPageDefinition>) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
}

const PAGE_TYPE_BADGES: Record<PageType, { label: string; variant: 'primary' | 'success' | 'info' | 'warning' | 'neutral' }> = {
  LIST: { label: 'Tabel Data', variant: 'primary' },
  FORM: { label: 'Formulir', variant: 'success' },
  DETAIL: { label: 'Detail', variant: 'info' },
  DASHBOARD: { label: 'Dashboard', variant: 'warning' },
  CUSTOM: { label: 'Custom', variant: 'neutral' },
};

export default function PageManagerPanel({
  pages,
  activePageId,
  projectSlug,
  onSelectPage,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onDuplicatePage,
}: PageManagerPanelProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // New Page Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<PageType>('LIST');
  const [newPath, setNewPath] = useState('');

  // Edit Page Form State
  const [editTitle, setEditTitle] = useState('');
  const [editPath, setEditPath] = useState('');

  const openAddDialog = () => {
    setNewTitle('Halaman Baru');
    setNewType('LIST');
    setNewPath(`/${projectSlug}/page-${Date.now().toString(36)}`);
    setIsAddOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setNewPath(`/${projectSlug}/${slugified || 'page'}`);
  };

  const handleCreatePage = () => {
    if (!newTitle.trim()) return;

    // Pre-populate components based on chosen type
    const initialComponents = [];
    if (newType === 'LIST') {
      const tableItem = COMPONENT_CATALOG.find((c) => c.type === 'data-table');
      const btnItem = COMPONENT_CATALOG.find((c) => c.type === 'button');
      if (btnItem) {
        initialComponents.push({
          id: `comp-${Date.now().toString(36)}-1`,
          type: 'button',
          category: 'action' as const,
          name: 'Tombol Tambah',
          props: { ...btnItem.defaultProps, label: '+ Tambah Data Baru' },
        });
      }
      if (tableItem) {
        initialComponents.push({
          id: `comp-${Date.now().toString(36)}-2`,
          type: 'data-table',
          category: 'data' as const,
          name: 'Tabel Data',
          props: { ...tableItem.defaultProps, title: `Data ${newTitle}` },
        });
      }
    } else if (newType === 'FORM') {
      const cardItem = COMPONENT_CATALOG.find((c) => c.type === 'card');
      const inputItem = COMPONENT_CATALOG.find((c) => c.type === 'input-field');
      const btnItem = COMPONENT_CATALOG.find((c) => c.type === 'button');
      if (cardItem && inputItem) {
        initialComponents.push({
          id: `comp-${Date.now().toString(36)}-card`,
          type: 'card',
          category: 'layout' as const,
          name: 'Card Formulir',
          props: { ...cardItem.defaultProps, title: `Formulir ${newTitle}` },
          children: [
            {
              id: `comp-${Date.now().toString(36)}-inp1`,
              type: 'input-field',
              category: 'form' as const,
              name: 'Field Input 1',
              props: { ...inputItem.defaultProps, label: 'Nama Lengkap' },
            },
          ],
        });
      }
      if (btnItem) {
        initialComponents.push({
          id: `comp-${Date.now().toString(36)}-btn`,
          type: 'button',
          category: 'action' as const,
          name: 'Tombol Simpan',
          props: { ...btnItem.defaultProps, label: 'Simpan Formulir' },
        });
      }
    } else if (newType === 'DASHBOARD') {
      const metricItem = COMPONENT_CATALOG.find((c) => c.type === 'metric-card');
      if (metricItem) {
        initialComponents.push({
          id: `comp-${Date.now().toString(36)}-m1`,
          type: 'metric-card',
          category: 'data' as const,
          name: 'Metric 1',
          props: { ...metricItem.defaultProps, title: 'Total Volume', value: '1.450' },
        });
        initialComponents.push({
          id: `comp-${Date.now().toString(36)}-m2`,
          type: 'metric-card',
          category: 'data' as const,
          name: 'Metric 2',
          props: { ...metricItem.defaultProps, title: 'Rata-rata SLA', value: '98.5%' },
        });
      }
    }

    onAddPage({
      title: newTitle.trim(),
      type: newType,
      path: newPath.trim(),
      key: newPath.replace(`/${projectSlug}/`, '').replace(/[^a-z0-9]/g, '-'),
      components: initialComponents,
    });

    setIsAddOpen(false);
  };

  const startEdit = (p: ProjectPageDefinition, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPageId(p.id);
    setEditTitle(p.title);
    setEditPath(p.path);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdatePage(id, {
      title: editTitle.trim(),
      path: editPath.trim(),
    });
    setEditingPageId(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Daftar Halaman ({pages.length})
          </h4>
        </div>
        <Button
          size="sm"
          hierarchy="primary"
          leadingIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={openAddDialog}
        >
          Halaman Baru
        </Button>
      </div>

      {/* Pages List */}
      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
        {pages.map((p) => {
          const isActive = p.id === activePageId;
          const badge = PAGE_TYPE_BADGES[p.type] || PAGE_TYPE_BADGES.CUSTOM;
          const isEditing = editingPageId === p.id;

          if (isEditing) {
            return (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded-xl border border-primary/50 bg-primary/5 p-3"
              >
                <div className="text-xs font-semibold text-foreground">Edit Metadata Halaman</div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Judul Halaman</label>
                  <InputField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Path URL</label>
                  <InputField
                    value={editPath}
                    onChange={(e) => setEditPath(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <Button
                    size="sm"
                    hierarchy="secondary"
                    onClick={() => setEditingPageId(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    size="sm"
                    hierarchy="primary"
                    onClick={() => saveEdit(p.id)}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={p.id}
              onClick={() => onSelectPage(p.id)}
              className={`group flex flex-col gap-1 rounded-xl border p-3 cursor-pointer transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 shadow-xs'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-surface'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <WdsIcon
                    name="DocumentText"
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <span
                    className={`truncate text-xs font-semibold ${
                      isActive ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    {p.title}
                  </span>
                </div>
                <Badge variant={badge.variant} size="xs">
                  {badge.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-6">
                <span className="font-mono truncate">{p.path}</span>
                <span className="shrink-0 text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border">
                  {p.components?.length || 0} elemen
                </span>
              </div>

              {/* Hover Actions */}
              <div className="flex items-center justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Edit Nama / Path"
                  onClick={(e) => startEdit(p, e)}
                  className="rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  <Pen2 className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  title="Duplikat Halaman"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicatePage(p.id);
                  }}
                  className="rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  <WdsIcon name="Copy" className="h-3 w-3" />
                </button>
                {pages.length > 1 && (
                  <button
                    type="button"
                    title="Hapus Halaman"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus halaman "${p.title}"?`)) {
                        onDeletePage(p.id);
                      }
                    }}
                    className="rounded p-1 text-destructive hover:bg-destructive/10"
                  >
                    <TrashBinTrash className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Page Dialog */}
      <Dialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Halaman Baru"
        description="Pilih template dan tipe halaman untuk memulai visual building."
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Judul Halaman <span className="text-destructive">*</span>
            </label>
            <InputField
              placeholder="Contoh: Daftar Pelanggan"
              value={newTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Tipe & Template Halaman</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { type: 'LIST', title: 'Tabel Master (LIST)', desc: 'Tabel data, filter, pagination' },
                  { type: 'FORM', title: 'Formulir Input (FORM)', desc: 'Field input, validasi, submit' },
                  { type: 'DASHBOARD', title: 'Dashboard (KPI)', desc: 'Statistik metric cards & status' },
                  { type: 'CUSTOM', title: 'Kanvas Bebas', desc: 'Mulai dari halaman kosong' },
                ] as const
              ).map((item) => (
                <div
                  key={item.type}
                  onClick={() => setNewType(item.type)}
                  className={`flex flex-col gap-1 rounded-xl border p-3 cursor-pointer transition-all ${
                    newType === item.type
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <span className="text-xs font-bold text-foreground">{item.title}</span>
                  <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Path URL / Route <span className="text-destructive">*</span>
            </label>
            <InputField
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              hint="Rute URL untuk halaman ini di dalam proyek"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button hierarchy="secondary" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button hierarchy="primary" onClick={handleCreatePage} disabled={!newTitle.trim()}>
              Buat Halaman
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
