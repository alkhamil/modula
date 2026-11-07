import { getStoredToken, getStoredUser } from '../auth/authApi';
import type { WorkspaceProject, CreateProjectPayload } from './types';

const STORAGE_KEY = 'modula_workspace_projects';

const DEFAULT_PROJECTS: WorkspaceProject[] = [
  {
    id: 'prj-enterprise-portal',
    name: 'Enterprise Portal',
    slug: 'enterprise-portal',
    description: 'Portal utama manajemen data master perusahaan, pengguna, dan hak akses staf operasional.',
    theme: 'light',
    primaryColor: '#00487a',
    ownerId: 'usr-superadmin',
    ownerName: 'Super Administrator',
    ownerEmail: 'superadmin@modula.io',
    members: [
      { userId: 'usr-bpa', name: 'Business Process Analyst', email: 'bpa@modula.io', accessLevel: 'EDITOR', addedAt: new Date().toISOString() },
      { userId: 'usr-developer', name: 'Frontend Developer', email: 'developer@modula.io', accessLevel: 'VIEWER', addedAt: new Date().toISOString() },
    ],
    selectedPacks: ['login', 'user', 'role', 'generator'],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'ready',
  },
  {
    id: 'prj-finance-billing',
    name: 'Finance & Billing CMS',
    slug: 'finance-billing',
    description: 'Aplikasi tagihan berkala, rekonsiliasi pembayaran mitra, dan laporan audit keuangan.',
    theme: 'light',
    primaryColor: '#0f766e',
    ownerId: 'usr-presales',
    ownerName: 'Presales Consultant',
    ownerEmail: 'presales@modula.io',
    members: [
      { userId: 'usr-superadmin', name: 'Super Administrator', email: 'superadmin@modula.io', accessLevel: 'OWNER', addedAt: new Date().toISOString() },
    ],
    selectedPacks: ['login', 'user', 'role'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    status: 'ready',
  },
];

export function normalizeProject(raw: Partial<WorkspaceProject>): WorkspaceProject {
  return {
    id: raw.id || `prj-${raw.slug || Date.now()}`,
    name: raw.name || raw.slug || 'Untitled Project',
    slug: raw.slug || 'untitled',
    description: raw.description || '',
    theme: raw.theme || 'light',
    primaryColor: raw.primaryColor || '#00487a',
    logoUrl: raw.logoUrl || null,
    ownerId: raw.ownerId || 'usr-superadmin',
    ownerName: raw.ownerName || 'Super Administrator',
    ownerEmail: raw.ownerEmail || 'superadmin@modula.io',
    members: Array.isArray(raw.members) ? raw.members : [],
    selectedPacks: Array.isArray(raw.selectedPacks) ? raw.selectedPacks : ['login', 'user', 'role', 'generator'],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
    status: raw.status || 'ready',
  };
}

function readLocalProjects(): WorkspaceProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeProject);
    }
    return DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

function writeLocalProjects(projects: WorkspaceProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {}
}

export async function fetchWorkspaceProjects(): Promise<WorkspaceProject[]> {
  const token = getStoredToken();
  try {
    const res = await fetch('/api/v1/projects', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = (await res.json()) as Partial<WorkspaceProject>[];
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeProject);
        writeLocalProjects(normalized);
        return normalized;
      }
    }
  } catch {}

  return readLocalProjects();
}

export async function getWorkspaceProject(slug: string): Promise<WorkspaceProject | null> {
  const token = getStoredToken();
  try {
    const res = await fetch(`/api/v1/projects/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = (await res.json()) as Partial<WorkspaceProject>;
      if (data && data.slug) {
        return normalizeProject(data);
      }
    }
  } catch {}

  const all = readLocalProjects();
  const found = all.find((p) => p.slug === slug);
  return found ? normalizeProject(found) : null;
}

export async function createWorkspaceProject(payload: CreateProjectPayload): Promise<WorkspaceProject> {
  const token = getStoredToken();
  const currentUser = getStoredUser();

  try {
    const res = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = normalizeProject((await res.json()) as Partial<WorkspaceProject>);
      const local = readLocalProjects();
      writeLocalProjects([created, ...local.filter((p) => p.slug !== created.slug)]);
      return created;
    }
  } catch {}

  // Fallback lokal jika offline
  const now = new Date().toISOString();
  const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newProj: WorkspaceProject = normalizeProject({
    id: `prj-${Date.now()}`,
    name: payload.name,
    slug,
    description: payload.description || '',
    theme: payload.theme || 'light',
    primaryColor: payload.primaryColor || '#00487a',
    logoUrl: payload.logoUrl || null,
    ownerId: currentUser?.id || 'usr-local',
    ownerName: currentUser?.name || 'Local User',
    ownerEmail: currentUser?.email || 'user@modula.io',
    members: [],
    selectedPacks: payload.selectedPacks || ['login', 'user', 'role', 'generator'],
    createdAt: now,
    updatedAt: now,
    status: 'ready',
  });

  const current = readLocalProjects();
  writeLocalProjects([newProj, ...current]);
  return newProj;
}

export async function deleteWorkspaceProject(slug: string): Promise<void> {
  const token = getStoredToken();
  try {
    await fetch(`/api/v1/projects/${slug}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {}

  const current = readLocalProjects();
  writeLocalProjects(current.filter((p) => p.slug !== slug));
}

export async function shareWorkspaceProject(
  slug: string,
  targetEmail: string,
  accessLevel: 'EDITOR' | 'VIEWER',
): Promise<WorkspaceProject> {
  const token = getStoredToken();
  try {
    const res = await fetch(`/api/v1/projects/${slug}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email: targetEmail, accessLevel }),
    });
    if (res.ok) {
      const updated = normalizeProject((await res.json()) as Partial<WorkspaceProject>);
      const current = readLocalProjects();
      writeLocalProjects(current.map((p) => (p.slug === slug ? updated : p)));
      return updated;
    }
  } catch {}

  const current = readLocalProjects();
  const target = current.find((p) => p.slug === slug);
  if (!target) throw new Error('Proyek tidak ditemukan');

  const members = Array.isArray(target.members) ? target.members : [];
  const existingMember = members.find((m) => (m.email || '').toLowerCase() === targetEmail.toLowerCase());
  if (existingMember) {
    existingMember.accessLevel = accessLevel;
  } else {
    members.push({
      userId: `usr-${Date.now()}`,
      name: targetEmail.split('@')[0]!,
      email: targetEmail,
      accessLevel,
      addedAt: new Date().toISOString(),
    });
  }
  target.members = members;
  target.updatedAt = new Date().toISOString();
  writeLocalProjects(current);
  return target;
}
