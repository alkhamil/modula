/** Client definisi modul: service BE + mock seed JSON + resolver USE_MOCK. */
import api from '../../../shared/lib/api';
import type { ApiList, ApiResponse } from '../../../shared/types';
import type { ModuleDefinition } from '../definitions';

export const USE_MOCK = {
  list: true,
  get: true,
  save: true,
};

export interface SaveDefinitionResult {
  definition: ModuleDefinition;
  /** True bila key belum ada (POST), false bila menimpa key lama (PUT). */
  created: boolean;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Seed kanonis BE (Fase 3) — satu-satunya sumber mock agar tidak drift.
const seedModules = import.meta.glob<ModuleDefinition>(
  '../../../../backend/seeds/definitions/*.json',
  { eager: true, import: 'default' },
);

let cachedDefinitions: ModuleDefinition[] | null = null;

function seedDefinitions(): ModuleDefinition[] {
  if (!cachedDefinitions) {
    cachedDefinitions = Object.values(seedModules).map((def) => ({ ...def }));
  }
  return cachedDefinitions;
}

async function serviceListDefinitions(status?: string): Promise<ModuleDefinition[]> {
  const res = await api.get<ApiResponse<ApiList<ModuleDefinition>>>('/api/v1/module-definitions', {
    params: status ? { status } : {},
  });
  return res.data.response_output?.list.content ?? [];
}

async function mockListDefinitions(status?: string): Promise<ModuleDefinition[]> {
  await delay(150);
  const all = seedDefinitions();
  return status ? all.filter((def) => def.status === status) : [...all];
}

async function serviceGetDefinition(key: string): Promise<ModuleDefinition> {
  const res = await api.get<ApiResponse<{ detail: ModuleDefinition }>>(
    `/api/v1/module-definitions/${encodeURIComponent(key)}`,
  );
  const detail = res.data.response_output?.detail;
  if (!detail) throw new Error(`Definisi "${key}" tidak ditemukan.`);
  return detail;
}

async function mockGetDefinition(key: string): Promise<ModuleDefinition> {
  await delay(150);
  const found = seedDefinitions().find((def) => def.key === key);
  if (!found) throw new Error(`Definisi "${key}" tidak ditemukan.`);
  return { ...found };
}

function axiosStatus(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== 'object' || response === null) return undefined;
  const status = (response as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

/** Upsert: PUT bila key ada, POST bila 404. */
async function serviceSaveDefinition(def: ModuleDefinition): Promise<SaveDefinitionResult> {
  const url = `/api/v1/module-definitions/${encodeURIComponent(def.key)}`;
  try {
    const res = await api.put<ApiResponse<{ detail: ModuleDefinition }>>(url, def);
    const detail = res.data.response_output?.detail;
    if (!detail) throw new Error(`Definisi "${def.key}" gagal disimpan.`);
    return { definition: detail, created: false };
  } catch (err) {
    if (axiosStatus(err) !== 404) throw err;
  }
  const res = await api.post<ApiResponse<{ detail: ModuleDefinition }>>(
    '/api/v1/module-definitions',
    def,
  );
  const detail = res.data.response_output?.detail;
  if (!detail) throw new Error(`Definisi "${def.key}" gagal disimpan.`);
  return { definition: detail, created: true };
}

async function mockSaveDefinition(def: ModuleDefinition): Promise<SaveDefinitionResult> {
  await delay(150);
  const cached = seedDefinitions();
  const stored = { ...def };
  const index = cached.findIndex((entry) => entry.key === def.key);
  if (index >= 0) {
    cached[index] = stored;
    return { definition: { ...stored }, created: false };
  }
  cached.push(stored);
  return { definition: { ...stored }, created: true };
}

export const listDefinitions = USE_MOCK.list ? mockListDefinitions : serviceListDefinitions;
export const getDefinition = USE_MOCK.get ? mockGetDefinition : serviceGetDefinition;
export const saveDefinition = USE_MOCK.save ? mockSaveDefinition : serviceSaveDefinition;
