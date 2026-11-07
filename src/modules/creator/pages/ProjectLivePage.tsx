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
  Alert,
  type Column,
  type FilterField,
} from '../../../shared/components/ui';
import {
  TrashBinTrash,
  AltArrowLeft,
  Pen2,
  Eye,
  AddCircle,
  Download,
  Upload,
  UsersGroupRounded,
  Box,
  Settings,
  Widget2,
} from '../../../shared/components/icons';
import { AppShell } from '../../../shared/components/layout';
import { ThemeProvider } from '../../../shared/theme';
import type { NavItemType } from '../../../shared/types/navigation';
import { getProjectLiveConfig, saveProjectLiveConfig, type ProjectLiveConfig } from '../liveStore';

interface DemoAccount {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  description: string;
  permissions: string[];
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'admin',
    description: 'Semua hak akses modul & konfigurasi',
    permissions: ['*'],
  },
  {
    username: 'user',
    password: 'user123',
    name: 'Staff Operasional',
    email: 'staff@example.com',
    role: 'user',
    description: 'Akses operasional data harian',
    permissions: ['users.view', 'master.view', 'orders.view', 'orders.create'],
  },
  {
    username: 'auditor',
    password: 'audit123',
    name: 'Auditor Eksternal',
    email: 'audit@example.com',
    role: 'auditor',
    description: 'Hak akses baca untuk audit & laporan',
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

const INITIAL_USERS: MockUser[] = [
  { id: 'usr-1', name: 'Budi Santoso', username: 'budi.santoso', email: 'budi.santoso@example.com', role: 'Staff Operasional', status: 'active', createdDate: '2026-03-12 09:00' },
  { id: 'usr-2', name: 'Dewi Lestari', username: 'dewi.lestari', email: 'dewi.lestari@example.com', role: 'Viewer / Audit', status: 'inactive', createdDate: '2026-03-18 16:45' },
  { id: 'usr-3', name: 'Rian Pratama', username: 'rian.pratama', email: 'rian.pratama@example.com', role: 'Staff Operasional', status: 'active', createdDate: '2026-03-22 11:30' },
  { id: 'usr-4', name: 'Siti Rahma', username: 'siti.rahma', email: 'siti.rahma@example.com', role: 'Admin', status: 'active', createdDate: '2026-03-05 14:15' },
];

interface MockRole {
  id: string;
  name: string;
  code: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
}

const INITIAL_ROLES: MockRole[] = [
  { id: 'rol-1', name: 'Super Admin', code: 'super_admin', userCount: 2, permissions: ['Semua Akses (*)'], status: 'active' },
  { id: 'rol-2', name: 'Admin', code: 'admin', userCount: 5, permissions: ['users.view', 'users.create', 'users.update', 'master.data'], status: 'active' },
  { id: 'rol-3', name: 'Staff Operasional', code: 'staff', userCount: 18, permissions: ['master.view', 'orders.create', 'orders.update'], status: 'active' },
  { id: 'rol-4', name: 'Viewer / Audit', code: 'viewer', userCount: 4, permissions: ['*.view'], status: 'active' },
];

export default function ProjectLivePage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const slug = projectSlug ?? 'app';
  const [backendProject, setBackendProject] = useState<ProjectLiveConfig | null>(null);

  useEffect(() => {
    if (!getProjectLiveConfig(slug)) {
      fetch('/api/projects')
        .then((res) => (res.ok ? res.json() : []))
        .then((list: Array<{ name: string; slug: string; theme: 'light' | 'dark'; primaryColor?: string; selectedPacks?: string[] }>) => {
          const match = list.find((p) => p.slug === slug);
          if (match) {
            const cfg: ProjectLiveConfig = {
              name: match.name,
              slug: match.slug,
              theme: match.theme || 'light',
              uiStyle: 'classic',
              primaryColor: match.primaryColor || '#00487a',
              selectedPacks: match.selectedPacks || ['login', 'user', 'role', 'example-flat', 'example-nested', 'generator'],
            };
            saveProjectLiveConfig(cfg);
            setBackendProject(cfg);
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  // Muat konfigurasi project dari liveStore, backend, atau buat fallback cerdas
  const project = useMemo<ProjectLiveConfig>(() => {
    const stored = getProjectLiveConfig(slug) || backendProject;
    if (stored) return stored;
    const generatedName = slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
    return {
      name: generatedName || 'My App',
      slug,
      theme: 'light',
      uiStyle: 'classic',
      primaryColor: '#00487a',
      selectedPacks: ['login', 'user', 'role', 'example-flat', 'example-nested', 'generator'],
    };
  }, [slug, backendProject]);

  // Resolusi warna primary: query param ?color= > stored config > fallback #00487a (bawaan WDS blue)
  const resolvedPrimaryColor = useMemo(() => {
    const fromParam = searchParams.get('color');
    if (fromParam) return fromParam.startsWith('#') ? fromParam : `#${fromParam}`;
    return project.primaryColor || '#00487a';
  }, [searchParams, project.primaryColor]);

  const currentTheme = project.theme || 'light';
  const currentStyle = project.uiStyle || 'classic';

  // Terapkan langsung token brand & primary ke CSS variables dokumen agar sidebar,
  // tombol, dan highlight menu berwarna merah/burgundy seperti di localhost
  useLayoutEffect(() => {
    const root = document.documentElement;
    const primary = resolvedPrimaryColor;
    const mix = (pct: number, base: string) => `color-mix(in srgb, ${primary} ${pct}%, ${base})`;

    root.dataset.uiStyle = currentStyle;
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
  }, [resolvedPrimaryColor, currentStyle]);

  // Otomatis redirect ke /dashboard saat membuka root live URL
  useEffect(() => {
    const rawPath = location.pathname.replace(/\/+$/, '');
    if (rawPath === `/${slug}/live`) {
      navigate(`/${slug}/live/dashboard${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, slug, navigate]);

  // Sesi Login disimpan di sessionStorage agar refresh browser tetap mempertahankan state
  const sessionKey = `modula_live_session_${slug}`;
  const [authenticatedUser, setAuthenticatedUser] = useState<DemoAccount | null>(() => {
    try {
      const raw = sessionStorage.getItem(sessionKey);
      return raw ? (JSON.parse(raw) as DemoAccount) : DEMO_ACCOUNTS[0] ?? null;
    } catch {
      return DEMO_ACCOUNTS[0] ?? null;
    }
  });

  // Form Login state
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<MockRole[]>(INITIAL_ROLES);

  // User table state
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const [userSortKey, setUserSortKey] = useState<string | undefined>('name');
  const [userSortDir, setUserSortDir] = useState<'asc' | 'desc'>('asc');
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Staff Operasional');

  // Role table state
  const [roleSearch, setRoleSearch] = useState('');
  const [rolePage, setRolePage] = useState(1);
  const [rolePageSize, setRolePageSize] = useState(10);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCode, setNewRoleCode] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${project.name} · Live`;
  }, [project.name]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleLoginSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    setSubmitting(true);
    setLoginError(null);

    setTimeout(() => {
      setSubmitting(false);
      const match = DEMO_ACCOUNTS.find(
        (acc) => acc.username === usernameInput.trim() && acc.password === passwordInput.trim()
      );
      if (match) {
        setAuthenticatedUser(match);
        try {
          sessionStorage.setItem(sessionKey, JSON.stringify(match));
        } catch {
          // ignore
        }
        navigate(`/${slug}/live/dashboard`);
      } else {
        setLoginError('Kredensial tidak valid. Silakan gunakan salah satu akun demo di bawah.');
      }
    }, 250);
  }

  function handleSelectDemoAccount(account: DemoAccount) {
    setUsernameInput(account.username);
    setPasswordInput(account.password);
    setLoginError(null);
    setAuthenticatedUser(account);
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(account));
    } catch {
      // ignore
    }
    navigate(`/${slug}/live/dashboard`);
  }

  function handleLogout() {
    setAuthenticatedUser(null);
    try {
      sessionStorage.removeItem(sessionKey);
    } catch {
      // ignore
    }
  }

  // Tentukan rute aktif berdasarkan URL (default = dashboard)
  const currentPath = location.pathname;
  const isUsersRoute = currentPath.includes('/user-management/user');
  const isRolesRoute = currentPath.includes('/user-management/role');
  const isDefaultModuleRoute = currentPath.includes('/default-module');
  const isDefaultParentRoute = currentPath.includes('/default-parent');
  const isGeneratorRoute = currentPath.includes('/generator');

  // Filter users
  const filteredUsers = useMemo(() => {
    let list = users;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }
    if (userSortKey) {
      list = [...list].sort((a, b) => {
        const valA = String((a as unknown as Record<string, unknown>)[userSortKey] ?? '');
        const valB = String((b as unknown as Record<string, unknown>)[userSortKey] ?? '');
        return userSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return list;
  }, [users, userSearch, userSortKey, userSortDir]);

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!roleSearch.trim()) return roles;
    const q = roleSearch.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
  }, [roles, roleSearch]);

  const userColumns: Column<MockUser>[] = [
    {
      key: 'name',
      header: 'Nama User',
      sortable: true,
      render: (item: MockUser) => (
        <div>
          <div className="font-medium text-foreground">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      render: (item: MockUser) => <span className="font-mono text-sm text-foreground">{item.username}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: MockUser) => <Badge variant="secondary">{item.role}</Badge>,
    },
    {
      key: 'createdDate',
      header: 'Tanggal Dibuat',
      sortable: true,
      render: (item: MockUser) => <span className="text-sm text-muted-foreground">{item.createdDate}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: MockUser) => (
        <Badge variant={item.status === 'active' ? 'success' : 'neutral'}>
          {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: MockUser) => (
        <div className="flex justify-end gap-1">
          <Button
            size="sm"
            hierarchy="tertiary"
            onClick={() => showToast(`Detail user: ${item.name}`)}
            leadingIcon={<Eye className="h-4 w-4" />}
          />
          <Button
            size="sm"
            hierarchy="tertiary"
            onClick={() => showToast(`Edit user: ${item.name}`)}
            leadingIcon={<Pen2 className="h-4 w-4" />}
          />
          <Button
            size="sm"
            hierarchy="tertiary"
            onClick={() => {
              setUsers((prev) => prev.filter((u) => u.id !== item.id));
              showToast(`User ${item.name} berhasil dihapus.`);
            }}
            leadingIcon={<TrashBinTrash className="h-4 w-4 text-destructive" />}
          />
        </div>
      ),
    },
  ];

  const roleColumns: Column<MockRole>[] = [
    {
      key: 'name',
      header: 'Nama Role',
      render: (item: MockRole) => (
        <div>
          <div className="font-medium text-foreground">{item.name}</div>
          <div className="font-mono text-xs text-muted-foreground">{item.code}</div>
        </div>
      ),
    },
    {
      key: 'userCount',
      header: 'Jumlah User',
      render: (item: MockRole) => <span className="text-sm font-medium text-foreground">{item.userCount} akun</span>,
    },
    {
      key: 'permissions',
      header: 'Hak Akses',
      render: (item: MockRole) => (
        <div className="flex flex-wrap gap-1">
          {item.permissions.map((p) => (
            <Badge key={p} variant="secondary" className="font-mono text-xs">
              {p}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <Badge variant="success">Aktif</Badge>,
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: MockRole) => (
        <div className="flex justify-end gap-1">
          <Button
            size="sm"
            hierarchy="tertiary"
            onClick={() => showToast(`Detail role: ${item.name}`)}
            leadingIcon={<Eye className="h-4 w-4" />}
          />
          <Button
            size="sm"
            hierarchy="tertiary"
            onClick={() => showToast(`Edit role: ${item.name}`)}
            leadingIcon={<Pen2 className="h-4 w-4" />}
          />
        </div>
      ),
    },
  ];

  function handleCreateUser() {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const username = newUserName.toLowerCase().replace(/\s+/g, '.');
    const newUser: MockUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      username,
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'active',
      createdDate: 'Hari ini',
    };
    setUsers((prev) => [newUser, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setCreateUserOpen(false);
    showToast(`User ${newUser.name} berhasil ditambahkan!`);
  }

  function handleCreateRole() {
    if (!newRoleName.trim() || !newRoleCode.trim()) return;
    const newRole: MockRole = {
      id: `rol-${Date.now()}`,
      name: newRoleName.trim(),
      code: newRoleCode.trim().toLowerCase(),
      userCount: 0,
      permissions: ['read', 'write'],
      status: 'active',
    };
    setRoles((prev) => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleCode('');
    setCreateRoleOpen(false);
    showToast(`Role ${newRole.name} berhasil ditambahkan!`);
  }

  function handleExportUsers() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Nama,Username,Email,Role,Status,Tanggal Dibuat']
        .concat(users.map((u) => `"${u.name}","${u.username}","${u.email}","${u.role}","${u.status}","${u.createdDate}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${slug}_users.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data user berhasil diekspor ke file CSV.');
  }

  const dummyFilterFields: FilterField[] = [
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'Semua Role', value: '' },
        { label: 'Super Admin', value: 'Super Admin' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Staff Operasional', value: 'Staff Operasional' },
        { label: 'Viewer / Audit', value: 'Viewer / Audit' },
      ],
    },
  ];

  // Daftar navigasi sidebar identik dengan hasil project template
  const navItems: NavItemType[] = [
    {
      path: `/${slug}/live/dashboard`,
      label: 'Dashboard',
      icon: <Widget2 className="h-5 w-5" />,
    },
    {
      label: 'User Management',
      icon: <UsersGroupRounded className="h-5 w-5" />,
      children: [
        {
          path: `/${slug}/live/user-management/user`,
          label: 'User',
        },
        {
          path: `/${slug}/live/user-management/role`,
          label: 'Role',
        },
      ],
    },
    {
      path: `/${slug}/live/default-module`,
      label: 'Default Modules',
      icon: <Box className="h-5 w-5" />,
    },
    {
      label: 'Default Parent',
      icon: <Box className="h-5 w-5" />,
      children: [
        {
          path: `/${slug}/live/default-parent/default-item`,
          label: 'Default Item',
        },
        {
          path: `/${slug}/live/default-parent/default-record`,
          label: 'Default Record',
        },
      ],
    },
    {
      path: `/${slug}/live/generator`,
      label: 'Generator',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <ThemeProvider
      defaultTheme={currentTheme}
      uiStyle={currentStyle}
      defaultOverrides={resolvedPrimaryColor ? { primary: resolvedPrimaryColor } : undefined}
      storageKey={`modula_live_${slug}`}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen 1: Unauthenticated -> Real LoginPage with DemoAccountsCard */}
      {!authenticatedUser ? (
        <div className="wds-auth min-h-screen">
          <aside className="wds-auth__brand" aria-hidden="true">
            {project.logoUrl ? (
              <img src={project.logoUrl} alt="" className="wds-auth__logo max-h-16 object-contain" />
            ) : (
              <p className="wds-auth__brand-name text-2xl font-bold tracking-tight text-foreground">
                {project.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Sistem Enterprise Moduler yang Dibuat dengan Modula
            </p>
          </aside>
          <main className="wds-auth__panel flex items-center justify-center p-6">
            <div className="flex w-full max-w-md flex-col stack-gap">
              <Card title="Masuk ke Akun Anda">
                <form onSubmit={handleLoginSubmit} className="flex flex-col stack-gap">
                  {loginError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Username / Email</label>
                    <InputField
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="admin"
                      maxLength={50}
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Kata Sandi</label>
                    <InputField
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      maxLength={100}
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full" hierarchy="primary">
                    {submitting ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </Card>

              {/* Demo Accounts Card */}
              <Card title="Akun Demo (Klik untuk Masuk)">
                <ul className="flex flex-col gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <li key={acc.username}>
                      <button
                        type="button"
                        onClick={() => handleSelectDemoAccount(acc)}
                        className="group block w-full rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-semibold text-foreground group-hover:text-primary">
                            {acc.username} / {acc.password}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {acc.role}
                          </Badge>
                        </div>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {acc.description}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/creator')}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <AltArrowLeft className="h-3 w-3" /> Kembali ke Modula Creator
                </button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* Screen 2: Authenticated -> Real ProtectedAppShell driven by Sidebar */
        <AppShell
          navItems={navItems}
          permissions={authenticatedUser ? authenticatedUser.permissions : ['*']}
          appName={project.name}
          logo={project.logoUrl ? <img src={project.logoUrl} alt="" className="h-7 w-auto object-contain" /> : undefined}
          user={{
            name: authenticatedUser.name,
            roleName: authenticatedUser.role,
          }}
          onLogout={handleLogout}
        >
          {/* VIEW 1: USER LIST PAGE */}
          {isUsersRoute ? (
            <div data-testid="user-list-page" className="space-y-4">
              <Card
                flush
                title="Daftar User"
                description="Kelola akun pengguna, peran, dan status akses sistem."
                actions={
                  <div className="flex items-center gap-2">
                    <Button
                      hierarchy="secondary"
                      leadingIcon={<Upload className="h-4 w-4" />}
                      onClick={() => setBulkUploadOpen(true)}
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      hierarchy="primary"
                      leadingIcon={<AddCircle className="h-4 w-4" />}
                      onClick={() => setCreateUserOpen(true)}
                    >
                      + Tambah User
                    </Button>
                  </div>
                }
              >
                <TableToolbar
                  searchValue={userSearch}
                  onSearchChange={(val) => {
                    setUserSearch(val);
                    setUserPage(1);
                  }}
                  filterFields={dummyFilterFields}
                  onApply={() => {}}
                  onReset={() => setUserSearch('')}
                  actions={
                    <Button
                      hierarchy="secondary"
                      leadingIcon={<Download className="h-4 w-4" />}
                      onClick={handleExportUsers}
                    >
                      Export
                    </Button>
                  }
                />
                <Table<MockUser>
                  columns={userColumns}
                  data={filteredUsers.slice((userPage - 1) * userPageSize, userPage * userPageSize)}
                  totalRecords={filteredUsers.length}
                  page={userPage}
                  pageSize={userPageSize}
                  onPageChange={setUserPage}
                  onPageSizeChange={setUserPageSize}
                  sortKey={userSortKey}
                  sortDir={userSortDir}
                  onSort={(key) => {
                    if (userSortKey === key) {
                      setUserSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setUserSortKey(key);
                      setUserSortDir('asc');
                    }
                  }}
                  rowKey={(item: MockUser) => item.id}
                />
              </Card>
            </div>
          ) : isRolesRoute ? (
            /* VIEW 2: ROLE LIST PAGE */
            <div data-testid="role-list-page" className="space-y-4">
              <Card
                flush
                title="Daftar Role"
                description="Kelola daftar peran pengguna dan hak akses per modul."
                actions={
                  <div className="flex items-center gap-2">
                    <Button
                      hierarchy="primary"
                      leadingIcon={<AddCircle className="h-4 w-4" />}
                      onClick={() => setCreateRoleOpen(true)}
                    >
                      + Tambah Role
                    </Button>
                  </div>
                }
              >
                <TableToolbar
                  searchValue={roleSearch}
                  onSearchChange={(val) => {
                    setRoleSearch(val);
                    setRolePage(1);
                  }}
                  filterFields={[]}
                  onApply={() => {}}
                  onReset={() => setRoleSearch('')}
                  actions={
                    <Button
                      hierarchy="secondary"
                      leadingIcon={<Download className="h-4 w-4" />}
                      onClick={() => showToast('Data role berhasil diekspor.')}
                    >
                      Export
                    </Button>
                  }
                />
                <Table<MockRole>
                  columns={roleColumns}
                  data={filteredRoles.slice((rolePage - 1) * rolePageSize, rolePage * rolePageSize)}
                  totalRecords={filteredRoles.length}
                  page={rolePage}
                  pageSize={rolePageSize}
                  onPageChange={setRolePage}
                  onPageSizeChange={setRolePageSize}
                  rowKey={(item: MockRole) => item.id}
                />
              </Card>
            </div>
          ) : isDefaultModuleRoute ? (
            /* VIEW 3: DEFAULT MODULES PAGE */
            <div data-testid="default-module-page" className="space-y-4">
              <Card
                flush
                title="Daftar Default Module"
                description="Modul contoh single-level flat CRUD yang dibuat otomatis dari template."
                actions={
                  <Button hierarchy="primary" leadingIcon={<AddCircle className="h-4 w-4" />}>
                    + Tambah Data
                  </Button>
                }
              >
                <TableToolbar
                  searchValue=""
                  onSearchChange={() => {}}
                  filterFields={[]}
                  onApply={() => {}}
                  onReset={() => {}}
                  actions={
                    <Button hierarchy="secondary" leadingIcon={<Download className="h-4 w-4" />}>
                      Export
                    </Button>
                  }
                />
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Modul data default siap digunakan. Anda dapat menambah atau mengedit data melalui tombol di atas.
                </div>
              </Card>
            </div>
          ) : isDefaultParentRoute ? (
            /* VIEW 4: DEFAULT PARENT NESTED PAGE */
            <div data-testid="default-parent-page" className="space-y-4">
              <Card
                flush
                title="Daftar Default Parent"
                description="Modul contoh parent-child nested CRUD yang dibuat otomatis dari template."
                actions={
                  <Button hierarchy="primary" leadingIcon={<AddCircle className="h-4 w-4" />}>
                    + Tambah Item
                  </Button>
                }
              >
                <TableToolbar
                  searchValue=""
                  onSearchChange={() => {}}
                  filterFields={[]}
                  onApply={() => {}}
                  onReset={() => {}}
                  actions={
                    <Button hierarchy="secondary" leadingIcon={<Download className="h-4 w-4" />}>
                      Export
                    </Button>
                  }
                />
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Struktur modul berjenjang (nested parent-child) siap digunakan.
                </div>
              </Card>
            </div>
          ) : isGeneratorRoute ? (
            /* VIEW 5: GENERATOR PAGE */
            <div data-testid="generator-page" className="space-y-4">
              <Card
                flush
                title="Module Generator Studio"
                description="Buat dan sesuaikan modul bisnis dinamis baru secara visual langsung di dalam aplikasi."
              >
                <div className="p-8 text-center space-y-3">
                  <Settings className="h-10 w-10 mx-auto text-primary" />
                  <h4 className="text-base font-semibold text-foreground">Generator Modul Siap Digunakan</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Anda dapat mendesain form, tabel, filter, dan skema validasi baru untuk aplikasi ini.
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            /* VIEW 6: DASHBOARD PAGE (IDENTIK PERSIS DENGAN IMAGE 1) */
            <div className="flex flex-col stack-gap" data-testid="dashboard-page">
              <Card title={`Welcome to ${project.name}`}>
                <p className="text-sm text-muted-foreground">
                  Hello {authenticatedUser.name}, your project is ready. Add modules and features to get started.
                </p>
              </Card>
              <Alert
                variant="info"
                message="Next step: create a new module with the module generator, or edit the example modules under src/modules."
              />
            </div>
          )}
        </AppShell>
      )}

      {/* Dialog Tambah User */}
      <Dialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        title="Tambah User Baru"
        footer={
          <div className="flex justify-end gap-2 pt-2">
            <Button hierarchy="secondary" onClick={() => setCreateUserOpen(false)}>
              Batal
            </Button>
            <Button
              hierarchy="primary"
              onClick={handleCreateUser}
              disabled={!newUserName.trim() || !newUserEmail.trim()}
            >
              Simpan
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Nama Lengkap</label>
            <InputField
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="cth. Hendra Gunawan"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Alamat Email</label>
            <InputField
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="cth. hendra@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Peran (Role)</label>
            <Select
              value={newUserRole}
              onChange={(val) => setNewUserRole(val as string)}
              options={[
                { value: 'Super Admin', label: 'Super Admin' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Staff Operasional', label: 'Staff Operasional' },
                { value: 'Viewer / Audit', label: 'Viewer / Audit' },
              ]}
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog Bulk Upload User */}
      <Dialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        title="Bulk Upload User (.xlsx / .csv)"
        footer={
          <div className="flex justify-end gap-2 pt-2">
            <Button hierarchy="secondary" onClick={() => setBulkUploadOpen(false)}>
              Batal
            </Button>
            <Button
              hierarchy="primary"
              onClick={() => {
                setBulkUploadOpen(false);
                showToast('Upload data massal berhasil diproses.');
              }}
            >
              Upload & Simpan
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-3">
          <p className="text-sm text-muted-foreground">
            Unggah file spreadsheet Excel (.xlsx) atau CSV dengan format kolom: Nama, Username, Email, Role.
          </p>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="mt-2 text-sm font-medium text-foreground">Pilih file atau seret file ke sini</span>
            <span className="mt-1 text-xs text-muted-foreground">Format yang didukung: .xlsx, .csv (Maks 5MB)</span>
          </div>
        </div>
      </Dialog>

      {/* Dialog Tambah Role */}
      <Dialog
        open={createRoleOpen}
        onClose={() => setCreateRoleOpen(false)}
        title="Tambah Role Baru"
        footer={
          <div className="flex justify-end gap-2 pt-2">
            <Button hierarchy="secondary" onClick={() => setCreateRoleOpen(false)}>
              Batal
            </Button>
            <Button
              hierarchy="primary"
              onClick={handleCreateRole}
              disabled={!newRoleName.trim() || !newRoleCode.trim()}
            >
              Simpan
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Nama Role</label>
            <InputField
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="cth. Finance Manager"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Kode Role</label>
            <InputField
              value={newRoleCode}
              onChange={(e) => setNewRoleCode(e.target.value)}
              placeholder="cth. finance_mgr"
            />
          </div>
        </div>
      </Dialog>
    </ThemeProvider>
  );
}
