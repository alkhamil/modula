import { useState, useMemo, useEffect, useLayoutEffect, type FormEvent } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router';
import {
  Card,
  Button,
  Table,
  Badge,
  TableToolbar,
  Dialog,
  InputField,
  Select,
  type Column,
  type FilterField,
} from '../../../shared/components/ui';
import {
  TrashBinTrash,
  Pen2,
  AddCircle,
  UsersGroupRounded,
  Box,
  Widget2,
  CheckCircle,
} from '../../../shared/components/icons';
import { AppShell } from '../../../shared/components/layout';
import type { NavItemType } from '../../../shared/types/navigation';
import { getPreviewConfig, savePreviewConfig, type PreviewConfig } from '../previewStore';

interface DemoAccount {
  username: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'admin',
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'Admin',
    permissions: ['*'],
  },
  {
    username: 'user',
    name: 'Staff Operasional',
    email: 'staff@example.com',
    role: 'Staff',
    permissions: ['users.view', 'master.view', 'orders.view'],
  },
  {
    username: 'auditor',
    name: 'Auditor',
    email: 'audit@example.com',
    role: 'Auditor',
    permissions: ['*.view'],
  },
];

interface MockUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdDate: string;
}

const DEFAULT_USERS: MockUser[] = [
  { id: 'usr-1', name: 'Budi Santoso', username: 'budi.santoso', email: 'budi.santoso@example.com', role: 'Staff', status: 'active', createdDate: '2026-03-12 09:00' },
  { id: 'usr-2', name: 'Dewi Lestari', username: 'dewi.lestari', email: 'dewi.lestari@example.com', role: 'Auditor', status: 'inactive', createdDate: '2026-03-18 16:45' },
  { id: 'usr-3', name: 'Rian Pratama', username: 'rian.pratama', email: 'rian.pratama@example.com', role: 'Staff', status: 'active', createdDate: '2026-03-22 11:30' },
  { id: 'usr-4', name: 'Siti Rahma', username: 'siti.rahma', email: 'siti.rahma@example.com', role: 'Admin', status: 'active', createdDate: '2026-03-05 14:15' },
];

