import type { GeneratorConfig } from '../generator/types';
import { composeProject, composeProjectAssets, slugifyProjectName, type ProjectOptions } from './engine/compose';
import { zipProjectFiles } from './engine/zip';
import { loadProjectSources } from './sources';

export interface CreateProjectInput {
  /** Nama tampil project. */
  name: string;
  /** Tampilan & runtime project (thema, warna, logo) — semua opsional. */
  options?: Omit<ProjectOptions, 'name' | 'slug'>;
  /** Id pack pilihan (pack `locked` dan dependensi `requires` ikut otomatis). */
  selectedPacks: string[];
  /** Modul CRUD tambahan yang dikonfigurasi user di wizard (opsional). */
  customModules?: GeneratorConfig[];
}

export interface CreatedProject {
  blob: Blob;
  fileName: string;
  fileCount: number;
  project: ProjectOptions;
}

/** Susun project dari pilihan wizard menjadi `.zip` (seluruhnya di browser, tanpa server). */
export async function createProjectZip(input: CreateProjectInput): Promise<CreatedProject> {
  const project: ProjectOptions = { ...input.options, name: input.name.trim(), slug: slugifyProjectName(input.name) };
  const sources = await loadProjectSources();
  const files = composeProject({
    ...sources,
    selected: input.selectedPacks,
    customModules: input.customModules,
    project,
  });
  const zip = zipProjectFiles(files, project.slug, composeProjectAssets(project));
  return {
    blob: new Blob([zip as BlobPart], { type: 'application/zip' }),
    fileName: `${project.slug}.zip`,
    fileCount: Object.keys(files).length,
    project,
  };
}

/** Picu unduhan file di browser. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
