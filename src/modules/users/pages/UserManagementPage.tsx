import { useState, useEffect, useMemo } from 'react';
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
import { AddCircle, Pen2 } from '../../../shared/components/icons';
import { getStoredToken } from '../../auth/authApi';
import type { AppRole, UserProfile } from '../../auth/types';
import { SEED_ACCOUNTS } from '../../auth/types';

const INITIAL_USERS: UserProfile[] = SEED_ACCOUNTS.map((acc, i) => ({
  id: `usr-${i + 1}`,
  name: acc.name,
  email: acc.email,
  role: acc.role,
  status: 'ACTIVE',
  permissions: acc.role === 'SUPER_ADMIN' || acc.role === 'ADMIN' ? ['*'] : ['projects.view'],
  createdAt: '2026-11-07',
  lastLogin: 'Hari ini',
}));

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserProfile | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('modula123');
  const [formRole, setFormRole] = useState<AppRole>('PRESALES');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    fetch('/api/v1/users', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => (res.ok ? res.json() : INITIAL_USERS))
      .then((data: UserProfile[]) => setUsers(data))
      .catch(() => setUsers(INITIAL_USERS));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === 'all' || u.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [users, search, filterRole]);

  const columns: Column<UserProfile>[] = [
    {
      key: 'name',
      header: 'Nama Pengguna',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Peran Akun',
      render: (row) => (
        <Badge
          variant={
            row.role === 'SUPER_ADMIN' || row.role === 'ADMIN'
              ? 'primary'
              : row.role === 'DEVELOPER'
                ? 'info'
                : row.role === 'QA'
                  ? 'warning'
                  : 'neutral'
          }
          size="sm"
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
          {row.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Terdaftar',
      render: (row) => <span className="text-xs text-muted-foreground">{row.createdAt?.slice(0, 10)}</span>,
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: 'role',
      label: 'Peran',
      type: 'select',
      options: [
        { label: 'Semua Peran', value: 'all' },
        { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'PRESALES', value: 'PRESALES' },
        { label: 'BPA', value: 'BPA' },
        { label: 'UI_UX', value: 'UI_UX' },
        { label: 'DEVELOPER', value: 'DEVELOPER' },
        { label: 'QA', value: 'QA' },
      ],
    },
  ];

  async function handleCreateUser() {
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setDialogError('Harap lengkapi semua isian formulir');
      return;
    }

    const token = getStoredToken();
    try {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          role: formRole,
        }),
      });

      if (res.ok) {
        const created = (await res.json()) as UserProfile;
        setUsers([created, ...users]);
      } else {
        // Fallback local
        const newU: UserProfile = {
          id: `usr-${Date.now()}`,
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          status: 'ACTIVE',
          permissions: formRole === 'SUPER_ADMIN' || formRole === 'ADMIN' ? ['*'] : ['projects.view'],
          createdAt: new Date().toISOString(),
          lastLogin: null,
        };
        setUsers([newU, ...users]);
      }
      setCreateOpen(false);
    } catch {
      setDialogError('Gagal menambahkan pengguna');
    }
  }

  async function handleUpdateUser() {
    if (!editTarget) return;

    const token = getStoredToken();
    try {
      await fetch(`/api/v1/users/${editTarget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formName.trim(),
          role: formRole,
          status: formStatus,
        }),
      });
    } catch {}

    setUsers(
      users.map((u) =>
        u.id === editTarget.id
          ? { ...u, name: formName.trim(), role: formRole, status: formStatus }
          : u,
      ),
    );
    setEditTarget(null);
  }

  return (
    <div className="page-padding flex flex-col section-gap">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manajemen Akun Internal
          </h1>
          <Badge variant="primary" size="sm">
            Admin Only
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Kelola akun tim internal Modula, penetapan peran (RBAC), dan status akses platform.
        </p>
      </div>

      <Card>
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          filterFields={filterFields}
          filterValues={{ role: filterRole }}
          onApply={(vals) => setFilterRole(String(vals['role'] ?? 'all'))}
          onReset={() => setFilterRole('all')}
          actions={
            <Button
              leadingIcon={<AddCircle className="h-4 w-4" />}
              onClick={() => {
                setFormName('');
                setFormEmail('');
                setFormPassword('modula123');
                setFormRole('PRESALES');
                setDialogError(null);
                setCreateOpen(true);
              }}
            >
              Tambah Pengguna
            </Button>
          }
        />

        <Table
          rowKey={(row) => row.id}
          columns={columns}
          data={filteredUsers}
          totalRecords={filteredUsers.length}
          page={1}
          pageSize={20}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          renderAction={(row) => (
            <div className="flex items-center justify-end">
              <Button
                size="xs"
                hierarchy="secondary"
                onClick={() => {
                  setEditTarget(row);
                  setFormName(row.name);
                  setFormEmail(row.email);
                  setFormRole(row.role);
                  setFormStatus(row.status);
                  setDialogError(null);
                }}
              >
                <Pen2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      </Card>

      {/* Dialog Tambah Pengguna */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Daftarkan Akun Internal Baru"
        description="Akun ini langsung aktif dan dapat digunakan untuk login internal Modula."
        footer={
          <div className="flex justify-end gap-2">
            <Button hierarchy="secondary" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateUser}>Daftarkan Akun</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3.5 pt-2">
          {dialogError && <Alert variant="error" message={dialogError} />}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
            <InputField
              placeholder="Contoh: Rian Anggara"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Alamat Email Internal</label>
            <InputField
              type="email"
              placeholder="rian@modula.io"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Kata Sandi</label>
            <InputField
              type="password"
              placeholder="••••••••"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Peran (Role RBAC)</label>
            <Select
              value={formRole}
              onChange={(v) => setFormRole(v as AppRole)}
              options={[
                { label: 'Super Administrator (SUPER_ADMIN)', value: 'SUPER_ADMIN' },
                { label: 'Administrator (ADMIN)', value: 'ADMIN' },
                { label: 'Presales Consultant (PRESALES)', value: 'PRESALES' },
                { label: 'Business Process Analyst (BPA)', value: 'BPA' },
                { label: 'UI/UX Specialist (UI_UX)', value: 'UI_UX' },
                { label: 'Frontend Developer (DEVELOPER)', value: 'DEVELOPER' },
                { label: 'Quality Assurance (QA)', value: 'QA' },
              ]}
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog Edit Pengguna */}
      <Dialog
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Ubah Data Akun Internal"
        footer={
          <div className="flex justify-end gap-2">
            <Button hierarchy="secondary" onClick={() => setEditTarget(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdateUser}>Simpan Perubahan</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3.5 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
            <InputField
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Alamat Email (Read-Only)</label>
            <InputField value={formEmail} disabled />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Peran (Role RBAC)</label>
            <Select
              value={formRole}
              onChange={(v) => setFormRole(v as AppRole)}
              options={[
                { label: 'Super Administrator (SUPER_ADMIN)', value: 'SUPER_ADMIN' },
                { label: 'Administrator (ADMIN)', value: 'ADMIN' },
                { label: 'Presales Consultant (PRESALES)', value: 'PRESALES' },
                { label: 'Business Process Analyst (BPA)', value: 'BPA' },
                { label: 'UI/UX Specialist (UI_UX)', value: 'UI_UX' },
                { label: 'Frontend Developer (DEVELOPER)', value: 'DEVELOPER' },
                { label: 'Quality Assurance (QA)', value: 'QA' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Status Akun</label>
            <Select
              value={formStatus}
              onChange={(v) => setFormStatus(v as 'ACTIVE' | 'INACTIVE')}
              options={[
                { label: 'Aktif (Dapat Login)', value: 'ACTIVE' },
                { label: 'Nonaktif (Akses Ditutup)', value: 'INACTIVE' },
              ]}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
