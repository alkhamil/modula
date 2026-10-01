import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleDefinitionEntity } from '../definitions/entities/module-definition.entity';
import { RecordEntity } from './entities/record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity, ModuleDefinitionEntity])],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
