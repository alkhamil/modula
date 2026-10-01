import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './database.config';

/**
 * DataSource untuk TypeORM CLI (migration:generate/run).
 * Dijalankan dari hasil build (`dist/`), entity via glob JS.
 */
const dataSource = new DataSource(
  buildDataSourceOptions(process.env, [__dirname + '/../**/*.entity.js']),
);

export default dataSource;
