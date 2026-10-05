import type { ModuleDefinition } from '../definitions';
import { definitionToConfig } from '../engine/fromDefinition';
import { buildRegistration } from '../engine/registration';
import { WriteEndpointUnavailableError } from './writeToRepo';

/** Dev-server endpoint (vite plugin `moduleWriter`) yang menghapus modul dari repo. */
const DELETE_ENDPOINT = '/__api/delete-module';

export interface DeleteFromRepoResult {
  deleted: string[];
  removedRoutes: number;
  removedNav: boolean;
}

/**
 * Hapus modul dari repo: direktori `src/modules/...` + routes + nav.
 * Endpoint tulis hanya ada di dev-server; di luar itu lempar
 * `WriteEndpointUnavailableError` (pemanggil sebaiknya mengabaikannya —
 * hapus definisi mock tetap jalan).
 */
export async function deleteModuleFromRepo(
  def: ModuleDefinition,
): Promise<DeleteFromRepoResult> {
  const config = definitionToConfig(def);
  const registration = buildRegistration(config);
  const moduleDir = `src/modules/${registration.moduleImportPath.replace(/^\.\.\//, '')}`;
  let res: Response;
  try {
    res = await fetch(DELETE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleDir, registration }),
    });
  } catch {
    throw new WriteEndpointUnavailableError();
  }
  if (res.status === 404) throw new WriteEndpointUnavailableError();
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Failed to delete from repo (HTTP ${res.status}).`);
  }
  return (await res.json()) as DeleteFromRepoResult;
}
