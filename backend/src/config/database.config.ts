import type { DataSourceOptions } from 'typeorm';

/** Subset env yang dipakai koneksi DB (diisi ConfigService di app, process.env di CLI). */
export interface DbEnv {
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USER?: string;
  DB_PASS?: string;
  DB_NAME?: string;
  DB_SYNCHRONIZE?: string;
}

/** Opsi DataSource tunggal — dipakai AppModule (via ConfigService) dan CLI migrasi. */
export function buildDataSourceOptions(
  env: DbEnv,
  entities: DataSourceOptions['entities'],
): DataSourceOptions {
  return {
    type: 'mysql',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 3306),
    username: env.DB_USER ?? 'root',
    password: env.DB_PASS ?? 'rootpass',
    database: env.DB_NAME ?? 'appdb',
    entities,
    migrations: ['dist/migrations/*.js'],
    synchronize: (env.DB_SYNCHRONIZE ?? 'false') === 'true',
    charset: 'utf8mb4_unicode_ci',
  };
}
