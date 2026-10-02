/* eslint-disable no-console */
/** Bersihkan SEMUA modul: hapus seluruh records + definisi. Jalan: `npm run db:clean`. */
import 'reflect-metadata';
import dataSource from '../config/data-source';
import { ModuleDefinitionEntity } from '../definitions/entities/module-definition.entity';
import { RecordEntity } from '../records/entities/record.entity';

async function main(): Promise<void> {
  await dataSource.initialize();
  try {
    const defRepo = dataSource.getRepository(ModuleDefinitionEntity);
    const recordRepo = dataSource.getRepository(RecordEntity);
    // Records dulu (FK ke definitions), lalu definisi.
    await recordRepo.delete({});
    await defRepo.delete({});
    console.log('db:clean OK — records + module_definitions dikosongkan.');
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
