/** Client definisi modul: service BE + mock seed JSON + resolver USE_MOCK. */
import api from '../../../shared/lib/api';
import type { ApiList, ApiResponse } from '../../../shared/types';
import type { ModuleDefinition } from '../definitions';

export const USE_MOCK = {
  list: true,
  get: true,
};

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

export const listDefinitions = USE_MOCK.list ? mockListDefinitions : serviceListDefinitions;
export const getDefinition = USE_MOCK.get ? mockGetDefinition : serviceGetDefinition;
