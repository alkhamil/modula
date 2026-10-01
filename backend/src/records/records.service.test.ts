import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { RecordsService } from './records.service';
import type { RecordEntity } from './entities/record.entity';
import type { ModuleDefinitionEntity } from '../definitions/entities/module-definition.entity';

const FIELDS = [
  { name: 'name', type: 'textField', filterable: true, filterCriteria: 'contains', rules: ['required'] },
  { name: 'code', type: 'textField', filterable: true, filterCriteria: 'exact', rules: ['unique'] },
  { name: 'role', type: 'selectField', filterable: true, filterCriteria: 'optionExact', rules: [], source: 'mockStatic', options: [{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }] },
];

function defEntity(over: Record<string, unknown> = {}): ModuleDefinitionEntity {
  return {
    key: 'region',
    apiPlural: 'regions',
    deleteMode: 'soft',
    fields: FIELDS,
    ...over,
  } as unknown as ModuleDefinitionEntity;
}

function row(over: Record<string, unknown> = {}): RecordEntity {
  return {
    id: 7,
    moduleKey: 'region',
    data: { name: 'R1', code: 'C1', role: 'admin' },
    status: 'active',
    createdBy: 'System',
    createdAt: new Date('2024-03-02T09:20:00.000Z'),
    updatedAt: new Date('2024-03-02T09:20:00.000Z'),
    ...over,
  } as unknown as RecordEntity;
}

interface QbResult {
  rows?: RecordEntity[];
  total?: number;
  one?: RecordEntity | null;
  raw?: { value: string | null }[];
}

function makeQb(result: QbResult = {}): Record<string, (...args: unknown[]) => unknown> {
  const qb: Record<string, (...args: unknown[]) => unknown> = {};
  for (const method of ['select', 'where', 'andWhere', 'orderBy', 'addOrderBy', 'skip', 'take', 'limit']) {
    qb[method] = () => qb;
  }
  qb.getManyAndCount = async () => [result.rows ?? [], result.total ?? 0];
  qb.getOne = async () => result.one ?? null;
  qb.getRawMany = async () => result.raw ?? [];
  return qb;
}

interface SetupOpts {
  def?: ModuleDefinitionEntity | null;
  found?: RecordEntity | null;
  qb?: QbResult;
}

function setup(opts: SetupOpts = {}): {
  service: RecordsService;
  calls: { saved: unknown[]; deleted: unknown[] };
} {
  const calls: { saved: unknown[]; deleted: unknown[] } = { saved: [], deleted: [] };
  const definitions = {
    findOne: async () => (opts.def === undefined ? defEntity() : opts.def),
  } as unknown as Repository<ModuleDefinitionEntity>;
  const records = {
    findOne: async () => opts.found ?? null,
    create: (e: unknown) => e,
    save: async (e: unknown) => {
      calls.saved.push(e);
      return { ...row(), ...(e as object) };
    },
    delete: async (criteria: unknown) => {
      calls.deleted.push(criteria);
    },
    createQueryBuilder: () => makeQb(opts.qb),
  } as unknown as Repository<RecordEntity>;
  return { service: new RecordsService(records, definitions), calls };
}

describe('RecordsService', () => {
  it('list memetakan baris + pagination', async () => {
    const { service } = setup({ qb: { rows: [row()], total: 1 } });
    const res = await service.list('regions', { page: '1', size: '10' });
    const item = res.response_output?.list.content[0];
    assert.equal(item?.id, 7);
    assert.equal(item?.name, 'R1');
    assert.equal(item?.created_by, 'System');
    assert.equal(item?.created_date, '2024-03-02 09:20');
    assert.equal(res.response_output?.list.pagination.total_elements, 1);
  });

  it('list 404 bila plural tak dikenal', async () => {
    const { service } = setup({ def: null });
    await assert.rejects(service.list('nope', {}), NotFoundException);
  });

  it('get: id string di detail + 404', async () => {
    const { service } = setup({ found: row() });
    const res = await service.get('regions', 7);
    assert.equal(res.response_output?.detail.id, '7');
    assert.equal(res.response_output?.detail.createdBy, 'System');
    const { service: missing } = setup();
    await assert.rejects(missing.get('regions', 9), NotFoundException);
  });

  it('create: hanya field dikenal + 409 unik', async () => {
    const { service, calls } = setup({ qb: { one: null } });
    const res = await service.create('regions', { name: 'N', code: 'C9', hacker: 1 });
    assert.equal(res.response_schema.response_code, '201');
    assert.deepEqual((calls.saved[0] as { data: unknown }).data, { name: 'N', code: 'C9' });
    const { service: dupe } = setup({ qb: { one: row() } });
    await assert.rejects(dupe.create('regions', { code: 'C1' }), ConflictException);
  });

  it('update 404 + sukses', async () => {
    const { service } = setup();
    await assert.rejects(service.update('regions', 9, {}), NotFoundException);
    const { service: ok, calls } = setup({ found: row(), qb: { one: null } });
    const res = await ok.update('regions', 7, { name: 'Baru' });
    assert.equal(res.response_schema.response_message, 'Data berhasil diubah.');
    assert.deepEqual((calls.saved[0] as { data: unknown }).data, { name: 'Baru' });
  });

  it('remove soft vs hard', async () => {
    const { service, calls } = setup({ found: row() });
    await service.remove('regions', 7);
    assert.equal((calls.saved[0] as { status: string }).status, 'inactive');
    const hard = setup({ found: row(), def: defEntity({ deleteMode: 'hard' }) });
    await hard.service.remove('regions', 7);
    assert.deepEqual(hard.calls.deleted, [{ id: 7 }]);
  });

  it('restore: hard → 409, soft → active', async () => {
    const hard = setup({ found: row(), def: defEntity({ deleteMode: 'hard' }) });
    await assert.rejects(hard.service.restore('regions', 7), ConflictException);
    const { service, calls } = setup({ found: row({ status: 'inactive' }) });
    const res = await service.restore('regions', 7);
    assert.equal(res.response_output?.detail.status, 'active');
    assert.equal((calls.saved[0] as { status: string }).status, 'active');
  });

  it('options static: search + paging dari definisi', async () => {
    const { service } = setup();
    const res = await service.options('regions', 'roles', { search: 'adm' });
    assert.deepEqual(res.response_output?.list.content, [{ label: 'Admin', value: 'admin' }]);
    const { service: missing } = setup();
    await assert.rejects(missing.options('regions', 'nope', {}), NotFoundException);
  });

  it('options distinct dari records', async () => {
    const { service } = setup({ qb: { raw: [{ value: 'C1' }, { value: 'C2' }, { value: null }] } });
    const res = await service.options('regions', 'codes', {});
    assert.deepEqual(res.response_output?.list.content, [
      { label: 'C1', value: 'C1' },
      { label: 'C2', value: 'C2' },
    ]);
  });

  it('resolveSegment: options vs id vs 404', async () => {
    const { service } = setup();
    assert.deepEqual(await service.resolveSegment('regions', 'roles'), {
      kind: 'options',
      fieldSegment: 'roles',
    });
    assert.deepEqual(await service.resolveSegment('regions', '42'), { kind: 'detail', id: 42 });
    await assert.rejects(service.resolveSegment('regions', 'nope'), NotFoundException);
    const { service: missing } = setup({ def: null });
    await assert.rejects(missing.resolveSegment('nope', '1'), NotFoundException);
  });
});
