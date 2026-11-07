export type ProjectAccessLevel = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface ProjectMember {
  userId: string;
  name: string;
  email: string;
  accessLevel: ProjectAccessLevel;
  addedAt: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  logoUrl?: string | null;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  members: ProjectMember[];
  selectedPacks: string[];
  createdAt: string;
  updatedAt: string;
  status: 'ready' | 'archived';
}

export interface CreateProjectPayload {
  name: string;
  slug?: string;
  description?: string;
  theme?: 'light' | 'dark';
  primaryColor?: string;
  logoUrl?: string | null;
  selectedPacks?: string[];
}
