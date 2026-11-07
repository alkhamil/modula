import { useState, type FormEvent } from 'react';
import { Dialog, Button, InputField, Alert } from '../../../shared/components/ui';
import { createWorkspaceProject } from '../workspaceApi';
import type { WorkspaceProject } from '../types';

const COLOR_PRESETS = [
  { label: 'Classic Navy', hex: '#00487a' },
  { label: 'Teal Emerald', hex: '#0f766e' },
  { label: 'Royal Indigo', hex: '#4338ca' },
  { label: 'Burgundy Crimson', hex: '#a01713' },
  { label: 'Enterprise Blue', hex: '#2563eb' },
  { label: 'Modern Amber', hex: '#d97706' },
];

interface QuickCreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (project: WorkspaceProject) => void;
}

export default function QuickCreateProjectDialog({
  open,
  onClose,
  onSuccess,
}: QuickCreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#00487a');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama proyek wajib diisi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await createWorkspaceProject({
        name: name.trim(),
        slug,
        description: description.trim(),
        primaryColor,
        theme: 'light',
        selectedPacks: ['login', 'user', 'role', 'generator'],
      });
      onSuccess(created);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat proyek');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Buat Proyek Mockup Baru"
      description="Inisialisasi workspace mockup aplikasi CMS baru dengan standar komponen WDS."
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button hierarchy="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? 'Memproses...' : 'Buat Proyek'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
        {error && <Alert variant="error" message={error} />}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">Nama Proyek</label>
          <InputField
            placeholder="Contoh: Procurement & Vendor Portal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          {slug && (
            <span className="text-[11px] text-muted-foreground font-mono">
              Slug URL: <strong>{slug}</strong>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">Deskripsi Singkat</label>
          <InputField
            placeholder="Tujuan aplikasi, cakupan modul master data / transaksi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">Warna Brand Utama (Primary Color)</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {COLOR_PRESETS.map((p) => {
              const active = primaryColor.toLowerCase() === p.hex.toLowerCase();
              return (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => setPrimaryColor(p.hex)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all ${
                    active ? 'border-primary ring-2 ring-primary/40 bg-surface' : 'border-border hover:border-border/80'
                  }`}
                >
                  <span className="h-6 w-6 rounded-full shadow-inner" style={{ backgroundColor: p.hex }} />
                  <span className="text-[10px] font-medium text-foreground truncate w-full">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
