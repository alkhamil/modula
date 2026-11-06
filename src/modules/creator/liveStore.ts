import type { UiStyle } from '../../shared/theme';
import type { GeneratorConfig } from '../generator/types';

export interface ProjectLiveConfig {
  name: string;
  slug: string;
  theme: 'light' | 'dark';
  uiStyle: UiStyle;
  primaryColor?: string;
  logoUrl?: string | null;
  collapsedLogoUrl?: string | null;
  selectedPacks: string[];
  customModules?: GeneratorConfig[];
  updatedAt?: number;
}

const STORAGE_PREFIX = 'modula_live_project:';

export function saveProjectLiveConfig(config: ProjectLiveConfig): void {
  try {
    const key = `${STORAGE_PREFIX}${config.slug}`;
    const payload = { ...config, updatedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Storage quota or private browsing mode
  }
}

export function getProjectLiveConfig(slug: string): ProjectLiveConfig | null {
  try {
    const key = `${STORAGE_PREFIX}${slug}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as ProjectLiveConfig;
  } catch {
    return null;
  }
}

export function listProjectLiveConfigs(): ProjectLiveConfig[] {
  const configs: ProjectLiveConfig[] = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          configs.push(JSON.parse(raw) as ProjectLiveConfig);
        }
      }
    }
  } catch {
    // Storage error
  }
  return configs.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}
