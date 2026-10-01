import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleDefinitionEntity } from '../../definitions/entities/module-definition.entity';

/** Satu baris data milik satu modul dinamis (nilai field = kolom JSON `data`). */
@Entity({ name: 'records' })
@Index(['moduleKey', 'status'])
export class RecordEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 191 })
  moduleKey!: string;

  @ManyToOne(() => ModuleDefinitionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleKey', referencedColumnName: 'key' })
  definition!: ModuleDefinitionEntity;

  @Column({ type: 'json' })
  data!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 16, default: 'active' })
  status!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
