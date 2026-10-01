import type { GeneratedFile, ModuleRegistration } from '../types';

/** Endpoint dev-server (vite plugin `moduleWriter`) yang menulis file ke repo. */
const WRITE_ENDPOINT = '/__api/write-module';

export interface WriteToRepoResult {
  written: string[];
  /** Hasil auto-registrasi routes + navigasi (null bila tidak dikirim). */
  registered: { routes: number; navigation: boolean } | null;
}

/** Dilempar saat ada file yang sudah ada dan `overwrite === false`. */
export class WriteConflictError extends Error {
  existing: string[];

  constructor(existing: string[]) {
    super(`File sudah ada: ${existing.join(', ')}`);
    this.name = 'WriteConflictError';
    this.existing = existing;
  }
}

/** Dilempar saat endpoint dev-server tidak tersedia (mis. production build). */
export class WriteEndpointUnavailableError extends Error {
  constructor() {
    super('Endpoint tulis-repo tidak tersedia. Jalankan via `npm run dev`.');
    this.name = 'WriteEndpointUnavailableError';
  }
}

/** Tulis hasil generate langsung ke `src/modules/` via dev-server + daftarkan routes/nav. */
export async function writeModuleToRepo(
  files: GeneratedFile[],
  overwrite: boolean,
  registration?: ModuleRegistration,
): Promise<WriteToRepoResult> {
  let res: Response;
  try {
    res = await fetch(WRITE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files, overwrite, registration }),
    });
  } catch {
    throw new WriteEndpointUnavailableError();
  }
  if (res.status === 404) throw new WriteEndpointUnavailableError();
  if (res.status === 409) {
    const data = (await res.json()) as { existing?: string[] };
    throw new WriteConflictError(data.existing ?? []);
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Gagal menulis ke repo (HTTP ${res.status}).`);
  }
  return (await res.json()) as WriteToRepoResult;
}
