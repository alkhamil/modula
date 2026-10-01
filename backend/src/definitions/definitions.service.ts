import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleDefinitionEntity } from './entities/module-definition.entity';
import { okResponse, type ApiResponse, type ListOutput } from '../common/envelope';
import type { DefinitionDto } from './dto';

export interface DefinitionJson {
  version: number;
  key: string;
  label: string;
  singularLabel: string;
  parent: string | null;
  routeBase: string;
  permissionKey: string;
  apiPlural: string;
  moduleType: string;
  features: Record<string, boolean>;
  fields: Record<string, unknown>[];
  layout: Record<string, unknown>;
  deleteMode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function toJson(entity: ModuleDefinitionEntity): DefinitionJson {
  return {
    version: 1,
    key: entity.key,
    label: entity.label,
    singularLabel: entity.singularLabel,
    parent: entity.parent,
    routeBase: entity.routeBase,
    permissionKey: entity.permissionKey,
    apiPlural: entity.apiPlural,
    moduleType: entity.moduleType,
    features: entity.features,
    fields: entity.fields,
    layout: entity.layout,
    deleteMode: entity.deleteMode,
    status: entity.status,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class DefinitionsService {
  constructor(
    @InjectRepository(ModuleDefinitionEntity)
    private readonly repo: Repository<ModuleDefinitionEntity>,
  ) {}

  async list(
    status: string | undefined,
    page: number,
    size: number,
  ): Promise<ApiResponse<ListOutput<DefinitionJson>>> {
    const where = status ? { status } : {};
    const [rows, total] = await this.repo.findAndCount({
      where,
      order: { updatedAt: 'DESC' },
      skip: (Math.max(page, 1) - 1) * size,
      take: Math.min(Math.max(size, 1), 100),
    });
    const safeSize = Math.min(Math.max(size, 1), 100);
    const totalPages = Math.max(1, Math.ceil(total / safeSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    let content = rows.map(toJson);
    if (safePage !== Math.max(page, 1) && total > 0) {
      const rerun = await this.repo.find({
        where,
        order: { updatedAt: 'DESC' },
        skip: (safePage - 1) * safeSize,
        take: safeSize,
      });
      content = rerun.map(toJson);
    }
    return okResponse({
      list: {
        pagination: {
          page: safePage,
          size: safeSize,
          total_pages: totalPages,
          total_elements: total,
        },
        content,
      },
    });
  }

  async get(key: string): Promise<ApiResponse<{ detail: DefinitionJson }>> {
    const entity = await this.repo.findOne({ where: { key } });
    if (!entity) throw new NotFoundException(`Definisi "${key}" tidak ditemukan.`);
    return okResponse({ detail: toJson(entity) });
  }

  async create(dto: DefinitionDto): Promise<ApiResponse<{ detail: DefinitionJson }>> {
    const existing = await this.repo.findOne({ where: { key: dto.key } });
    if (existing) throw new ConflictException(`Definisi "${dto.key}" sudah ada.`);
    const saved = await this.repo.save(this.repo.create({ ...dto }));
    return okResponse({ detail: toJson(saved) }, 'Definisi berhasil dibuat.', '201');
  }

  async update(
    key: string,
    dto: DefinitionDto,
  ): Promise<ApiResponse<{ detail: DefinitionJson }>> {
    if (dto.key !== key) {
      throw new BadRequestException('Key body harus sama dengan key path (key immutable).');
    }
    const existing = await this.repo.findOne({ where: { key } });
    if (!existing) throw new NotFoundException(`Definisi "${key}" tidak ditemukan.`);
    const saved = await this.repo.save({ ...existing, ...dto });
    return okResponse({ detail: toJson(saved) }, 'Definisi berhasil diubah.');
  }

  async remove(key: string): Promise<ApiResponse<null>> {
    const existing = await this.repo.findOne({ where: { key } });
    if (!existing) throw new NotFoundException(`Definisi "${key}" tidak ditemukan.`);
    await this.repo.delete({ key });
    return okResponse(null, 'Definisi berhasil dihapus.');
  }
}
