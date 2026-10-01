import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleDefinitionEntity } from '../definitions/entities/module-definition.entity';
import { RecordEntity } from './entities/record.entity';
import { okResponse, type ApiResponse, type ListOutput } from '../common/envelope';
import {
  buildRecordQuery,
  toQueryMeta,
  uniqueFieldNames,
  type QueryFieldMeta,
} from './record-query';
import {
  bulkExampleRow,
  bulkHeaders,
  exportCellValue,
  exportHeaders,
  validateBulkRow,
  type BulkUploadResult,
} from './bulk';
import { buildWorkbook, readWorkbookRows, type ExcelCell } from './excel';
import type { BuiltRecordQuery } from './record-query';

/** Batas proteksi: export dibatasi 10rb baris, bulk 5rb baris per file. */
export const MAX_EXPORT_ROWS = 10000;
export const MAX_BULK_ROWS = 5000;

export interface RecordListItem {
  id: number;
  status: string;
  created_by: string | null;
  created_date: string;
  [field: string]: unknown;
}

export interface RecordDetail {
  id: string;
  status: string;
  createdBy: string;
  createdDate: string;
  [field: string]: unknown;
}

function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/** `Date` → `YYYY-MM-DD HH:mm` UTC (format kontrak `created_date`). */
function formatCreatedDate(value: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return (
    `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())} ` +
    `${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}`
  );
}

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly records: Repository<RecordEntity>,
    @InjectRepository(ModuleDefinitionEntity)
    private readonly definitions: Repository<ModuleDefinitionEntity>,
  ) {}

  private async resolveDefinition(apiPlural: string): Promise<ModuleDefinitionEntity> {
    const def = await this.definitions.findOne({ where: { apiPlural } });
    if (!def) throw new NotFoundException(`Modul "${apiPlural}" tidak ditemukan.`);
    return def;
  }

  private metaOf(def: ModuleDefinitionEntity): QueryFieldMeta[] {
    return toQueryMeta(def.fields);
  }

  /** Hanya field dikenal yang disimpan (body lain diabaikan). */
  private pickKnown(meta: QueryFieldMeta[], body: Record<string, unknown>): Record<string, unknown> {
    const known = new Set(meta.map((field) => field.name));
    const picked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (known.has(key)) picked[key] = value;
    }
    return picked;
  }

  private toListItem(row: RecordEntity, meta: QueryFieldMeta[]): RecordListItem {
    const item: RecordListItem = {
      id: row.id,
      status: row.status,
      created_by: row.createdBy,
      created_date: formatCreatedDate(row.createdAt),
    };
    for (const field of meta) item[field.name] = row.data[field.name] ?? null;
    return item;
  }

  private toDetail(row: RecordEntity, meta: QueryFieldMeta[]): RecordDetail {
    const detail: RecordDetail = {
      id: String(row.id),
      status: row.status,
      createdBy: row.createdBy ?? '',
      createdDate: formatCreatedDate(row.createdAt),
    };
    for (const field of meta) detail[field.name] = row.data[field.name] ?? null;
    return detail;
  }

  private async assertUnique(
    def: ModuleDefinitionEntity,
    data: Record<string, unknown>,
    excludeId?: number,
  ): Promise<void> {
    const meta = this.metaOf(def);
    for (const name of uniqueFieldNames(meta)) {
      const value = data[name];
      if (value === undefined || value === null || value === '') continue;
      const qb = this.records
        .createQueryBuilder('record')
        .select('record.id')
        .where('record.moduleKey = :moduleKey', { moduleKey: def.key })
        .andWhere(`record.data->>'$."${name}"' = :value`, { value: String(value) });
      if (excludeId !== undefined) qb.andWhere('record.id != :excludeId', { excludeId });
      const existing = await qb.getOne();
      if (existing) {
        throw new ConflictException(`Nilai "${name}" sudah dipakai, gunakan yang lain.`);
      }
    }
  }

  private async runListQuery(
    moduleKey: string,
    built: BuiltRecordQuery,
    page: number,
    size: number,
  ): Promise<[RecordEntity[], number]> {
    const qb = this.records
      .createQueryBuilder('record')
      .where('record.moduleKey = :moduleKey', { moduleKey });
    for (const fragment of built.where) qb.andWhere(fragment, built.params);
    qb.orderBy(built.orderExpr, built.orderDir).addOrderBy('record.id', 'ASC');
    qb.skip((page - 1) * size).take(size);
    return qb.getManyAndCount();
  }

  async list(
    apiPlural: string,
    query: Record<string, string | undefined>,
  ): Promise<ApiResponse<ListOutput<RecordListItem>>> {
    const def = await this.resolveDefinition(apiPlural);
    const meta = this.metaOf(def);
    const built = buildRecordQuery(meta, query);
    const [rows, total] = await this.runListQuery(def.key, built, built.page, built.size);
    const totalPages = Math.max(1, Math.ceil(total / built.size));
    const safePage = Math.min(built.page, totalPages);
    const content =
      safePage === built.page
        ? rows
        : (await this.runListQuery(def.key, built, safePage, built.size))[0];
    return okResponse({
      list: {
        pagination: {
          page: safePage,
          size: built.size,
          total_pages: totalPages,
          total_elements: total,
        },
        content: content.map((row) => this.toListItem(row, meta)),
      },
    });
  }

  async get(apiPlural: string, id: number): Promise<ApiResponse<{ detail: RecordDetail }>> {
    const def = await this.resolveDefinition(apiPlural);
    const row = await this.records.findOne({ where: { id, moduleKey: def.key } });
    if (!row) throw new NotFoundException('Data tidak ditemukan.');
    return okResponse({ detail: this.toDetail(row, this.metaOf(def)) });
  }

  async create(
    apiPlural: string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<{ detail: RecordDetail }>> {
    const def = await this.resolveDefinition(apiPlural);
    const meta = this.metaOf(def);
    const data = this.pickKnown(meta, body);
    await this.assertUnique(def, data);
    const saved = await this.records.save(
      this.records.create({ moduleKey: def.key, data, status: 'active', createdBy: null }),
    );
    return okResponse(
      { detail: this.toDetail(saved, meta) },
      'Data berhasil dibuat.',
      '201',
    );
  }

  async update(
    apiPlural: string,
    id: number,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<{ detail: RecordDetail }>> {
    const def = await this.resolveDefinition(apiPlural);
    const row = await this.records.findOne({ where: { id, moduleKey: def.key } });
    if (!row) throw new NotFoundException('Data tidak ditemukan.');
    const meta = this.metaOf(def);
    const data = this.pickKnown(meta, body);
    await this.assertUnique(def, data, id);
    const saved = await this.records.save({ ...row, data });
    return okResponse({ detail: this.toDetail(saved, meta) }, 'Data berhasil diubah.');
  }

  async remove(apiPlural: string, id: number): Promise<ApiResponse<null>> {
    const def = await this.resolveDefinition(apiPlural);
    const row = await this.records.findOne({ where: { id, moduleKey: def.key } });
    if (!row) throw new NotFoundException('Data tidak ditemukan.');
    if (def.deleteMode === 'hard') {
      await this.records.delete({ id });
      return okResponse(null, 'Data berhasil dihapus permanen.');
    }
    await this.records.save({ ...row, status: 'inactive' });
    return okResponse(null, 'Data berhasil dinonaktifkan.');
  }

  async restore(
    apiPlural: string,
    id: number,
  ): Promise<ApiResponse<{ detail: RecordDetail }>> {
    const def = await this.resolveDefinition(apiPlural);
    if (def.deleteMode !== 'soft') {
      throw new ConflictException('Modul ini memakai hapus permanen (tanpa restore).');
    }
    const row = await this.records.findOne({ where: { id, moduleKey: def.key } });
    if (!row) throw new NotFoundException('Data tidak ditemukan.');
    const saved = await this.records.save({ ...row, status: 'active' });
    return okResponse(
      { detail: this.toDetail(saved, this.metaOf(def)) },
      'Data berhasil dipulihkan.',
    );
  }

  private assertFeature(def: ModuleDefinitionEntity, feature: string): void {
    if ((def.features as Record<string, boolean> | null)?.[feature] !== true) {
      throw new NotFoundException(`Fitur ${feature} tidak aktif untuk modul ini.`);
    }
  }

  async exportWorkbook(
    apiPlural: string,
    query: Record<string, string | undefined>,
  ): Promise<{ filename: string; buffer: Buffer }> {
    const def = await this.resolveDefinition(apiPlural);
    this.assertFeature(def, 'export');
    const meta = this.metaOf(def);
    const built = buildRecordQuery(
      meta,
      { ...query, page: '1', size: String(MAX_EXPORT_ROWS) },
      MAX_EXPORT_ROWS,
    );
    const [rows] = await this.runListQuery(def.key, built, 1, MAX_EXPORT_ROWS);
    const labels = (def.fields as { label?: unknown }[]).map((field) =>
      String(field.label ?? ''),
    );
    const types = meta.map((field) => field.type);
    const headers = exportHeaders(labels.map((label) => ({ label })));
    const body: ExcelCell[][] = rows.map((row) => [
      ...meta.map((field, index) =>
        exportCellValue(types[index] ?? 'textField', row.data[field.name]),
      ),
      row.status,
      formatCreatedDate(row.createdAt),
    ]);
    const stamp = new Date().toISOString().slice(0, 10);
    return { filename: `${apiPlural}-${stamp}.xlsx`, buffer: buildWorkbook(headers, body) };
  }

  async bulkTemplate(apiPlural: string): Promise<{ filename: string; buffer: Buffer }> {
    const def = await this.resolveDefinition(apiPlural);
    this.assertFeature(def, 'bulkUpload');
    return {
      filename: `${apiPlural}-template.xlsx`,
      buffer: buildWorkbook(bulkHeaders(def.fields), [bulkExampleRow(def.fields)]),
    };
  }

  async bulkUpload(
    apiPlural: string,
    file: Buffer,
  ): Promise<ApiResponse<BulkUploadResult>> {
    const def = await this.resolveDefinition(apiPlural);
    this.assertFeature(def, 'bulkUpload');
    const { headers, rows } = readWorkbookRows(file);
    const expected = bulkHeaders(def.fields);
    const headerIndex = new Map(headers.map((header, i) => [header.trim().toLowerCase(), i]));
    const missing = expected.filter((header) => !headerIndex.has(header.trim().toLowerCase()));
    if (missing.length > 0) {
      return okResponse({
        totalRows: rows.length,
        successCount: 0,
        failedCount: rows.length,
        errors: missing.map((field) => ({
          row: 1,
          field,
          message: `Kolom "${field}" tidak ditemukan di file.`,
        })),
      });
    }
    if (rows.length === 0) {
      return okResponse({
        totalRows: 0,
        successCount: 0,
        failedCount: 0,
        errors: [{ row: 1, message: 'File tidak berisi data.' }],
      });
    }
    if (rows.length > MAX_BULK_ROWS) {
      throw new BadRequestException(`Maksimal ${MAX_BULK_ROWS} baris per upload.`);
    }
    const meta = this.metaOf(def);
    const taken = await this.preloadTakenValues(def.key, meta);
    const accepted: Record<string, unknown>[] = [];
    const errors: BulkUploadResult['errors'] = [];
    rows.forEach((row, index) => {
      const mapped: Record<string, unknown> = {};
      for (const header of expected) {
        const source = headers[headerIndex.get(header.trim().toLowerCase()) ?? -1] ?? '';
        mapped[header] = row[source] ?? '';
      }
      const { payload, errors: rowErrors } = validateBulkRow(def.fields, mapped, (field, value) =>
        taken.get(field)?.has(value) ?? false,
      );
      if (!payload) {
        for (const rowError of rowErrors) {
          errors.push({ row: index + 2, field: rowError.field, message: rowError.message });
        }
        return;
      }
      for (const name of uniqueFieldNames(meta)) {
        const value = payload[name];
        if (value !== undefined && value !== null && value !== '') {
          taken.get(name)?.add(String(value));
        }
      }
      accepted.push(payload);
    });
    if (accepted.length > 0) {
      await this.records.save(
        accepted.map((data) =>
          this.records.create({ moduleKey: def.key, data, status: 'active', createdBy: 'Bulk Upload' }),
        ),
      );
    }
    return okResponse({
      totalRows: rows.length,
      successCount: accepted.length,
      failedCount: rows.length - accepted.length,
      errors,
    });
  }

  /** Muat nilai existing per unique-field sekali (cek duplikat existing + dalam file). */
  private async preloadTakenValues(
    moduleKey: string,
    meta: QueryFieldMeta[],
  ): Promise<Map<string, Set<string>>> {
    const taken = new Map<string, Set<string>>();
    for (const name of uniqueFieldNames(meta)) {
      const rows = (await this.records
        .createQueryBuilder('record')
        .select(`DISTINCT record.data->>'$."${name}"'`, 'value')
        .where('record.moduleKey = :moduleKey', { moduleKey })
        .getRawMany<{ value: string | null }>()) as { value: string | null }[];
      taken.set(name, new Set(rows.map((row) => String(row.value ?? '')).filter(Boolean)));
    }
    return taken;
  }

  /**
   * Options satu field: `/{plural}/{field}s` (mis. `/users/roles`).
   * Static (mockStatic) → dari definisi; selebihnya → distinct dari records.
   */
  async options(
    apiPlural: string,
    fieldSegment: string,
    query: Record<string, string | undefined>,
  ): Promise<ApiResponse<ListOutput<{ label: string; value: string }>>> {
    const def = await this.resolveDefinition(apiPlural);
    const rawFields = def.fields as { name?: unknown; source?: unknown; options?: unknown }[];
    const target = rawFields.find(
      (field) => typeof field.name === 'string' && `${toKebab(field.name)}s` === fieldSegment,
    );
    if (!target || typeof target.name !== 'string') {
      throw new NotFoundException(`Options "${fieldSegment}" tidak ditemukan.`);
    }
    const search = query.search?.trim().toLowerCase() ?? '';
    const page = Math.max(Math.floor(Number(query.page)) || 1, 1);
    const size = Math.min(Math.max(Math.floor(Number(query.size)) || 20, 1), 100);
    if (target.source === 'mockStatic' && Array.isArray(target.options)) {
      const all = (target.options as { label?: unknown; value?: unknown }[])
        .filter(
          (opt): opt is { label: string; value: string } =>
            typeof opt.label === 'string' && typeof opt.value === 'string',
        )
        .filter((opt) => !search || opt.label.toLowerCase().includes(search));
      const total = all.length;
      const totalPages = Math.max(1, Math.ceil(total / size));
      const safePage = Math.min(page, totalPages);
      return okResponse({
        list: {
          pagination: {
            page: safePage,
            size,
            total_pages: totalPages,
            total_elements: total,
          },
          content: all.slice((safePage - 1) * size, safePage * size),
        },
      });
    }
    const rows = (await this.records
      .createQueryBuilder('record')
      .select(`DISTINCT record.data->>'$."${target.name}"'`, 'value')
      .where('record.moduleKey = :moduleKey', { moduleKey: def.key })
      .andWhere(`record.data->>'$."${target.name}"' IS NOT NULL`)
      .orderBy('value', 'ASC')
      .limit(500)
      .getRawMany<{ value: string | null }>()) as { value: string | null }[];
    const content = rows
      .map((row) => String(row.value ?? ''))
      .filter((value) => value !== '' && (!search || value.toLowerCase().includes(search)))
      .map((value) => ({ label: value, value }));
    const totalPages = Math.max(1, Math.ceil(content.length / size));
    const safePage = Math.min(page, totalPages);
    return okResponse({
      list: {
        pagination: {
          page: safePage,
          size,
          total_pages: totalPages,
          total_elements: content.length,
        },
        content: content.slice((safePage - 1) * size, safePage * size),
      },
    });
  }

  /** Resolve segmen `/{plural}/{segmen}`: options-field vs id numerik. */
  async resolveSegment(
    apiPlural: string,
    segment: string,
  ): Promise<{ kind: 'options' | 'detail'; fieldSegment?: string; id?: number }> {
    const def = await this.resolveDefinition(apiPlural);
    const rawFields = def.fields as { name?: unknown }[];
    const isOptions = rawFields.some(
      (field) => typeof field.name === 'string' && `${toKebab(field.name)}s` === segment,
    );
    if (isOptions) return { kind: 'options', fieldSegment: segment };
    if (/^\d+$/.test(segment)) return { kind: 'detail', id: Number(segment) };
    throw new NotFoundException(`"${segment}" tidak ditemukan.`);
  }
}
