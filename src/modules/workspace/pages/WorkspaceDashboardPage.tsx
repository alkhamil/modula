import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, Badge, InputField, Dialog } from '../../../shared/components/ui';
import { AddCircle, TrashBinTrash, UsersGroupRounded, Pen2 } from '../../../shared/components/icons';
import { useAuth } from '../../../app/providers/useAuth';
import { fetchWorkspaceProjects, deleteWorkspaceProject } from '../workspaceApi';
import type { WorkspaceProject } from '../types';
import QuickCreateProjectDialog from '../components/QuickCreateProjectDialog';
import ShareProjectDialog from '../components/ShareProjectDialog';

export default function WorkspaceDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'shared'>('all');
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<WorkspaceProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceProject | null>(null);

  useEffect(() => {
    fetchWorkspaceProjects()
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    const query = (search || '').trim().toLowerCase();
    const userEmail = (user?.email || '').trim().toLowerCase();
    const userId = user?.id || '';

    return projects.filter((p) => {
      const pName = (p.name || '').toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();
      const matchSearch = pName.includes(query) || pSlug.includes(query) || pDesc.includes(query);

      if (!matchSearch) return false;

      const pOwnerEmail = (p.ownerEmail || '').trim().toLowerCase();
      const isOwner = (userId && p.ownerId === userId) || (userEmail && pOwnerEmail === userEmail);
      if (activeTab === 'mine') return isOwner;
      if (activeTab === 'shared') return !isOwner;
      return true;
    });
  }, [projects, search, activeTab, user]);

  const stats = useMemo(() => {
    const userEmail = (user?.email || '').trim().toLowerCase();
    const userId = user?.id || '';
    const mine = projects.filter(
      (p) =>
        (userId && p.ownerId === userId) ||
        (userEmail && (p.ownerEmail || '').trim().toLowerCase() === userEmail),
    ).length;
    return {
      total: projects.length,
      mine,
      shared: Math.max(0, projects.length - mine),
    };
  }, [projects, user]);

  async function handleDelete(slug: string) {
    await deleteWorkspaceProject(slug);
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
    setDeleteTarget(null);
  }

  return (
    <div className="page-padding flex flex-col section-gap">
      {/* Header & Quick Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Project Workspace
            </h1>
            <Badge variant="primary" size="sm">
              Modula 2.0
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Kelola mockup aplikasi, rancang modul CMS, dan kolaborasi dengan tim lintas-fungsi.
          </p>
        </div>

        <Button
          leadingIcon={<AddCircle className="h-4 w-4" />}
          onClick={() => setCreateOpen(true)}
          size="md"
        >
          Buat Proyek Baru
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Total Proyek Workspace</span>
            <span className="text-2xl font-bold text-foreground">{stats.total}</span>
            <span className="text-xs text-muted-foreground">Tersedia di akun kamu</span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Proyek Saya (Owner)</span>
            <span className="text-2xl font-bold text-primary">{stats.mine}</span>
            <span className="text-xs text-muted-foreground">Dibuat langsung oleh kamu</span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Dibagikan ke Saya</span>
            <span className="text-2xl font-bold text-foreground">{stats.shared}</span>
            <span className="text-xs text-muted-foreground">Kolaborasi sebagai Editor/Viewer</span>
          </div>
        </Card>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: `Semua Proyek (${stats.total})` },
            { id: 'mine', label: `Proyek Saya (${stats.mine})` },
            { id: 'shared', label: `Dibagikan (${stats.shared})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'all' | 'mine' | 'shared')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <InputField
            placeholder="Cari nama atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Memuat daftar proyek...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <h3 className="text-base font-semibold text-foreground">Tidak Ada Proyek Ditemukan</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {search
              ? 'Tidak ada proyek yang sesuai dengan kata kunci pencarian kamu.'
              : 'Belum ada proyek dalam workspace ini. Mulai dengan membuat proyek mockup pertama kamu.'}
          </p>
          <Button
            className="mt-4"
            leadingIcon={<AddCircle className="h-4 w-4" />}
            onClick={() => setCreateOpen(true)}
            size="sm"
          >
            Buat Proyek Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => {
            const userEmail = (user?.email || '').trim().toLowerCase();
            const userId = user?.id || '';
            const pOwnerEmail = (p.ownerEmail || '').trim().toLowerCase();
            const isOwner = (userId && p.ownerId === userId) || (userEmail && pOwnerEmail === userEmail);

            const members = Array.isArray(p.members) ? p.members : [];
            const memberInfo = members.find(
              (m) =>
                (userId && m.userId === userId) ||
                (userEmail && (m.email || '').trim().toLowerCase() === userEmail),
            );
            const userAccess = isOwner ? 'OWNER' : memberInfo?.accessLevel || 'VIEWER';

            return (
              <div
                key={p.slug || p.id}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex flex-col gap-3">
                  {/* Top Bar with Color Swatch & Access Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-inner ring-1 ring-border"
                        style={{ backgroundColor: p.primaryColor || '#00487a' }}
                      />
                      <span className="font-mono text-xs text-muted-foreground">/{p.slug}</span>
                    </div>
                    <Badge
                      variant={
                        userAccess === 'OWNER'
                          ? 'primary'
                          : userAccess === 'EDITOR'
                            ? 'info'
                            : 'neutral'
                      }
                      size="xs"
                    >
                      {userAccess}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div
                    className="flex flex-col gap-1 cursor-pointer"
                    onClick={() => navigate(`/projects/${p.slug}/builder`)}
                  >
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {p.name || p.slug}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {p.description || 'Tidak ada deskripsi tambahan.'}
                    </p>
                  </div>
                </div>

                {/* Footer Info & Actions */}
                <div className="mt-5 border-t border-border pt-3.5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      Oleh: <strong className="text-foreground">{p.ownerName || p.ownerEmail || 'Internal'}</strong>
                    </span>
                    <span>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Baru saja'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      leadingIcon={<Pen2 className="h-3.5 w-3.5" />}
                      onClick={() => navigate(`/projects/${p.slug}/builder`)}
                      className="flex-1"
                    >
                      Buka Builder
                    </Button>

                    <Button
                      size="sm"
                      hierarchy="secondary"
                      onClick={() => setShareTarget(p)}
                      title="Bagikan ke Anggota Tim"
                    >
                      <UsersGroupRounded className="h-3.5 w-3.5" />
                    </Button>

                    {(isOwner || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <Button
                        size="sm"
                        hierarchy="secondary"
                        destructive
                        onClick={() => setDeleteTarget(p)}
                        title="Hapus Proyek"
                      >
                        <TrashBinTrash className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog Buat Proyek Cepat */}
      <QuickCreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(created) => {
          setProjects((prev) => [created, ...prev]);
        }}
      />

      {/* Dialog Bagikan Proyek */}
      <ShareProjectDialog
        project={shareTarget}
        onClose={() => setShareTarget(null)}
        onUpdated={(updated) => {
          setProjects((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
        }}
      />

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Proyek Workspace"
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button hierarchy="secondary" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              destructive
              onClick={() => deleteTarget && void handleDelete(deleteTarget.slug)}
            >
              Ya, Hapus
            </Button>
          </div>
        }
      >
        <p className="text-sm text-foreground pt-2">
          Apakah kamu yakin ingin menghapus proyek <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Dialog>
    </div>
  );
}
