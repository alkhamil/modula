/* eslint-disable no-console */
/** Seed idempoten: definisi (upsert) + records (replace per modul). Jalan: `npm run seed`. */
import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import dataSource from '../config/data-source';
import { ModuleDefinitionEntity } from '../definitions/entities/module-definition.entity';
import { RecordEntity } from '../records/entities/record.entity';

const SEEDS_DIR = path.resolve(__dirname, '..', '..', 'seeds');

interface SeedRow {
  id: number;
  data: Record<string, unknown>;
  status: string;
  createdBy: string | null;
  createdAt: string;
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

async function main(): Promise<void> {
  await dataSource.initialize();
  try {
    const defRepo = dataSource.getRepository(ModuleDefinitionEntity);
    const recordRepo = dataSource.getRepository(RecordEntity);

    const defDir = path.join(SEEDS_DIR, 'definitions');
    const defFiles = fs.readdirSync(defDir).filter((file) => file.endsWith('.json'));
    for (const file of defFiles) {
      const def = readJson<Record<string, unknown>>(path.join(defDir, file));
      await defRepo.save(defRepo.create(def));
      console.log(`definition: ${String(def.key)}`);
    }

    const recDir = path.join(SEEDS_DIR, 'records');
    const recFiles = fs.readdirSync(recDir).filter((file) => file.endsWith('.json'));
    for (const file of recFiles) {
      const { moduleKey, rows } = readJson<{ moduleKey: string; rows: SeedRow[] }>(
        path.join(recDir, file),
      );
      await recordRepo.delete({ moduleKey });
      for (let i = 0; i < rows.length; i += 200) {
        const chunk = rows.slice(i, i + 200).map((row) =>
          recordRepo.create({
            id: row.id,
            moduleKey,
            data: row.data,
            status: row.status,
            createdBy: row.createdBy,
            createdAt: new Date(row.createdAt),
          }),
        );
        await recordRepo.save(chunk);
      }
      console.log(`records: ${moduleKey} (${rows.length} rows)`);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
