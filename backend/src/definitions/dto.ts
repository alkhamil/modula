import {
  Equals,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  Matches,
  MaxLength,
  Min,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Body definisi modul (cermin ModuleDefinition v1 FE).
 * Validasi mendalam (fields/layout) dilakukan FE sebelum publish;
 * BE menegakkan bentuk + pola kunci + enum.
 */
export class DefinitionDto {
  @Equals(1)
  version!: number;

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/)
  key!: string;

  @IsString()
  @MaxLength(100)
  label!: string;

  @IsString()
  @MaxLength(100)
  singularLabel!: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  parent!: string | null;

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/)
  routeBase!: string;

  @Matches(/^[a-z][a-z0-9_]*$/)
  @MaxLength(100)
  permissionKey!: string;

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @MaxLength(100)
  apiPlural!: string;

  @IsIn(['crud'])
  moduleType!: string;

  @IsObject()
  features!: Record<string, boolean>;

  @IsArray()
  fields!: Record<string, unknown>[];

  @IsObject()
  layout!: Record<string, unknown>;

  @IsIn(['hard', 'soft'])
  deleteMode!: string;

  @IsIn(['draft', 'published'])
  status!: string;
}

export class ListDefinitionsQuery {
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number;
}