export default function LiveAppPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const slug = projectSlug ?? 'app';
  const [backendConfig, setBackendConfig] = useState<PreviewConfig | null>(null);

  // Jika tidak ada di localStorage, ambil dari backend /api/projects
  useEffect(() => {
    if (!getPreviewConfig(slug)) {
      fetch('/api/projects')
        .then((res) => (res.ok ? res.json() : []))
        .then((list: Array<{ name: string; slug: string; theme: 'light' | 'dark'; primaryColor?: string; selectedPacks?: string[] }>) => {
          const match = list.find((p) => p.slug === slug);
          if (match) {
            const cfg: PreviewConfig = {
              name: match.name,
              slug: match.slug,
              theme: match.theme || 'light',
              primaryColor: match.primaryColor || '#00487a',
              selectedPacks: match.selectedPacks || ['login', 'user', 'role', 'generator'],
            };
            savePreviewConfig(cfg);
            setBackendConfig(cfg);
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  const project = useMemo<PreviewConfig>(() => {
    const stored = getPreviewConfig(slug) || backendConfig;
    if (stored) return stored;
    const generatedName = slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
    return {
      name: generatedName || 'My Application',
      slug,
      theme: 'light',
      primaryColor: '#00487a',
      selectedPacks: ['login', 'user', 'role', 'generator'],
    };
  }, [slug, backendConfig]);

  // Resolusi warna primary: query param ?color= > stored config > default #00487a
  const resolvedPrimaryColor = useMemo(() => {
    const fromParam = searchParams.get('color');
    if (fromParam) return fromParam.startsWith('#') ? fromParam : `#${fromParam}`;
    return project.primaryColor || '#00487a';
  }, [searchParams, project.primaryColor]);

  // Terapkan warna brand pilihan pengguna ke root CSS variable dokumen
  useLayoutEffect(() => {
    const root = document.documentElement;
    const primary = resolvedPrimaryColor;
    const mix = (pct: number, base: string) => `color-mix(in srgb, ${primary} ${pct}%, ${base})`;

    root.style.setProperty('--wds-bg-brand', primary);
    root.style.setProperty('--wds-bg-brand-hover', mix(88, 'black'));
    root.style.setProperty('--wds-bg-brand-pressed', mix(80, 'black'));
    root.style.setProperty('--wds-bg-brand-pressed-strong', mix(72, 'black'));
    root.style.setProperty('--wds-bg-brand-subtle', mix(10, 'white'));
    root.style.setProperty('--wds-text-brand', primary);
    root.style.setProperty('--wds-text-on-brand', '#ffffff');
    root.style.setProperty('--wds-icons-brand', primary);
    root.style.setProperty('--wds-icons-on-brand', '#ffffff');
    root.style.setProperty('--wds-stroke-brand', primary);
    root.style.setProperty('--wds-stroke-focus', primary);
    root.style.setProperty('--theme-primary', primary);
    root.style.setProperty('--theme-primary-foreground', '#ffffff');

    return () => {
      const vars = [
        '--wds-bg-brand',
        '--wds-bg-brand-hover',
        '--wds-bg-brand-pressed',
        '--wds-bg-brand-pressed-strong',
        '--wds-bg-brand-subtle',
        '--wds-text-brand',
        '--wds-text-on-brand',
        '--wds-icons-brand',
        '--wds-icons-on-brand',
        '--wds-stroke-brand',
        '--wds-stroke-focus',
        '--theme-primary',
        '--theme-primary-foreground',
      ];
      vars.forEach((name) => root.style.removeProperty(name));
    };
  }, [resolvedPrimaryColor]);

  // Sesi Login disimpan di sessionStorage per project slug
  const sessionKey = `preview_session_${slug}`;
  const [user, setUser] = useState<DemoAccount | null>(() => {
    try {
      const raw = sessionStorage.getItem(sessionKey);
      return raw ? (JSON.parse(raw) as DemoAccount) : DEMO_ACCOUNTS[0] ?? null;
    } catch {
      return DEMO_ACCOUNTS[0] ?? null;
    }
  });

  function handleLogin(account: DemoAccount) {
    setUser(account);
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(account));
    } catch {}
  }

  function handleLogout() {
    setUser(null);
    try {
      sessionStorage.removeItem(sessionKey);
    } catch {}
  }

  // Persistent mock users data per project slug
  const usersKey = `preview_users_${slug}`;
  const [users, setUsers] = useState<MockUser[]>(() => {
    try {
      const raw = localStorage.getItem(usersKey);
      return raw ? (JSON.parse(raw) as MockUser[]) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const saveUsers = (newUsers: MockUser[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem(usersKey, JSON.stringify(newUsers));
    } catch {}
  };

  // Navigasi subroute aktif: dashboard, users, roles, generator
  useEffect(() => {
    if (location.pathname === `/${slug}/live` || location.pathname === `/${slug}/live/`) {
      navigate(`/${slug}/live/dashboard`, { replace: true });
    }
  }, [location.pathname, slug, navigate]);

  const currentPath = location.pathname.replace(new RegExp(`^/${slug}/live`), '').replace(/^\//, '');
  const activeTab = useMemo(() => {
    if (currentPath.startsWith('user-management/roles')) return 'roles';
    if (currentPath.startsWith('user-management') || currentPath.startsWith('users')) return 'users';
    if (currentPath.startsWith('generator')) return 'generator';
    return 'dashboard';
  }, [currentPath]);

  // User table state & dialogs
  const [userSearch, setUserSearch] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockUser | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('Staff');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userFilterRole === 'all' || u.role.toLowerCase() === userFilterRole.toLowerCase();
      return matchSearch && matchRole;
    });
  }, [users, userSearch, userFilterRole]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const userColumns: Column<MockUser>[] = [
    {
      key: 'name',
      header: 'Nama',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.name}</span>
          <span className="text-xs text-muted-foreground">@{row.username}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => row.email,
    },
    {
      key: 'role',
      header: 'Peran',
      render: (row) => (
        <Badge variant={row.role === 'Admin' ? 'primary' : 'neutral'} size="sm">
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'neutral'} size="sm">
          {row.status === 'active' ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'createdDate',
      header: 'Dibuat',
      render: (row) => row.createdDate,
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: 'role',
      label: 'Peran',
      type: 'select',
      options: [
        { label: 'Semua Peran', value: 'all' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Auditor', value: 'Auditor' },
      ],
    },
  ];

  // Dynamic nav items matching project packs
  const navItems: NavItemType[] = useMemo(() => {
    const items: NavItemType[] = [
      {
        path: `/${slug}/live/dashboard`,
        label: 'Dashboard',
        icon: <Widget2 className="h-4 w-4" />,
      },
    ];

    const hasUserPack = project.selectedPacks.includes('user') || project.selectedPacks.includes('users');
    const hasRolePack = project.selectedPacks.includes('role') || project.selectedPacks.includes('roles');

    if (hasUserPack || hasRolePack) {
      items.push({
        path: `/${slug}/live/user-management`,
        label: 'Manajemen Pengguna',
        icon: <UsersGroupRounded className="h-4 w-4" />,
        children: [
          ...(hasUserPack ? [{ path: `/${slug}/live/user-management/users`, label: 'Pengguna' }] : []),
          ...(hasRolePack ? [{ path: `/${slug}/live/user-management/roles`, label: 'Peran & Hak Akses' }] : []),
        ],
      });
    }

    if (project.selectedPacks.includes('generator')) {
      items.push({
        path: `/${slug}/live/generator`,
        label: 'Module Generator',
        icon: <Box className="h-4 w-4" />,
      });
    }

    return items;
  }, [slug, project.selectedPacks]);

  // View: Jika belum login, tampilkan halaman Login asli
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt={project.name} className="mb-3 h-10 w-auto object-contain" />
            ) : (
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
                {project.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Silakan masuk untuk mengakses sistem aplikasi</p>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-surface p-3.5">
            <span className="text-xs font-semibold text-muted-foreground">Pilih Akun Demo (1-Click Test):</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleLogin(acc)}
                  className="flex flex-col items-center rounded-lg border border-border bg-card p-2 text-center text-xs transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span className="font-semibold text-foreground">{acc.role}</span>
                  <span className="text-[10px] text-muted-foreground">@{acc.username}</span>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleLogin(DEMO_ACCOUNTS[0]!);
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Username / Email</label>
              <InputField defaultValue="admin@example.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Kata Sandi</label>
              <InputField type="password" defaultValue="••••••••" required />
            </div>
            <Button type="submit" size="lg" className="w-full mt-2">
              Masuk ke Aplikasi
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      appName={project.name}
      logo={project.logoUrl ? <img src={project.logoUrl} alt={project.name} className="h-7 w-auto object-contain" /> : undefined}
      collapsedLogo={
        project.collapsedLogoUrl ? (
          <img src={project.collapsedLogoUrl} alt={project.name} className="h-6 w-auto object-contain" />
        ) : undefined
      }
      user={{ name: user.name, roleName: user.role }}
      onLogout={handleLogout}
      navItems={navItems}
    >
      <div className="page-padding flex flex-col section-gap">
        {/* Banner Live Mode */}
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              Live Preview Aktif: <strong>{project.name}</strong> ({project.slug})
            </span>
          </div>
          <Badge variant="primary" size="sm">
            Mode Live
          </Badge>
        </div>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col stack-gap">
            <Card title={`Selamat Datang, ${user.name}`}>
              <p className="text-sm text-muted-foreground">
                Ini adalah dashboard utama aplikasi <strong>{project.name}</strong>. Semua modul di sebelah kiri aktif dan dapat kamu jelajahi secara langsung.
              </p>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Total Pengguna</span>
                  <span className="text-2xl font-bold text-foreground">{users.length}</span>
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Siap dikelola di modul Users
                  </span>
                </div>
              </Card>

              <Card>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Peran Terdaftar</span>
                  <span className="text-2xl font-bold text-foreground">3</span>
                  <span className="text-xs text-muted-foreground">Super Admin, Staff, Auditor</span>
                </div>
              </Card>

              <Card>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Status Sistem</span>
                  <span className="text-2xl font-bold text-success">Aktif</span>
                  <span className="text-xs text-muted-foreground">Mock store terisolasi per project</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <div className="flex flex-col stack-gap">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-foreground">Daftar Pengguna</h2>
              <p className="text-xs text-muted-foreground">Kelola pengguna, status akun, dan hak akses staf operasional.</p>
            </div>

            <Card>
              <TableToolbar
                searchValue={userSearch}
                onSearchChange={setUserSearch}
                filterFields={filterFields}
                filterValues={{ role: userFilterRole }}
                onApply={(vals) => {
                  setUserFilterRole(String(vals['role'] ?? 'all'));
                  setPage(1);
                }}
                onReset={() => {
                  setUserFilterRole('all');
                  setPage(1);
                }}
                actions={
                  <Button
                    leadingIcon={<AddCircle className="h-4 w-4" />}
                    onClick={() => {
                      setFormName('');
                      setFormEmail('');
                      setFormRole('Staff');
                      setCreateDialogOpen(true);
                    }}
                  >
                    Tambah Pengguna
                  </Button>
                }
              />
              <Table
                rowKey={(item) => item.id}
                columns={userColumns}
                data={paginatedUsers}
                totalRecords={filteredUsers.length}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                renderAction={(row) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="xs"
                      hierarchy="secondary"
                      onClick={() => {
                        setEditUser(row);
                        setFormName(row.name);
                        setFormEmail(row.email);
                        setFormRole(row.role);
                      }}
                    >
                      <Pen2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="xs" hierarchy="secondary" destructive onClick={() => setDeleteTarget(row)}>
                      <TrashBinTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              />
            </Card>
          </div>
        )}

        {/* Tab 3: Roles & Permissions */}
        {activeTab === 'roles' && (
          <div className="flex flex-col stack-gap">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-foreground">Peran & Hak Akses</h2>
              <p className="text-xs text-muted-foreground">Daftar hak akses dan matriks peran yang telah didefinisikan.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { role: 'Admin', count: users.filter((u) => u.role === 'Admin').length, desc: 'Akses penuh ke semua modul dan konfigurasi sistem' },
                { role: 'Staff', count: users.filter((u) => u.role === 'Staff').length, desc: 'Akses operasional data harian dan CRUD modul' },
                { role: 'Auditor', count: users.filter((u) => u.role === 'Auditor').length, desc: 'Hak akses baca (view-only) untuk pelaporan dan audit' },
              ].map((item) => (
                <Card key={item.role} title={item.role}>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                    <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
                      <span className="text-muted-foreground">Total Anggota:</span>
                      <span className="font-semibold text-foreground">{item.count} Pengguna</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Module Generator */}
        {activeTab === 'generator' && (
          <div className="flex flex-col stack-gap">
            <Card title="Module Generator Visual">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Modul ini memungkinkan kamu mendesain formulir, tabel data, dan logika bisnis tambahan secara visual.
                </p>
                <Button size="md" onClick={() => window.open('/generator', '_blank')} className="w-fit">
                  Buka Module Generator Visual ↗
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Dialog: Tambah Pengguna */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Tambah Pengguna Baru"
        footer={
          <div className="flex justify-end gap-2">
            <Button hierarchy="secondary" onClick={() => setCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                if (!formName.trim() || !formEmail.trim()) return;
                const newUser: MockUser = {
                  id: `usr-${Date.now()}`,
                  name: formName.trim(),
                  username: formName.toLowerCase().replace(/\s+/g, '.'),
                  email: formEmail.trim(),
                  role: formRole,
                  status: 'active',
                  createdDate: 'Hari ini',
                };
                saveUsers([newUser, ...users]);
                setCreateDialogOpen(false);
              }}
            >
              Simpan
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
            <InputField value={formName} onChange={(e) => setFormName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Alamat Email</label>
            <InputField type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Peran Akun</label>
            <Select
              value={formRole}
              onChange={(val) => setFormRole(val)}
              options={[
                { label: 'Admin', value: 'Admin' },
                { label: 'Staff Operasional', value: 'Staff' },
                { label: 'Auditor', value: 'Auditor' },
              ]}
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog: Edit Pengguna */}
      <Dialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        title="Ubah Data Pengguna"
        footer={
          <div className="flex justify-end gap-2">
            <Button hierarchy="secondary" onClick={() => setEditUser(null)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                if (!editUser) return;
                saveUsers(
                  users.map((u) => (u.id === editUser.id ? { ...u, name: formName, email: formEmail, role: formRole } : u)),
                );
                setEditUser(null);
              }}
            >
              Perbarui
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
            <InputField value={formName} onChange={(e) => setFormName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Alamat Email</label>
            <InputField type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Peran Akun</label>
            <Select
              value={formRole}
              onChange={(val) => setFormRole(val)}
              options={[
                { label: 'Admin', value: 'Admin' },
                { label: 'Staff Operasional', value: 'Staff' },
                { label: 'Auditor', value: 'Auditor' },
              ]}
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog: Hapus Pengguna */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Pengguna"
        footer={
          <div className="flex justify-end gap-2">
            <Button hierarchy="secondary" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              hierarchy="primary"
              destructive
              onClick={() => {
                if (!deleteTarget) return;
                saveUsers(users.filter((u) => u.id !== deleteTarget.id));
                setDeleteTarget(null);
              }}
            >
              Ya, Hapus
            </Button>
          </div>
        }
      >
        <p className="text-sm text-foreground pt-2">
          Apakah kamu yakin ingin menghapus pengguna <strong>{deleteTarget?.name}</strong>?
        </p>
      </Dialog>
    </AppShell>
  );
}
