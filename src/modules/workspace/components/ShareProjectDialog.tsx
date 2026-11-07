import { useState, type FormEvent } from 'react';
import { Dialog, Button, InputField, Select, Badge, Alert } from '../../../shared/components/ui';
import { shareWorkspaceProject } from '../workspaceApi';
import type { WorkspaceProject } from '../types';

interface ShareProjectDialogProps {
  project: WorkspaceProject | null;
  onClose: () => void;
  onUpdated: (project: WorkspaceProject) => void;
}

export default function ShareProjectDialog({ project, onClose, onUpdated }: ShareProjectDialogProps) {
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'EDITOR' | 'VIEWER'>('EDITOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  async function handleShare(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !project) return;

    setLoading(true);
    setError(null);

    try {
      const updated = await shareWorkspaceProject(project.slug, email.trim(), accessLevel);
      onUpdated(updated);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membagikan proyek');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      title={`Bagikan Akses: ${project.name}`}
      description="Undang anggota tim internal (BPA, Presales, UI/UX, Developer, QA) untuk berkolaborasi."
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button hierarchy="secondary" onClick={onClose}>
            Selesai
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-2">
        {error && <Alert variant="error" message={error} />}

        {/* Form Tambah Anggota */}
        <form onSubmit={handleShare} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 rounded-xl border border-border bg-surface p-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Alamat Email Tim</label>
            <InputField
              type="email"
              placeholder="bpa@modula.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full sm:w-36 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Hak Akses</label>
            <Select
              value={accessLevel}
              onChange={(v) => setAccessLevel(v as 'EDITOR' | 'VIEWER')}
              options={[
                { label: 'Editor (Bisa Edit)', value: 'EDITOR' },
                { label: 'Viewer (Lihat Saja)', value: 'VIEWER' },
              ]}
            />
          </div>

          <Button type="submit" disabled={loading || !email.trim()}>
            {loading ? 'Menambahkan...' : 'Undang'}
          </Button>
        </form>

        {/* Daftar Anggota Saat Ini */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground">Anggota Kolaborator Proyek:</span>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {/* Owner */}
            <div className="flex items-center justify-between p-3 text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{project.ownerName}</span>
                <span className="text-muted-foreground">{project.ownerEmail}</span>
              </div>
              <Badge variant="primary" size="sm">
                OWNER
              </Badge>
            </div>

            {/* Members */}
            {project.members.map((m) => (
              <div key={m.email} className="flex items-center justify-between p-3 text-xs">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{m.name || m.email}</span>
                  <span className="text-muted-foreground">{m.email}</span>
                </div>
                <Badge variant={m.accessLevel === 'EDITOR' ? 'info' : 'neutral'} size="sm">
                  {m.accessLevel}
                </Badge>
              </div>
            ))}

            {project.members.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Belum ada anggota lain yang diundang ke proyek ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
