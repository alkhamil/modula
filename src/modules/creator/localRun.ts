import type { ProjectThemeMode } from './engine/compose';
import type { UiStyle } from '../../shared/theme';
import { readBrandAsset } from './brand';

const TOKEN_META = 'modula-run-token';

export interface LocalRunInput {
  name: string;
  selectedPacks: string[];
  theme: ProjectThemeMode;
  uiStyle: UiStyle;
  primaryColor?: string;
  logoFile?: File | null;
  collapsedLogoFile?: File | null;
}

export interface LocalRunResult {
  url: string;
  port: number;
  slug: string;
  files: number;
}

/** Token sesi dev yang disuntikkan ke index.html oleh project-runner; tidak ada di production build. */
function runToken(): string | null {
  return document.querySelector(`meta[name="${TOKEN_META}"]`)?.getAttribute('content') ?? null;
}

export function localRunAvailable(): boolean {
  return runToken() !== null;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

async function logoPayload(file?: File | null): Promise<{ ext: string; base64: string } | undefined> {
  if (!file) return undefined;
  const asset = await readBrandAsset(file);
  return { ext: asset.ext, base64: toBase64(asset.bytes) };
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const token = runToken();
  if (!token) throw new Error('unavailable');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-modula-token': token },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data;
}

/** Jalankan project di localhost (server dev menyusunnya dari template repo; yang dikirim hanya opsi wizard). */
export async function runProjectLocally(input: LocalRunInput): Promise<LocalRunResult> {
  return post<LocalRunResult>('/__api/run-project', {
    name: input.name,
    selectedPacks: input.selectedPacks,
    options: {
      theme: input.theme,
      uiStyle: input.uiStyle,
      primaryColor: input.primaryColor,
      brand: {
        logo: await logoPayload(input.logoFile),
        collapsedLogo: await logoPayload(input.collapsedLogoFile),
      },
    },
  });
}

export async function stopProjectLocally(slug: string): Promise<void> {
  await post<{ ok: boolean }>('/__api/stop-project', { slug });
}
