import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { Repository } from 'typeorm';
import { DefinitionsService } from './definitions.service';
import type { ModuleDefinitionEntity } from './entities/module-definition.entity';
import type { DefinitionDto } from './dto';

function entity(over: Partial<ModuleDefinitionEntity> = {}): ModuleDefinitionEntity {
  return {
    key: 'region',
    status: 'published',
    label: 'Regions',
    singularLabel: 'Region',
    parent: null,
    routeBase: 'regions',
    permissionKey: 'region',
    apiPlural: 'regions',
    moduleType: 'crud',
    features: { list: true },
    fields: [],
    layout: {},
    deleteMode: 'soft',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    ...over,
  } as ModuleDefinitionEntity;
}

function dto(over: Partial<DefinitionDto> = {}): DefinitionDto {
  return {
    version: 1,
    key: 'region',
    label: 'Regions',
    singularLabel: 'Region',
    parent: null,
    routeBase: 'regions',
    permissionKey: 'region',
    apiPlural: 'regions',
    moduleType: 'crud',
    features: { list: true },
    fields: [],
    layout: {},
    deleteMode: 'soft',
    status: 'draft',
    ...over,
  } as DefinitionDto;
}

interface FakeRepo {
  rows: ModuleDefinitionEntity[];
  findOneResult: ModuleDefinitionEntity | null;
  deleted: unknown[];
  saved: unknown[];
}

function setup(fake: Partial<FakeRepo> = {}): { service: DefinitionsService; state: FakeRepo } {
  const state: FakeRepo = {
    rows: [],
    findOneResult: null,
    deleted: [],
    saved: [],
    ...fake,
  };
  const repo = {
    findAndCount: async () => [state.rows, state.rows.length],
    find: async () => state.rows,
    findOne: async () => state.findOneResult,
    create: (e: unknown) => e,
    save: async (e: unknown) => {
      state.saved.push(e);
      return { ...entity(), ...(e as object) };
    },
    delete: async (criteria: unknown) => {
      state.deleted.push(criteria);
    },
  } as unknown as Repository<ModuleDefinitionEntity>;
  return { service: new DefinitionsService(repo), state };
}

describe('DefinitionsService', () => {
  it('list pagination + clamp halaman', async () => {
    const { service } = setup({ rows: [entity()] });
    const res = await service.list('published', 99, 10);
    assert.equal(res.response_output?.list.pagination.page, 1);
    assert.equal(res.response_output?.list.pagination.total_elements, 1);
    assert.equal(res.response_output?.list.content[0]?.key, 'region');
  });

  it('get 404 bila tidak ada', async () => {
    const { service } = setup();
    await assert.rejects(service.get('nope'), NotFoundException);
    const { service: ok } = setup({ findOneResult: entity() });
    const res = await ok.get('region');
    assert.equal(res.response_output?.detail.key, 'region');
  });

  it('create 409 bila key sudah ada', async () => {
    const { service } = setup({ findOneResult: entity() });
    await assert.rejects(service.create(dto()), ConflictException);
    const { service: ok, state } = setup();
    const res = await ok.create(dto());
    assert.equal(res.response_schema.response_code, '201');
    assert.equal(state.saved.length, 1);
  });

  it('update menolak key beda + 404', async () => {
    const { service } = setup({ findOneResult: entity() });
    await assert.rejects(service.update('region', dto({ key: 'other' })), BadRequestException);
    const { service: missing } = setup();
    await assert.rejects(missing.update('region', dto()), NotFoundException);
    const res = await service.update('region', dto({ label: 'Wilayah' }));
    assert.equal(res.response_schema.response_message, 'Definisi berhasil diubah.');
  });

  it('remove 404 + hapus', async () => {
    const { service } = setup();
    await assert.rejects(service.remove('nope'), NotFoundException);
    const { service: ok, state } = setup({ findOneResult: entity() });
    await ok.remove('region');
    assert.deepEqual(state.deleted, [{ key: 'region' }]);
  });
});
