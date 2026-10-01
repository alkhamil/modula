import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/** Cermin DB dari ModuleDefinition v1 (kontrak: docs/backend-contract.md). */
@Entity({ name: 'module_definitions' })
export class ModuleDefinitionEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  key!: string;

  @Column({ type: 'varchar', length: 16, default: 'draft' })
  status!: string;

  @Column({ type: 'varchar', length: 100 })
  label!: string;

  @Column({ type: 'varchar', length: 100 })
  singularLabel!: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  parent!: string | null;

  @Column({ type: 'varchar', length: 191, unique: true })
  routeBase!: string;

  @Column({ type: 'varchar', length: 100 })
  permissionKey!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  apiPlural!: string;

  @Column({ type: 'varchar', length: 16, default: 'crud' })
  moduleType!: string;

  @Column({ type: 'json' })
  features!: Record<string, boolean>;

  @Column({ type: 'json' })
  fields!: Record<string, unknown>[];

  @Column({ type: 'json' })
  layout!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 8, default: 'soft' })
  deleteMode!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
