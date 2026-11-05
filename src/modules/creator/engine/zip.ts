/** Kemas peta file project jadi arsip `.zip` (Node-safe: hanya `fflate`, tanpa DOM). */
import { strToU8, zipSync, type Zippable } from 'fflate';
import type { FileMap } from './compose';

/** Semua file ditaruh di satu folder root `<rootDir>/` agar unzip tidak menyebar file. */
export function zipProjectFiles(files: FileMap, rootDir: string, assets: Record<string, Uint8Array> = {}): Uint8Array {
  const entries: Zippable = {};
  for (const [path, content] of Object.entries(files)) {
    entries[`${rootDir}/${path}`] = strToU8(content);
  }
  for (const [path, bytes] of Object.entries(assets)) {
    entries[`${rootDir}/${path}`] = bytes;
  }
  return zipSync(entries, { level: 6 });
}
