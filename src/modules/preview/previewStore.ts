export interface PreviewConfig {
  name: string;
  slug: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  logoUrl?: string | null;
  collapsedLogoUrl?: string | null;
  selectedPacks: string[];
  updatedAt?: number;
}

const STORAGE_PREFIX = 'modula_preview_project:';

export function savePreviewConfig(config: PreviewConfig): void {
  try {
    const key = `${STORAGE_PREFIX}${config.slug}`;
    const payload = { ...config, updatedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Storage quota or private browsing mode
  }

  // Sinkronkan ke Go Backend bila backend tersedia di server
  fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: config.name,
      slug: config.slug,
      theme: config.theme,
      primaryColor: config.primaryColor || '',
      selectedPacks: config.selectedPacks,
    }),
  }).catch(() => undefined);
}

export function getPreviewConfig(slug: string): PreviewConfig | null {
  try {
    const key = `${STORAGE_PREFIX}${slug}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as PreviewConfig;
  } catch {
    return null;
  }
}
